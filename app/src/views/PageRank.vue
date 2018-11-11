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
      Selecting <Math>$\alpha = \frac{85}{100}$</Math>. The final matrix <Math>$G$</Math> will be:
      <p></p>
      <DynamicMath :data="g_matrix_string"/>

      <p></p>
      We can now iterate to approach a stationary distribution <Math>$\boldsymbol{\rho}$</Math> using the update:
      <Math>$$ (\boldsymbol{\rho}^{(t+1)})^{T} = (\boldsymbol{\rho}^{(t)})^{T}G $$</Math>
      <p></p>
      Initialising with <Math>$\rho^{(0)}_i = \frac{1}{N}$</Math> we can approach the solution. Note that we have to stop using fractions at this point as the numbers become insane:
      <DynamicMath :data="iterate_string"/>
      <AppButton @click.native="do_iteration">Next</AppButton><br/>

      <AppButton @click.native="" :type="'warning'">Back</AppButton>

      <AppButton @click.native="" :type="'green'">Finish</AppButton>

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

  g: number[][][] = []
  iteration_0: number[][] = []
  iteration_t: number[][] = []
  iteration_next: number[][] = []
  t: number = 0

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
    this.iteration_0 = new Array<number[]>(this.g.length).fill([]).map((a:number[]) => [1,this.g.length])
    this.iteration_next = this.iteration_0
    this.do_iteration()
  }

  // (and update the string)
  do_iteration() {
    this.t++
    this.iteration_t = this.iteration_next
    this.iteration_next = pagerank_iterate(this.iteration_t, this.g)
    const iter_t: string = `\\begin{bmatrix} ${this.get_matrix_frac_string(this.iteration_t.map((el:number[]) => [el]))} \\end{bmatrix}`
    const iter_next: string = `\\begin{bmatrix} ${this.get_matrix_frac_string(this.iteration_next.map((el:number[]) => [el]))} \\end{bmatrix}`
    this.iterate_string = `$$ ${iter_next}^{(${this.t + 1})} = ${iter_t}^{(${this.t})}G $$`
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
