<template>
  <div class="binary-container">
    <div v-for="(b, i) in padded_bits" :class="'binary-item ' + get_border_class(i)">
      {{ b == -1 ? '&nbsp;' : b }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class InputBits extends Vue {
  @Prop(Array)
  bits!: number[]
  @Prop(Number)
  index!: number
  @Prop(Number)
  K!: number

  get padded_bits(): number[] {
      return [...(new Array<number>(this.K-1).fill(-1)), ...this.bits]
  }

  get_border_class(i: number): string {
    if (i < this.index || i >= this.index + this.K) return ''
    if (i == this.index) return 'binary-item-border-left'
    if (i == (this.index + this.K - 1)) return 'binary-item-border binary-item-input'
    else return 'binary-item-border'
  }
}
</script>

<style scoped lang="less">
.binary-container {
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    font-family:var(--font-monospace);
    /*border: solid black;
    border-width: 0 1px 1px 0;*/
}

.binary-item {
    display:inline-block;
    padding:0 5px;
}

// top right bottom left
.binary-item-border-left {
    border: solid black;
    border-width: 1px 1px 1px 1px;
}
.binary-item-border {
    border: solid black;
    border-width: 1px 1px 1px 0;
}
.binary-item-input {
    background-color: #ff000088;
}

</style>
