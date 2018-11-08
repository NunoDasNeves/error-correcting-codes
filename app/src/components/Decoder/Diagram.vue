<template>
  <div>
    <AppSvg
      :width="STATE_LABEL_WIDTH + STATES_TRELLIS_GAP + (TRELLIS_LABEL_WIDTH + TRELLIS_HORIZ_GAP)*3 + MARGIN*2"
      :height="TRELLIS_OFFSET + states.length*(SQUARE_WIDTH + TRELLIS_VERT_GAP) - TRELLIS_VERT_GAP + MARGIN*2">

      <g :transform="`translate(${MARGIN},${MARGIN})`">

        <!-- state labels -->
        <g :transform="`translate(0,${TRELLIS_OFFSET})`">
          <g v-for="(_, s) in states" :transform="`translate(0,${s*(SQUARE_WIDTH + TRELLIS_VERT_GAP)})`">
            <rect
                :width="STATE_LABEL_WIDTH" :height="SQUARE_WIDTH"
                stroke='black' stroke-width='2'
                fill='white'/>
            <text
              :x="STATE_LABEL_WIDTH/2" :y="SQUARE_WIDTH*TEXT_BOX_VERT"
              :style="`font-size:${FONT_SIZE};`"
              class="decoder-svg-text">
              <tspan text-anchor="middle">
                {{ numberToArray(s).join('') }}
              </tspan>
            </text>
          </g>
        </g>

        <!-- background rectangles -->
        <g
          v-for="_, s in states"
          :transform="`translate(${STATE_LABEL_WIDTH + STATES_TRELLIS_GAP/2},${TRELLIS_OFFSET + s*SQUARE_WIDTH*2})`">
          <rect
              :width="3*(TRELLIS_HORIZ_GAP + TRELLIS_LABEL_WIDTH)" :height="SQUARE_WIDTH"
              fill='var(--color-light-gray)'/>
        </g>


        <!-- trellis including output labels -->
        <g :transform="`translate(${STATE_LABEL_WIDTH + STATES_TRELLIS_GAP},0)`">

          <!--rect
              :width="CHAR_WIDTH" :height="SMALL_LABEL_HEIGHT"
              stroke="black" stroke-width='2'
              fill='white'/-->

          <!-- output labels -->
          <g :transform="`translate(${TRELLIS_LABEL_WIDTH + TRELLIS_HORIZ_GAP/2 - OUTPUT_LABEL_WIDTH/2},0)`">

            <g v-for="(symbol, i) in symbols" :transform="`translate(${i*(TRELLIS_HORIZ_GAP + TRELLIS_LABEL_WIDTH)},0)`">
              <rect
                  :width="OUTPUT_LABEL_WIDTH" :height="SMALL_LABEL_HEIGHT"
                  :stroke="(((decoder.table.length <= 2 && i == 0) || (decoder.table.length > 2 && i == 1)) && !decoder.finished) ? 'red' : 'black'" stroke-width='2'
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
          <g :transform="`translate(0, ${TRELLIS_OFFSET + SQUARE_WIDTH/2 - SMALL_LABEL_HEIGHT/2})`">

            <!-- table entries -->
            <g v-for="(entry, i) in table" :transform="`translate(${i*(TRELLIS_HORIZ_GAP + TRELLIS_LABEL_WIDTH)},0)`">
              <!-- trellis labels -->
              <g v-for="(state, j) in entry" :transform="`translate(0,${j*(TRELLIS_VERT_GAP + SQUARE_WIDTH)})`">
                <rect
                    :width="TRELLIS_LABEL_WIDTH" :height="SMALL_LABEL_HEIGHT"
                    stroke='black' stroke-width='2'
                    fill='white'/>
                <text
                  v-if="state.hamming < Number.MAX_SAFE_INTEGER"
                  :x="TRELLIS_LABEL_WIDTH/2" :y="SMALL_LABEL_HEIGHT*TEXT_BOX_VERT"
                  :style="`font-size:${FONT_SIZE_SMALL};`"
                  >
                  <tspan text-anchor="middle">
                    {{ state.hamming }}
                  </tspan>
                </text>
                <!-- invalid states -->
                <g
                  :transform="`translate(${TRELLIS_LABEL_WIDTH*0.28},${SMALL_LABEL_HEIGHT*0.125})`"
                  v-if="state.hamming >= Number.MAX_SAFE_INTEGER"
                  >
                    <text fill="red" font-size="2.5em" rotate="90">X</text>
                </g>
              </g>

              <!-- trellis links -->
              <g v-for="(state, j) in entry" v-if="i > 0" :transform="`translate(0,${SMALL_LABEL_HEIGHT/2 + j*(TRELLIS_VERT_GAP + SQUARE_WIDTH)})`">
                <polyline
                  v-if="table[i-1][state.prev].hamming < Number.MAX_SAFE_INTEGER"
                  :points="`0 0, ${-TRELLIS_HORIZ_GAP} ${(state.prev - j)*(TRELLIS_VERT_GAP + SQUARE_WIDTH)}`"
                  :stroke-dasharray="`${state.bit ? 'none' : DASH_ARRAY}`"
                  stroke="black" stroke-width='2' fill='transparent'/>
              </g>
            </g>

            <!-- next entry, i.e. entry corresponding to decoder.curr_state at the last position in the table -->
            <g
              v-if="!decoder.finished"
              :transform="`translate(${(table.length - 1)*(TRELLIS_HORIZ_GAP + TRELLIS_LABEL_WIDTH)},${decoder.curr_state*(TRELLIS_VERT_GAP + SQUARE_WIDTH)})`"
              >
              <rect
                  :width="TRELLIS_LABEL_WIDTH*2.5" :height="SMALL_LABEL_HEIGHT"
                  stroke='red' stroke-width='2'
                  fill='white'/>
              <text
                :x="TRELLIS_LABEL_WIDTH*2.5/2" :y="SMALL_LABEL_HEIGHT*TEXT_BOX_VERT"
                :style="`font-size:${FONT_SIZE_SMALL};`"
                >
                <tspan text-anchor="middle">
                  {{ get_curr_state_text(curr_state_obj) }}
                </tspan>
              </text>

              <g
                v-for="prev_state in curr_state_obj.prev"
                v-if="prev_state.hamming < Number.MAX_SAFE_INTEGER"
                :transform="`translate(0,${SMALL_LABEL_HEIGHT/2})`"
                >
                <polyline
                  :points="`0 0, ${-TRELLIS_HORIZ_GAP} ${(prev_state.state - decoder.curr_state)*(TRELLIS_VERT_GAP + SQUARE_WIDTH)}`"
                  :stroke-dasharray="`${curr_state_obj.bit ? 'none' : DASH_ARRAY}`"
                  stroke="red" stroke-width='2' fill='transparent'/>
                <!-- output label -->
                <g :transform="`translate(${-TRELLIS_HORIZ_GAP*0.7 - OUTPUT_LABEL_WIDTH/2}, ${(prev_state.state - decoder.curr_state)*(TRELLIS_VERT_GAP + SQUARE_WIDTH)*0.7 - SMALL_LABEL_HEIGHT/2})`">
                  <rect
                    :width="OUTPUT_LABEL_WIDTH" :height="SMALL_LABEL_HEIGHT"
                    stroke='red' stroke-width='2'
                    fill='white'/>
                  <text
                    :x="OUTPUT_LABEL_WIDTH/2" :y="SMALL_LABEL_HEIGHT*TEXT_BOX_VERT"
                    :style="`font-size:${FONT_SIZE_SMALL};`"
                    class="decoder-svg-text">
                    <tspan text-anchor="middle">
                      {{ prev_state.output.join('') }}
                    </tspan>
                  </text>
                </g>
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

  // useful stuff for curr state
  get curr_state_obj(): any {
    // just state as a number
    const index: number = this.decoder.curr_state
    // bit transitioned on to get to this state
    const bit: number = this.decoder.get_prev_bit(index)
    // states we possibly transitioned from
    const prev_states: number[] = this.decoder.get_prev(index)
    // more info about those states..
    const prev: any[] = prev_states.map(s => ({
      state: s,
      hamming: this.decoder.table[this.decoder.table.length - 2][s].hamming,
      output: this.decoder.graph[s].output[bit],
      add_hamming: this.decoder.hamming(this.symbols[1], this.decoder.graph[s].output[bit])
    }))

   return {
     index,
     bit,
     prev
   }
  }

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

  get_curr_state_text(): string {
    const prev:any[] = this.curr_state_obj.prev.filter((curr:any) => curr.hamming < Number.MAX_SAFE_INTEGER)
    if (prev.length == 0) {
      return "N/A"
    } else if (prev.length == 1) {
      return `${prev[0].hamming} + ${prev[0].add_hamming}`
    }
    return `min(${this.curr_state_obj.prev[0].hamming} + ${this.curr_state_obj.prev[0].add_hamming}, ${this.curr_state_obj.prev[1].hamming} + ${this.curr_state_obj.prev[1].add_hamming})`
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

  CHAR_WIDTH: number = 46*this.SCALING_FACTOR
  OUTPUT_LABEL_WIDTH:number = this.CHAR_WIDTH*(this.decoder.n + 2)
  TRELLIS_LABEL_WIDTH:number = this.SQUARE_WIDTH + this.CHAR_WIDTH*(this.decoder.K - 1)
  SMALL_LABEL_HEIGHT:number = this.SQUARE_WIDTH*2/3
  BIT_LABEL_WIDTH:number = this.CHAR_WIDTH*4

  // textboxheight * TEXT_BOX_VERT is where text should start on y axis
  TEXT_BOX_VERT: number = 0.75

  DASH_ARRAY:number = 6


}
</script>

<style scoped lang="less">
.decoder-svg-text {
  font-family: var(--font-monospace);
}
</style>
