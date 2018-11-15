<template>
  <div>
    <AppSvg
      :width="STATE_LABEL_WIDTH + STATES_TRELLIS_GAP + (TRELLIS_RECT_SIZE + TRELLIS_HORIZ_GAP)*5 + MARGIN*2"
      :height="TRELLIS_OFFSET + states.length*(SQUARE_WIDTH + TRELLIS_VERT_GAP) - TRELLIS_VERT_GAP + MARGIN*2">

      <g :transform="`translate(${MARGIN},${MARGIN})`">

        <!-- state labels -->
        <g :transform="`translate(0,${TRELLIS_OFFSET})`">
          <!-- 'encoder states' text -->
          <g :transform="`translate(${-SQUARE_WIDTH*0.25},${(SQUARE_WIDTH + TRELLIS_VERT_GAP)*states.length/2})`">
            <g transform="rotate(-90)">
              <text
                :style="`font-size:${FONT_SIZE_SMALL};`">
                <tspan text-anchor="middle">
                  encoder states
                </tspan>
              </text>
            </g>
          </g>
          <!-- the actual labels -->
          <g v-for="(s, i) in states" :transform="`translate(0,${i*(SQUARE_WIDTH + TRELLIS_VERT_GAP)})`">
            <rect
                :width="STATE_LABEL_WIDTH" :height="SQUARE_WIDTH"
                stroke='black' stroke-width='2'
                fill='white'/>
            <text
              :x="STATE_LABEL_WIDTH/2" :y="SQUARE_WIDTH*TEXT_BOX_VERT"
              :style="`font-size:${FONT_SIZE};`"
              class="decoder-svg-text">
              <tspan text-anchor="middle">
                {{ s.join('') }}
              </tspan>
            </text>
          </g>
        </g>

        <!-- row background rectangles -->
        <g
          v-for="_, s in states"
          :transform="`translate(${STATE_LABEL_WIDTH + STATES_TRELLIS_GAP/2},${TRELLIS_OFFSET + s*SQUARE_WIDTH*2})`">
          <rect
              :width="6*(TRELLIS_HORIZ_GAP + TRELLIS_RECT_SIZE) + STATES_TRELLIS_GAP/2" :height="SQUARE_WIDTH"
              fill='var(--color-light-gray)'/>
        </g>

        <!-- trellis including output labels -->
        <g :transform="`translate(${STATE_LABEL_WIDTH + STATES_TRELLIS_GAP},0)`">

          <!-- output labels background rectangle -->
          <g
            :transform="`translate(${TRELLIS_RECT_SIZE + TRELLIS_HORIZ_GAP/2 - OUTPUT_LABEL_WIDTH},${-SMALL_LABEL_HEIGHT/4})`">
            <rect
                :width="4*(TRELLIS_HORIZ_GAP + TRELLIS_RECT_SIZE) + OUTPUT_LABEL_WIDTH*2" :height="SQUARE_WIDTH"
                fill='var(--color-gray)'/>
            <!-- 'encoded symbols' text -->
            <g
              :transform="`translate(${2*(TRELLIS_HORIZ_GAP + TRELLIS_RECT_SIZE) + OUTPUT_LABEL_WIDTH},${-SMALL_LABEL_HEIGHT/4})`">
              <text
                :style="`font-size:${FONT_SIZE_SMALL};`">
                <tspan text-anchor="middle">
                  symbols
                </tspan>
              </text>
            </g>
          </g>

          <!-- output labels -->
          <g :transform="`translate(${TRELLIS_RECT_SIZE + TRELLIS_HORIZ_GAP/2 - OUTPUT_LABEL_WIDTH/2},0)`">

            <g v-for="(symbol, i) in encoder.outputs" :transform="`translate(${i*(TRELLIS_HORIZ_GAP + TRELLIS_RECT_SIZE)},0)`">
              <rect
                  :width="OUTPUT_LABEL_WIDTH" :height="SMALL_LABEL_HEIGHT"
                  stroke="black" stroke-width='2'
                  fill='white'/>
              <text
                :x="OUTPUT_LABEL_WIDTH/2" :y="SMALL_LABEL_HEIGHT*TEXT_BOX_VERT"
                :style="`font-size:${FONT_SIZE_SMALL};`"
                class="decoder-svg-text">
                <tspan text-anchor="middle">
                  {{ symbol.join('') }}
                </tspan>
              </text>
            </g>

          </g>

          <!-- trellis - just the actual trellis -->
          <g :transform="`translate(0, ${TRELLIS_OFFSET + SQUARE_WIDTH/2 - TRELLIS_RECT_SIZE/2})`">

            <!-- table -->
            <g v-for="(entry, i) in encoder.states" :transform="`translate(${i*(TRELLIS_HORIZ_GAP + TRELLIS_RECT_SIZE)},0)`">
              <!-- trellis labels -->
              <g v-for="(state, j) in states" :transform="`translate(0,${j*(TRELLIS_VERT_GAP + SQUARE_WIDTH)})`">
                <rect
                    :width="TRELLIS_RECT_SIZE" :height="TRELLIS_RECT_SIZE"
                    stroke='none'
                    fill='black'/>
                <!-- invalid states -->
                <!--g
                  :transform="`translate(${TRELLIS_RECT_SIZE/2},${SMALL_LABEL_HEIGHT*TEXT_BOX_VERT})`"
                  v-if="state.hamming >= Number.MAX_SAFE_INTEGER"
                  >
                    <text fill="red" font-size="1.5em" ><tspan text-anchor="middle">X</tspan></text>
                </g-->
              </g>

              <!-- trellis links -->
              <!--g v-for="(state, j) in entry" v-if="i > 0" :transform="`translate(0,${SMALL_LABEL_HEIGHT/2 + j*(TRELLIS_VERT_GAP + SQUARE_WIDTH)})`">
                <polyline
                  v-if="table[i-1][state.prev].hamming < Number.MAX_SAFE_INTEGER"
                  :points="`0 0, ${-TRELLIS_HORIZ_GAP} ${(state.prev - j)*(TRELLIS_VERT_GAP + SQUARE_WIDTH)}`"
                  :stroke-dasharray="`${state.bit ? 'none' : DASH_ARRAY}`"
                  stroke="black" stroke-width='2' fill='transparent'/>
              </g-->
            </g>

          </g> <!-- trellis without output labels -->

        </g> <!-- trellis with output labels -->

      </g> <!--margin-->

    </AppSvg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Encoder, numberToArray } from '@/algorithms/viterbi_encoder_decoder.ts'

