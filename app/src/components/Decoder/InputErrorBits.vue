<template>
  <div class="binary-container">
    <div v-for="(s, i) in grouped_bits">
      <span
        :class="'symbol-item ' + (!flip && i == curr_symbol ? 'binary-item-border-selected' : 'binary-item-border')"
      >
        <span
          v-for="(b, b_i) in s" v-on:click="callback(i*n+b_i)"
          :class="'bit-item ' + (!!errors[i*n+b_i] ? 'bit-error' : '')"
          >
          {{ flip ? (!!errors[i*n+b_i] ? Number(!b) : b) : b }}
        </span>
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
  // flip error bits or just highlight them
  @Prop(Boolean)
  flip!: boolean
  // border around selected item, applied if !flip
  @Prop({ type: Number, default: -1 })
  curr_symbol!: number

  actual_errors: any = {}

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
    flex-flow: row wrap;
    font-family:var(--font-monospace);
}

.symbol-item {
    display:flex;
    margin: 4px;
}

.bit-item {
    padding:0 5px;
    cursor:pointer;
}

.bit-error {
    background-color: #ff000088;
}

// top right bottom left
.binary-item-border {
    border: solid black;
    border-width: 1px 1px 1px 1px;
}
.binary-item-border-selected {
    border: solid red;
    border-width: 2px 2px 2px 2px;
}


</style>
