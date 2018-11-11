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

      <DynamicMath :data="g2_matrix_string"/>

      <DynamicMath :data="g_matrix_string"/>


      <AppButton @click.native="" :type="'warning'">Back</AppButton>

      <AppButton @click.native="" :type="'green'">Finish</AppButton>

    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphDiagram from '@/components/PageRank/GraphDiagram.vue'
import { random_graph, get_G1_matrix, get_G2_matrix, get_G_matrix } from '@/algorithms/pagerank.ts'

@Component({ components: { GraphDiagram } })
export default class PageRank extends Vue {
  adj_matrix: number[][] = []
  g1_matrix_string: string = ''
  g2_matrix_string: string = ''
  g_matrix_string: string = ''

  make_random_graph() {
    this.adj_matrix = random_graph(Math.floor(Math.random()*(9-6)) + 6)
    const g1: number[][][] = get_G1_matrix(this.adj_matrix)
    this.g1_matrix_string = `$$G_1 = \\begin{bmatrix} ${this.get_matrix_frac_string(g1)} \\end{bmatrix}$$`
    const g2: number[][][] = get_G2_matrix(g1)
    this.g2_matrix_string = `$$G_2 = \\begin{bmatrix} ${this.get_matrix_frac_string(g2)} \\end{bmatrix}$$`
    const g: number[][][] = get_G_matrix(g2, [85,100])
    this.g_matrix_string = `$$G = \\begin{bmatrix} ${this.get_matrix_frac_string(g)} \\end{bmatrix}$$`
  }

  get_matrix_frac_string(mat: number[][][]): string {
    const str_mat: string[][] = mat.map(
      (row:number[][]) => row.map(
        (el:number[]) => el[0] === 0 ? '0' : ( el[0] === el[1] ? '1' : `\\frac{${el[0]}}{${el[1]}}`)))
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
