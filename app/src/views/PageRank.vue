<template>
  <div class="main-content">
    <h3>PageRank Algorithm</h3>
    <section>

      Consider this graph of the internet. Each node represents a web page, with each arrow representing a link from one webpage to another.<br/>
      <GraphDiagram :graph="adj_matrix"/>

      <AppButton @click.native="make_random_graph" >Randomize</AppButton>
      <p></p>
      We wish to find an 'importance' score <Math>$\rho(P_i)$</Math> for each page <Math>$P_i$</Math> which satisfies the following:
      <p></p>
      <Math>$$
        \rho(P_i) = \sum_{P_j:P_j \to P_i} \frac{\rho(P_j)}{\#(P_j)}
        $$</Math>
      <p></p>
      Where <Math>$\#(P_j)$</Math> is the number of outgoing links from <Math>$P_j$</Math>.
      <p></p>
      We can construct the corresponding Google matrix:
      <p></p>
      <DynamicMath :data="g1_matrix_string"/>

      <p></p>
      <DynamicMath :data="g2_matrix_string"/>

      <p></p>
      Selecting <Math>$\alpha = \frac{85}{100}$</Math>. $The final matrix <Math>$G$</Math> will be:
      <p></p>
      <DynamicMath :data="g_matrix_string"/>

      <p></p>
      We can now iterate to approach a stationary distribution <Math>$\boldsymbol{\rho}$</Math> using the update rule:
      <Math>$$ (\boldsymbol{\rho}^{(t+1)})^{T} = (\boldsymbol{\rho}^{(t)})^{T}G $$</Math>
      <p></p>
      Initialising each <Math>$\rho^{(0)}_i = \frac{1}{N}$</Math>, we have:
      <!-- fixed height hack to stop jumpy update -->
      <div :style="`min-height:${33*adj_matrix.length}px;`">
        <DynamicMath :data="iterate_string"/>
      </div>
      <p></p>
      <AppButton @click.native="do_iteration" :disabled="t >= 100">1 Iteration ></AppButton>
      <AppButton @click.native="do_iteration_10" :disabled="t >= 100">10 Iterations >></AppButton>
      <AppButton @click.native="init_iteration" :type="'warning'">Reset</AppButton>
      <p></p>
      After {{ t + 1 }} iterations, <DynamicMath :data="iteration_norm_string"/>
      <p></p>
      We now rank the webpages from most to least important:
      <p></p>
      <DynamicMath :data="ranked_pages_string"/>

    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphDiagram from '@/components/PageRank/GraphDiagram.vue'
import { random_graph, get_G1_matrix, get_G2_matrix, get_G_matrix, pagerank_iterate } from '@/algorithms/pagerank.ts'

@Component({ components: { GraphDiagram } })
export default class PageRank extends Vue {
  adj_matrix: number[][] = []
  g1_matrix_string: string = ''
  g2_matrix_string: string = ''
  g_matrix_string: string = ''
  iterate_string: string = ''
  iteration_norm_string: string = ''
  ranked_pages_string: string = ''

  g: number[][][] = []
  it_0: number[][] = []
  it_t: number[][] = []
  it_next: number[][] = []
  t: number = 0

  get_ranked_pages(): number[] {
    const pages: any[] = this.it_next.map( (curr:number[], page:number)=>({ page, val:curr[0]/curr[1] }) )
    pages.sort((a:any, b:any) => b.val - a.val)
    return pages.map((curr:any) => curr.page)
  }

  make_random_graph() {
    this.adj_matrix = random_graph(Math.floor(Math.random()*(9-6)) + 6)
    const g1: number[][][] = get_G1_matrix(this.adj_matrix)
    this.g1_matrix_string = `$$G_1 = \\begin{bmatrix} ${this.get_matrix_frac_string(g1)} \\end{bmatrix}$$`
    const g2: number[][][] = get_G2_matrix(g1)
    this.g2_matrix_string = `$$G_2 = \\begin{bmatrix} ${this.get_matrix_frac_string(g2)} \\end{bmatrix}$$`
    this.g = get_G_matrix(g2, [85,100])
    this.g_matrix_string = `$$G = \\begin{bmatrix} ${this.get_matrix_frac_string(this.g)} \\end{bmatrix}$$`
    this.init_iteration()
  }

  // (and update the string)
  init_iteration() {
    this.t = -1
    this.it_0 = new Array<number[]>(this.g.length).fill([]).map((a:number[]) => [1,this.g.length])
    this.it_next = this.it_0
    this.do_iteration()
  }

  // (and update the string)
  do_iteration() {
    this.t++
    this.it_t = this.it_next
    this.it_next = pagerank_iterate(this.it_t, this.g)
    const iter_t: string = `\\begin{bmatrix} ${this.get_matrix_frac_string(this.it_t.map((el:number[]) => [el]))} \\end{bmatrix}`
    const iter_next: string = `\\begin{bmatrix} ${this.get_matrix_frac_string(this.it_next.map((el:number[]) => [el]))} \\end{bmatrix}`
    this.iterate_string = `$$ (\\boldsymbol{\\rho^{(${this.t + 1})}})^{T} = \\left(${iter_next}^{(${this.t + 1})}\\right)^{T} = \\left(${iter_t}^{(${this.t})}\\right)^{T}G = (\\boldsymbol{\\rho}^{(${this.t})})^{T}G $$`
    this.iteration_norm_string = this.get_iteration_norm_string()
    this.ranked_pages_string = `$$ ${this.get_ranked_pages()} $$`
  }

  do_iteration_10() {
    // do 9 then call do_iteration once
    for(let i = 0; i < 9; ++i) {
      this.t++
      this.it_t = this.it_next
      this.it_next = pagerank_iterate(this.it_t, this.g)
    }
    this.do_iteration()
  }

  get_iteration_norm_string(): string {
    const diff: number[] = this.it_next.map((next:number[], i:number) => next[0]/next[1] - this.it_t[i][0]/this.it_t[i][1])
    const norm: number = Math.sqrt(diff.map((a:number)=>a*a).reduce((acc:number, curr:number) => acc+curr, 0))
    return `$\\left\\Vert\\boldsymbol{\\rho}^{(${this.t + 1})} - \\boldsymbol{\\rho}^{(${this.t})}\\right\\Vert_{2} \\approx ${norm}$`
  }

  get_matrix_frac_string(mat: number[][][]): string {
    const str_mat: string[][] = mat.map(
      (row:number[][]) => row.map(
        (el:number[]) => {
          if (el[0] === 0) return '0'
          else if ( el[0] === el[1]) return '1'
          // abandon fractions after a certain point
          else if ( el[0] >= 10000 || el[1] >= 10000) return `${(el[0]/el[1]).toFixed(4)}`
          else return `\\frac{${el[0]}}{${el[1]}}`
        }))
    return str_mat.map((row:string[]) => row.join(' & ')).join(' \\\\ ')
  }

  created() {
    this.make_random_graph()
  }

}
</script>

<style scoped lang="less">
section {
  background: var(--color-white);
}

</style>
