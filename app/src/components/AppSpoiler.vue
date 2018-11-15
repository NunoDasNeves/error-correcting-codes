<template>
  <div>
    <div class="spoiler-bar">
      <span v-on:click="() => {toggle = !toggle}" class="spoiler-title">{{ title }}</span>
    </div>
    <div v-show="toggle" class="spoiler-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['title'],
  data() {
    return {
      toggle: false
    }
  }
})
</script>

<style scoped>
.spoiler-title {
  color:var(--color-theme);
  border:1px solid var(--color-theme);
  border-radius:5px;
  padding: 0 8px;
  cursor:pointer;
}
.spoiler-title:hover {
  color:var(--color-theme-light);
  border:1px solid var(--color-theme-light);
}
.spoiler-bar {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin:8px 0;
}
.spoiler-close:hover {
  color:var(--color-gray);
}
.spoiler-content {
  border:var(--border);
  border-radius:10px;
  padding:17px;
}
</style>
