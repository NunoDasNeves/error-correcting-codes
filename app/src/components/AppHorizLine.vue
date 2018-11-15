<template>
  <div class="horiz-line">
    <div class="actual-line"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppHorizLine extends Vue {

}
</script>
<style scoped lang="less">
.horiz-line {
  width:100%;
  height:20px;
}
.actual-line {
  height:50%;
  border-bottom: solid var(--color-gray) 1px;
}
</style>
