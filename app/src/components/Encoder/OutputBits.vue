<template>
  <div class="binary-container">
    <div v-for="(s, i) in symbols" :class="'binary-item binary-item-border-left'">
      {{ s.join(' ') }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class InputBits extends Vue {
  @Prop(Array)
  symbols!: number[][]

  get_border_class(i: number): string {
    if (i == 0) return 'binary-item-border-left'
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
    flex-flow: row wrap;
}

.binary-item {
    display:inline-block;
    padding:0 5px;
    margin: 4px;
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
