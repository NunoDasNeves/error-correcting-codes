<template>
  <div class="main-content">
    <h3>PageRank Algorithm</h3>
    <section>

      Consider this graph of the internet. Each node represents a web page, with each arrow representing a link from one webpage to another.<br/>
      <GraphDiagram :graph="adj_matrix"/>

      <AppButton @click.native="make_random_graph" >Randomize</AppButton>
      <p></p>
      We wish to find an 'importance' score <Math>$\rho(i)$</Math> for each page <Math>$P_i$</Math> which satisfies the following:
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


      <AppButton @click.native="" :type="'warning'">Back</AppButton>

      <AppButton @click.native="" :type="'green'">Finish</AppButton>

    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphDiagram from '@/components/PageRank/GraphDiagram.vue'
import { random_graph, get_G1_matrix } from '@/algorithms/pagerank.ts'

@Component({ components: { GraphDiagram } })
export default class PageRank extends Vue {
  adj_matrix: number[][] = []
  g1_matrix_string: string = ''

  make_random_graph() {
    this.adj_matrix = random_graph(Math.floor(Math.random()*(9-6)) + 6)
    this.g1_matrix_string = this.get_G1_matrix_string()
  }

  get_G1_matrix_string(): string {
    const str_mat: string[][] = get_G1_matrix(this.adj_matrix).map(
      (row:number[][]) => row.map(
        (el:number[]) => el[0] ? `\\frac{${el[0]}}{${el[1]}}` : '0'))
    const inner:string = str_mat.map((row:string[]) => row.join(' & ')).join(' \\\\ ')
    return `$$G_1 = \\begin{bmatrix} ${inner} \\end{bmatrix}$$`
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
