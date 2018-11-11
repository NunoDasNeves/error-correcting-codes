<template>
  <div>
    <AppSvg :width="WIDTH + MARGIN*2" :height="HEIGHT + MARGIN*2">
      <defs>
        <!-- arrow head -->
        <marker id="arrow" viewBox="0 0 10 10" refX="0" refY="5"
            markerWidth="6" :markerHeight="MARKER_HEIGHT"
            orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>

      <g :transform="`translate(${MARGIN},${MARGIN})`">

        <!-- background -->
        <rect :width="WIDTH" :height="HEIGHT" fill="var(--color-light-gray)"/>

        <!-- translate to center -->
        <g :transform="`translate(${WIDTH/2},${HEIGHT/2})`">

          <!-- each graph node -->
          <g v-for="(links, i) in graph">
            <!-- node itself -->
            <g :transform="`translate(${BIG_RADIUS*node_x(i)},${BIG_RADIUS*node_y(i)})`">
              <circle
                :cx="0" :cy="0"
                :r="SMALL_RADIUS" fill="var(--color-green)"/>
              <text
                :style="`font-size:${FONT_SIZE};`"
                :y="TEXT_OFFSET"
                fill="white"
                class="encoder-svg-text">
                <tspan text-anchor="middle">
                  {{ i }}
                </tspan>
              </text>
            </g>
        </g>

        <!-- connections to other nodes; links from i to j -->
        <g v-for="(links, i) in graph">
            <polyline
              v-for="(v, j) in links"
              v-if="v == 1"
              :points="line_points(i, j)"
              marker-end='url(#arrow)'
              stroke="black"
              stroke-width='2' fill='transparent'/>
          </g>
        </g>

      </g> <!--margin-->

    </AppSvg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class GraphDiagram extends Vue {
  // square directional adjacency matrix
  @Prop(Array)
  graph!: number[][]

  MARGIN: number = 10
  WIDTH: number = 500
  HEIGHT: number = 500

  SCALING_FACTOR: number = 1/this.graph.length
  FONT_SIZE: string = `${7 * this.SCALING_FACTOR}em`
  SMALL_RADIUS: number = 150 * this.SCALING_FACTOR
  TEXT_OFFSET: number = this.SMALL_RADIUS*0.25

  MARKER_HEIGHT: number = 6

  BIG_RADIUS: number = Math.min(this.WIDTH, this.HEIGHT)/2 - this.SMALL_RADIUS*2

  GEN_COLORS:string[] = ['red', 'blue', 'green', 'orange', 'purple', 'black']

  node_x(index: number): number {
    return Math.cos(index*2*Math.PI/this.graph.length)
  }

  node_y(index: number): number {
    return Math.sin(index*2*Math.PI/this.graph.length)
  }

  line_points(i: number, j:number): string {
    const f: number = this.BIG_RADIUS - this.SMALL_RADIUS
    const i_p: number[] = [this.BIG_RADIUS*this.node_x(i), this.BIG_RADIUS*this.node_y(i)]
    const j_p: number[] = [this.BIG_RADIUS*this.node_x(j), this.BIG_RADIUS*this.node_y(j)]
    const v: number[] = [j_p[0] - i_p[0], j_p[1] - i_p[1]]
    const v_len: number = Math.sqrt(v.map(x => x*x).reduce((acc, curr) => acc + curr))
    const v_unit: number[] = v.map(x => x/v_len)
    const i_edge: number[] = [i_p[0] + v_unit[0]*this.SMALL_RADIUS, i_p[1] + v_unit[1]*this.SMALL_RADIUS]
    const j_edge: number[] = [j_p[0] - v_unit[0]*(this.SMALL_RADIUS + this.MARKER_HEIGHT*2), j_p[1] - v_unit[1]*(this.SMALL_RADIUS + this.MARKER_HEIGHT*2)]
    return `${i_edge[0]} ${i_edge[1]}, ${j_edge[0]} ${j_edge[1]}`
  }

}
</script>

<style scoped lang="less">
.encoder-svg-text {
  font-family: var(--font-monospace);
}
</style>
