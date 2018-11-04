<template>
  <div>
    <AppSvg
      :width="STATE_LABEL_WIDTH + STATES_TRELLIS_GAP + TRELLIS_LABEL_WIDTH + (TRELLIS_LABEL_WIDTH + TRELLIS_HORIZ_GAP)*5 + MARGIN*2"
      :height="TRELLIS_OFFSET + states.length*(SQUARE_WIDTH + TRELLIS_VERT_GAP) + MARGIN*2">

      <g :transform="`translate(${MARGIN},${MARGIN})`">

        <!-- state labels -->
        <g :transform="`translate(0,${TRELLIS_OFFSET})`">
          <g v-for="(_, s) in states" :transform="`translate(0,${s*(SQUARE_WIDTH + TRELLIS_VERT_GAP)})`">
            <rect
                :width="STATE_LABEL_WIDTH" :height="SQUARE_WIDTH"
                stroke='black' stroke-width='2'
                fill='transparent'/>
            <text
              :x="SQUARE_WIDTH*0.3" :y="SQUARE_WIDTH*0.76"
              :style="`font-size:${FONT_SIZE};`"
              class="decoder-svg-text">
              {{ numberToArray(s).join('') }}
            </text>
          </g>
        </g>

        <!-- trellis with output labels -->
        <g :transform="`translate(${STATE_LABEL_WIDTH + STATES_TRELLIS_GAP},0)`">

          <!-- output labels -->
          <g :transform="`translate(${TRELLIS_LABEL_WIDTH + TRELLIS_HORIZ_GAP/2 - OUTPUT_LABEL_WIDTH/2},0)`">

            <g v-for="(symbol, i) in symbols" :transform="`translate(${i*(TRELLIS_HORIZ_GAP + TRELLIS_LABEL_WIDTH)},0)`">
              <rect
                  :width="OUTPUT_LABEL_WIDTH" :height="SMALL_LABEL_HEIGHT"
                  stroke='black' stroke-width='2'
                  fill='transparent'/>
              <text
                :x="OUTPUT_LABEL_WIDTH*0.3" :y="SMALL_LABEL_HEIGHT*0.76"
                :style="`font-size:${FONT_SIZE_SMALL};`"
                class="decoder-svg-text">
                {{ symbol.join('') }}
              </text>
            </g>

          </g>

          <!-- trellis - just the actual trellis -->
          <g :transform="`translate(0, ${TRELLIS_OFFSET + SQUARE_WIDTH/2 - SMALL_LABEL_HEIGHT/2})`">

            <!-- table entries -->
            <g v-for="(entry, i) in table" :transform="`translate(${i*(TRELLIS_HORIZ_GAP + TRELLIS_LABEL_WIDTH)},0)`">
              <g v-for="(state, j) in entry" :transform="`translate(0,${j*(TRELLIS_VERT_GAP + SQUARE_WIDTH)})`">
                <rect
                    :width="TRELLIS_LABEL_WIDTH" :height="SMALL_LABEL_HEIGHT"
                    stroke='black' stroke-width='2'
                    fill='transparent'/>
                <text
                  :x="TRELLIS_LABEL_WIDTH*0.3" :y="SMALL_LABEL_HEIGHT*0.76"
                  :style="`font-size:${FONT_SIZE_SMALL};`"
                  >
                  {{ state.hamming }}
                </text>
              </g>
            </g>

          </g>

        </g> <!-- trellis with output labels -->

      </g> <!--margin-->

    </AppSvg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Decoder, numberToArray } from '@/algorithms/viterbi_encoder_decoder.ts'

@Component
export default class TrellisDiagram extends Vue {
  @Prop(Object)
  decoder!: Decoder

  // starting index of current view into table/symbols
  get curr_i(): number {
    return Math.max(0, this.decoder.i - this.decoder.n)
  }

  get table(): number[][] {
    return this.decoder.table.slice(this.curr_i/this.decoder.n, this.curr_i/this.decoder.n + 4)
  }

  // array of numbered states for convenience
  get states(): number[] {
    return new Array<number>(this.decoder.N).fill(0)
  }

  get symbols(): number[][] {
    return this.decoder.input
      .slice(this.curr_i, this.curr_i + this.decoder.n*3)
      .reduce((acc: number[][], curr: number, i: number) => {
      if (i % this.decoder.n == 0) {
        acc.push([])
      }
      acc[acc.length - 1].push(curr)
      return acc
    }, [])
  }

  numberToArray(s: number) :number[] { return numberToArray(s, this.decoder.K - 1) }

  SCALING_FACTOR: number = 1/this.decoder.N
  MARGIN: number = 30
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
  STATE_LABEL_WIDTH:number = this.SQUARE_WIDTH + this.STATE_CHAR_WIDTH*(this.decoder.K - 1)

  CHAR_WIDTH: number = 24*this.SCALING_FACTOR
  OUTPUT_LABEL_WIDTH:number = this.SQUARE_WIDTH + this.CHAR_WIDTH*(this.decoder.n)
  TRELLIS_LABEL_WIDTH:number = this.SQUARE_WIDTH + this.CHAR_WIDTH*(this.decoder.K - 1)
  SMALL_LABEL_HEIGHT:number = this.SQUARE_WIDTH*2/3


}
</script>

<style scoped lang="less">
.decoder-svg-text {
  font-family: var(--font-monospace);
}
</style>
