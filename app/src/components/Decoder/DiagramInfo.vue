<template>
  <div>
    This diagram is a visualisation of using the Viterbi Algorithm to decode a Convolutional Code.
    <p></p>
    Each row corresponds to one of <Math>$2^{K-1}$</Math> possible encoder states.<br/>
    The symbols listed across the top represent the encoder output.<br/>
    Each table entry contains the minimal accumulated Hamming distance (essentially a likelihood) for the encoder being the corresponding state, given the assumption of minimal errors.<br/>
    <p></p>

    The next entry to be computed is denoted with <span style="color:var(--color-light-blue);font-weight:bold;">blue</span> colouring.<br/>
    The symbol currently being considered is denoted with <span style="color:var(--color-green);font-weight:bold;">green</span> colouring.<br/>
    Up to two lines connect the current entry to the possible previous states, labels on the lines show the output the encoder would have produced along that transition.<br/>
    The Hamming distance $h(x)$ between these symbols and the actual output is the cost function of the algorithm:<br/>
    <Math>$$
      \boldsymbol{x} = x_1, x_2, ..., x_k \\
      \boldsymbol{y} = y_1, y_2, ..., y_k \\
      x_i, y_i \in \{0, 1\}\ \ 1 \leq i \leq k \\
      h(\boldsymbol{x},\boldsymbol{y}) = \sum_{i=1}^{k}|x_i - y_i|
      $$</Math>
    <p></p>

    Since we know the encoder's initial state, some states are impossible for it to be in at early stages of decoding. These states are denoted with:<br/>
    <AppSvg
    :width="TRELLIS_LABEL_WIDTH + MARGIN*2"
    :height="SMALL_LABEL_HEIGHT + MARGIN*2">

      <g :transform="`translate(${MARGIN},${MARGIN})`">
        <rect
          :width="TRELLIS_LABEL_WIDTH" :height="SMALL_LABEL_HEIGHT"
          stroke='black' stroke-width='2'
          fill='white'/>
        <g
          :transform="`translate(${TRELLIS_LABEL_WIDTH/2},${SMALL_LABEL_HEIGHT*TEXT_BOX_VERT})`"
          >
            <text fill="red" font-size="1.5em"><tspan text-anchor="middle">X</tspan></text>
        </g>
      </g>
    </AppSvg>

    <p></p>
    Transitioning from one state to another on a <Math>$0$</Math> is denoted with a dashed line:<br/>
    <AppSvg
    :width="TRELLIS_LABEL_WIDTH + MARGIN*2"
    :height="SMALL_LABEL_HEIGHT + MARGIN*2">
      <polyline
        :points="`0 ${SMALL_LABEL_HEIGHT/2}, ${TRELLIS_LABEL_WIDTH} ${SMALL_LABEL_HEIGHT/2}`"
        :stroke-dasharray="DASH_ARRAY"
        stroke="black" stroke-width='2' fill='transparent'/>
    </AppSvg><br/>

    A solid line is used for <Math>$1$</Math>:<br/>
    <AppSvg
    :width="TRELLIS_LABEL_WIDTH + MARGIN*2"
    :height="SMALL_LABEL_HEIGHT + MARGIN*2">
      <polyline
        :points="`0 ${SMALL_LABEL_HEIGHT/2}, ${TRELLIS_LABEL_WIDTH} ${SMALL_LABEL_HEIGHT/2}`"
        stroke="black" stroke-width='2' fill='transparent'/>
    </AppSvg>

    <p></p>

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
