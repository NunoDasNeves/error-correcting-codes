<template>
  <div>
    <AppSvg :width="SQUARE_WIDTH*2 + MARGIN*2" :height="SQUARE_WIDTH*1 + MARGIN*2">

       <g :transform="`translate(${MARGIN},${MARGIN})`">

      </g> <!--margin-->

    </AppSvg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TrellisDiagram extends Vue {
  @Prop(Array)
  input!: number[]

  SCALING_FACTOR: number = 1
  MARGIN: number = 30
  FONT_SIZE: string = `${9 * this.SCALING_FACTOR}em`
  FONT_SIZE_SMALL: string = `${2 * this.SCALING_FACTOR}em`
  SQUARE_WIDTH:number = 225 * this.SCALING_FACTOR
  XOR_RADIUS: number = 45 * this.SCALING_FACTOR
  TOP_OFFSET: number = this.SQUARE_WIDTH/2 // offset for lines
  GEN_COLORS:string[] = ['red', 'blue', 'green', 'orange', 'purple', 'black']

}
</script>

<style scoped lang="less">
.decoder-svg-text {
  font-family: var(--font-monospace);
}
</style>
