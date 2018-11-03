<template>
  <div class="binary-container">
    <div v-for="(s, i) in grouped_bits" class="symbol-item binary-item-border-left">
      <span v-for="(b, b_i) in s" :class="'bit-item ' + errors[i*n+b_i] ? 'bit-error' : ''">
        {{ b }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class InputErrorBits extends Vue {
  @Prop(Array)
  bits!: number[]
  @Prop(Object)
  errors!: any
  @Prop(Number)
  n!: number
  @Prop(Function)
  callback!: any

  get grouped_bits(): number[][] {
      return this.bits.reduce((acc:number[][], curr:number, i:number) => {
        i % this.n == 0 ? acc.push([curr]) : acc[acc.length-1].push(curr)
        return acc
      }, [])
  }
}
</script>

<style scoped lang="less">
.binary-container {
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    font-family:var(--font-monospace);
}

.symbol-item {
    display:inline-block;
}

.bit-item {
    padding:0 5px;
}

.bit-error {
    background-color: #ff000088;
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

</style>
