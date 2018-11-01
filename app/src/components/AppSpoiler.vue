<template>
  <div>
    <div class="spoiler-bar">
      <span v-on:click="() => {toggle = !toggle}" class="spoiler-title">{{ title }}</span>
      <!--i v-show="toggle" v-on:click="() => {toggle = false}" class="material-icons spoiler-close">close_circle</i-->
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
  cursor:pointer;
}
.spoiler-title:hover {
  color:var(--color-theme-light);
}
.spoiler-bar {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin:5px 0;
}
.spoiler-close {
  width:24px;
  cursor:pointer;
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
