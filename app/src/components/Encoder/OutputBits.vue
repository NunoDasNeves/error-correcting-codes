<template>
  <div class="binary-container">
    <div v-for="(s, i) in symbols" class="symbol-item binary-item-border-left">
      <span v-for="b in s" class="bit-item">
        {{ b }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class InputBits extends Vue {
  @Prop(Array)
  symbols!: number[][]
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
