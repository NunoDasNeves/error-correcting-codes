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
          <!-- top line -->
          <polyline
            :points="top_line_points(i)"
            :stroke="GEN_COLORS[i]"
            stroke-width='2' fill='transparent'/>
          <!-- vertical lines -->

          <!-- XOR gate -->
          <g :transform='`translate(${SQUARE_WIDTH*gen[0].length + TOP_OFFSET - XOR_RADIUS},${i*SQUARE_WIDTH + TOP_OFFSET - XOR_RADIUS})`'>
            <circle
              :cx="XOR_RADIUS" :cy="XOR_RADIUS"
              :r="XOR_RADIUS" fill="white" stroke="black" stroke-width="2"/>
          </g>
        </g>
      </g>

      <!-- input -->
      <g :transform="`translate(0,${SQUARE_WIDTH*(gen[0].length)})`">
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
            style="font-family: var(--font-monospace); font-size:3em;">
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
            style="font-family: var(--font-monospace); font-size:3em;">
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
export default class Encoder3x3 extends Vue {
  // only tested with 3x3 encoder!
  @Prop(Array)
  input!: number[]
  @Prop(Array)
  output!: number[]
  @Prop(Array)
  gen!: number[][]

  MARGIN: number = 25*(this.gen.length - 1)
  SQUARE_WIDTH:number = 25*this.gen.length
  XOR_RADIUS: number = 5*this.gen.length
  TOP_OFFSET: number = this.SQUARE_WIDTH/2 // offset for lines
  GEN_COLORS:string[] = ['red', 'blue', 'green', 'black', 'orange', 'purple']

  top_line_points(index: number): string {
    const SPACE_WIDTH: number = this.SQUARE_WIDTH/this.gen[0].length
    const startX:number = SPACE_WIDTH*index + SPACE_WIDTH/2
    const endX: number = this.SQUARE_WIDTH*(this.gen[0].length + 1)
    const Y:number = this.TOP_OFFSET + index*this.SQUARE_WIDTH
    return `${startX} ${Y}, ${endX} ${Y}`
  }

}
</script>

<style scoped lang="less">


</style>
