<template>
  <div class="viterbi-decoder">
    input string: {{ input_string }}
  </div>
</template>

<script lang="ts">
export default {
  props: {
    input_string: {
        type: String,
        default: "test string"
    }
  }
}
</script>

<style scoped lang="less">

</style>
