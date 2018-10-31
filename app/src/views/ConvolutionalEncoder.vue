<template>
  <div class="convolutional-encoder">
    polynomial: <MathField :data="'$g_0s_0 + g_1s_1x$'" />
  </div>
</template>

<script lang="ts">
import MathField from '@/components/AppMathJax.vue';

export default {
  components: { MathField },
};
</script>

<style scoped lang="less">

</style>
