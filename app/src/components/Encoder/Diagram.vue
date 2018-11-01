<template>
  <svg version="1.1"
     baseProfile="full"
     :width="SQUARE_WIDTH*(gen[0].length + 2) + MARGIN*2" :height="SQUARE_WIDTH*(gen.length + 1) + MARGIN*2"
     xmlns="http://www.w3.org/2000/svg">

     <g :transform="`translate(${MARGIN},${MARGIN})`">

      <!-- lines and XOR gates -->
      <g>
        <g
          v-for="(g, i) in gen"
          :key="i">
          <!-- horizontal line -->
          <polyline
            :points="horiz_line_points(i)"
            :stroke="GEN_COLORS[i]"
            stroke-width='2' fill='transparent'/>

          <!-- vertical lines -->
          <polyline
            v-for="(v, j) in g"
            v-if="v == 1"
            :points="vert_line_points(i, j)"
            :stroke="GEN_COLORS[i]"
            stroke-width='2' fill='transparent'/>
            />

          <!-- XOR gate -->
          <g :transform='`translate(${SQUARE_WIDTH*gen[0].length + TOP_OFFSET - XOR_RADIUS},${i*SQUARE_WIDTH + TOP_OFFSET - XOR_RADIUS})`'>
            <circle
              :cx="XOR_RADIUS" :cy="XOR_RADIUS"
              :r="XOR_RADIUS" fill="white" stroke="black" stroke-width="2"/>
            <polyline
              :points="`${XOR_RADIUS} ${XOR_RADIUS*0.5}, ${XOR_RADIUS} ${XOR_RADIUS*1.5}`"
              stroke="black" stroke-width='2' fill='transparent'/>
            <polyline
              :points="`${XOR_RADIUS*0.5} ${XOR_RADIUS}, ${XOR_RADIUS*1.5} ${XOR_RADIUS}`"
              stroke="black" stroke-width='2' fill='transparent'/>
          </g>
        </g>
      </g>

      <!-- input -->
      <g :transform="`translate(0,${SQUARE_WIDTH*gen.length})`">
        <g
          v-for="(item, index) in input"
          :key="index"
          :transform="`translate(${index*SQUARE_WIDTH},0)`">
          <rect
            x='0' y='0'
            fill-opacity='0.5'
            stroke='black' stroke-width='2'
            :width="SQUARE_WIDTH" :height="SQUARE_WIDTH"
            :fill="index == 0 ? 'red' : 'transparent'"
            />
          <text
            :x="SQUARE_WIDTH*0.3" :y="SQUARE_WIDTH*0.76"
            :style="`font-size:${FONT_SIZE};`"
            class="encoder-svg-text">
            {{ item }}
          </text>
        </g>
      </g>

      <!-- output -->
      <g :transform="`translate(${SQUARE_WIDTH*(gen[0].length + 1)},0)`">
        <g v-for="(item, index) in output" :key="index" :transform="`translate(0,${index*SQUARE_WIDTH})`">
          <rect
            x='0' y='0'
            stroke='black' stroke-width='2'
            fill='transparent'
            :width="SQUARE_WIDTH" :height="SQUARE_WIDTH"
            />
          <text
            :x="SQUARE_WIDTH*0.3" :y="SQUARE_WIDTH*0.76"
            :style="`font-size:${FONT_SIZE};`"
            class="encoder-svg-text">
            {{ item }}
          </text>
        </g>
      </g>

    </g> <!--margin-->

  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Diagram extends Vue {
  // only tested with 3x3 encoder!
  @Prop(Array)
  input!: number[]
  @Prop(Array)
  output!: number[]
  @Prop(Array)
  gen!: number[][]

  SCALING_FACTOR: number = 1/Math.max(this.gen.length, this.gen[0].length)
  MARGIN: number = 25
  FONT_SIZE: string = `${9 * this.SCALING_FACTOR}em`
  SQUARE_WIDTH:number = 225 * this.SCALING_FACTOR
  XOR_RADIUS: number = 45 * this.SCALING_FACTOR
  TOP_OFFSET: number = this.SQUARE_WIDTH/2 // offset for lines
  GEN_COLORS:string[] = ['red', 'blue', 'green', 'orange', 'purple', 'black']

  horiz_line_points(index: number): string {
    const SPACE_WIDTH: number = this.SQUARE_WIDTH/this.gen.length
    const startX:number = SPACE_WIDTH*index + SPACE_WIDTH/2
    const endX: number = this.SQUARE_WIDTH*(this.gen[0].length + 1)
    const Y:number = this.TOP_OFFSET + index*this.SQUARE_WIDTH
    return `${startX} ${Y}, ${endX} ${Y}`
  }

  vert_line_points(polyIndex: number, inputIndex: number): string {
    const SPACE_WIDTH: number = this.SQUARE_WIDTH/this.gen.length
    const startY:number = this.TOP_OFFSET + polyIndex*this.SQUARE_WIDTH
    const endY: number = this.SQUARE_WIDTH*this.gen.length
    const X:number = SPACE_WIDTH*polyIndex + SPACE_WIDTH/2 + inputIndex*this.SQUARE_WIDTH
    return `${X} ${startY}, ${X} ${endY}`
  }

}
</script>

<style scoped lang="less">
.encoder-svg-text {
  font-family: var(--font-monospace);
}
</style>
