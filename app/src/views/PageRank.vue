<template>
  <div class="main-content">
    <h3>PageRank Algorithm</h3>
    <section>

      Consider this graph of the internet. Each node represents a web page, with each arrow representing a link from one webpage to another.<br/>
      <GraphDiagram :graph="adj_matrix"/>

      <AppButton @click.native="" >Randomize</AppButton>
      <p></p>
      We wish to find an 'importance' score <Math>$\rho(i)$</Math> for each page <Math>$P_i$</Math> which satisfies the following:
      <p></p>
      <Math>$$
        \rho(P_i) = \sum_{P_j:P_j \to P_i} \frac{\rho(P_j)}{\#(P_j)}
        $$</Math>
      <p></p>
      Where <Math>$\#(P_j)$</Math> is the number of outgoing links from <Math>$P_j$</Math>.
      <p></p>
      <DynamicMath :data="'$OI$'"/>
      We can construct the corresponding Google matrix:
      <p></p>
      <DynamicMath :data="`$$G_1 = \\begin{bmatrix} ${G1_matrix_string} \\end{bmatrix}$$`"/>


      <AppButton @click.native="" :type="'warning'">Back</AppButton>

      <AppButton @click.native="" :type="'green'">Finish</AppButton>

    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphDiagram from '@/components/PageRank/GraphDiagram.vue'

@Component({ components: { GraphDiagram } })
export default class PageRank extends Vue {
  adj_matrix: number[][] = [[0,0,0,1,1],[1,1,0,0,0],[0,1,0,0,0],[0,0,0,0,0],[0,1,0,0,1]]

  // last array has 2 elements; top and bottom of a fraction
  get G1_matrix(): number[][][] {
    const links_count: number[] = this.adj_matrix.map((a:number[]) => a.reduce((acc:number, curr:number) => acc+curr))
    const mat: number[][][] = links_count.map((count:number, i:number) => {
      const row = new Array<number[]>(this.adj_matrix.length).fill([0,0])
      if (count === 0) {
        return row
      } else {
        return this.adj_matrix[i].map((curr:number) => curr ? [1,count] : [0,0])
      }
    }, this)
    return mat
  }

  get G1_matrix_string(): string {
    const str_mat: string[][] = this.G1_matrix.map(
      (row:number[][]) => row.map(
        (el:number[]) => el[0] ? `\\frac{${el[0]}}{${el[1]}}` : '0'))
    return str_mat.map((row:string[]) => row.join(' & ')).join('\\\\\n')
  }

}
</script>

<style scoped lang="less">
section {
  background: var(--color-white);
}

</style>
