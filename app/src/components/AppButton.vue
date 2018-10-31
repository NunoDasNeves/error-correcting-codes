<template>
  <button type='button' :class="alt ? 'standard-button' : 'alt-button'" >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    alt: {
      type: Boolean,
      default: true
    }
  }
})
</script>

<style scoped>
button {
    cursor: pointer;
    padding: 8px 14px;
    margin: 4px;
    font: inherit;
    font-weight: bolder;
    outline: none;
    border-radius: 4px;
    transition: box-shadow 0.1s ease-in-out;
}

button:disabled {
    cursor: help;
    opacity: 0.4;
    box-shadow: none;
}

.standard-button {
    background-color: var(--color-theme);
    color: var(--color-white);
    border: none;
}

.standard-button:hover {
    box-shadow: 0px 0px 0px 1px var(--color-theme-light);
}

.alt-button {
    color: var(--color-theme);
    border: var(--border-dark);
    background: var(--color-white);
}

.alt-button:hover {
    box-shadow: var(--box-shadow-active);
}
</style>
