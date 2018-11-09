<template>
  <div>
    
    <AppSvg
      :width="1"
      :height="1">

      <!--rect
          :width="curr_state_width" :height="SMALL_LABEL_HEIGHT"
          stroke='red' stroke-width='2'
          fill='white'/>
      <text
        :x="curr_state_width/2" :y="SMALL_LABEL_HEIGHT*TEXT_BOX_VERT"
        :style="`font-size:${FONT_SIZE_SMALL};`"
        >
        <tspan text-anchor="middle">
          {{ curr_state_text }}
        </tspan>
      </text>

        <polyline
          :points="`0 0, ${-TRELLIS_HORIZ_GAP} ${(prev_state.state - decoder.curr_state)*(TRELLIS_VERT_GAP + SQUARE_WIDTH)}`"
          :stroke-dasharray="`${curr_state_obj.bit ? 'none' : DASH_ARRAY}`"
          stroke="red" stroke-width='2' fill='transparent'/-->

    </AppSvg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TrellisDiagramInfo extends Vue {

  // svg stroke-dasharray property
  DASH_ARRAY:number = 6

}
</script>

<style scoped lang="less">
.decoder-svg-text {
  font-family: var(--font-monospace);
}
</style>
