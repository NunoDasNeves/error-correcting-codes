<template>
  <div>
    <h3>Trellis Diagram</h3>
    The Trellis Diagram below visualises the process of using the Viterbi Algorithm to decode an encoded message.
    <p></p>
    The algorithm works by attempting to retrace the encoder's steps and infer the most likely sequence of states which led to the given sequence of symbols, using the Hamming distance as a proxy for likelyhood.

    <AppSpoiler :title="'More on the Hamming distance'">
      The Hamming distance <Math>$h(x, y)$</Math> is defined by:<br/>
      <Math>$$
        \boldsymbol{x} = x_1, x_2, ..., x_k \\
        \boldsymbol{y} = y_1, y_2, ..., y_k \\
        x_i, y_i \in \{0, 1\}\ \ 1 \leq i \leq k \\
        h(\boldsymbol{x},\boldsymbol{y}) = \sum_{i=1}^{k}|x_i - y_i|
        $$</Math>
    </AppSpoiler>

    To compute each <span style="color:var(--color-light-blue);font-weight:bold;">new entry</span> of the table, up to two previous states are considered.<br>
    For each of these, the Hamming distance between the expected output symbol and the <span style="color:var(--color-green);font-weight:bold;">actual output symbol</span> is computed, and added to the accumulated hamming distance from the previous state.<br>
    The minimum of these is taken to be the most likely.
    <p></p>
    A dashed line
    (<AppSvg
    :width="TRELLIS_LABEL_WIDTH"
    :height="SMALL_LABEL_HEIGHT/2">
      <polyline
        :points="`0 ${SMALL_LABEL_HEIGHT/4}, ${TRELLIS_LABEL_WIDTH} ${SMALL_LABEL_HEIGHT/4}`"
        :stroke-dasharray="DASH_ARRAY"
        stroke="black" stroke-width='2' fill='transparent'/>
    </AppSvg>)
     is drawn if the input bit that produced the state transition was a <Math>$0$</Math>,
    and a solid line
    (<AppSvg
    :width="TRELLIS_LABEL_WIDTH"
    :height="SMALL_LABEL_HEIGHT/2">
      <polyline
        :points="`0 ${SMALL_LABEL_HEIGHT/4}, ${TRELLIS_LABEL_WIDTH} ${SMALL_LABEL_HEIGHT/4}`"
        stroke="black" stroke-width='2' fill='transparent'/>
    </AppSvg>)
    is drawn for a <Math>$1$</Math>.
    <p></p>
    Since we know the encoder's initial state, some states are impossible at early stages of decoding. These are denoted with <span style="color:red;font-size:1.5em;">X</span><br/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TrellisDiagramInfo extends Vue {

  MARGIN: number = 2

  SCALING_FACTOR: number = 1/4
  SQUARE_WIDTH:number = 175 * this.SCALING_FACTOR
  CHAR_WIDTH: number = 46 * this.SCALING_FACTOR

  OUTPUT_LABEL_WIDTH:number = this.CHAR_WIDTH*5
  TRELLIS_LABEL_WIDTH:number = this.SQUARE_WIDTH + this.CHAR_WIDTH*3
  SMALL_LABEL_HEIGHT:number = this.SQUARE_WIDTH * 2/3

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