@Component
export default class ErrorTrellisDiagram extends Vue {
  @Prop(Object)
  encoder!: Encoder

  // number of states
  N: number = Math.pow(2, this.encoder.K-1)

  // array of numbered states for convenience
  get states(): number[][] {
    return new Array<number>(this.N).fill(0).map((curr, i) => numberToArray(i, this.encoder.K - 1))
  }

  SCALING_FACTOR: number = 2/3/this.N
  MARGIN: number = 40
  FONT_SIZE: string = `${7 * this.SCALING_FACTOR}em`
  FONT_SIZE_SMALL: string = `${5 * this.SCALING_FACTOR}em`
  SQUARE_WIDTH:number = 175 * this.SCALING_FACTOR
  // offset from top to start of trellis and state labels
  TRELLIS_OFFSET:number = this.SQUARE_WIDTH*1.5
  // gap between trellis vertically and horizontally
  TRELLIS_VERT_GAP:number = this.SQUARE_WIDTH
  TRELLIS_HORIZ_GAP:number = this.SQUARE_WIDTH*3
  // horizontal gap between column of states and actual trellis
  STATES_TRELLIS_GAP:number = this.SQUARE_WIDTH
  STATE_CHAR_WIDTH: number = 32*this.SCALING_FACTOR
  STATE_LABEL_WIDTH:number = this.SQUARE_WIDTH + this.STATE_CHAR_WIDTH*(this.encoder.K - 1)

  CHAR_WIDTH: number = 46*this.SCALING_FACTOR
  OUTPUT_LABEL_WIDTH:number = this.CHAR_WIDTH*(this.encoder.n + 2)

  SMALL_LABEL_HEIGHT:number = this.SQUARE_WIDTH*2/3
  BIT_LABEL_WIDTH:number = this.CHAR_WIDTH*4

  TRELLIS_RECT_SIZE:number = this.SQUARE_WIDTH/4

  // textboxheight * TEXT_BOX_VERT is where text should start on y axis
  TEXT_BOX_VERT: number = 0.75
  // svg stroke-dasharray property
  DASH_ARRAY:number = 6


}
</script>

<style scoped lang="less">
.decoder-svg-text {
  font-family: var(--font-monospace);
}
</style>
