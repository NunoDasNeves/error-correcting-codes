<template>
  <button type='button' :class="button_class" >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppButton extends Vue {
  @Prop({type: String, default: 'standard'})
  type!: string

  get button_class(): string {
    return `${this.type}-button`
  }
}
</script>

<style scoped>
button {
    cursor: pointer;
    padding: 8px 20px;
    margin: 4px;
    font: inherit;
    font-weight: bolder;
    outline: none;
    border-radius: 4px;
    transition: box-shadow 0.1s ease-in-out;
}

button:disabled {
    cursor: not-allowed;
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

.warning-button {
    background-color: var(--color-warning);
    color: var(--color-white);
    border: none;
}

.warning-button:hover {
    box-shadow: var(--box-shadow-active);
}

.green-button {
    background-color: var(--color-dark-green);
    color: var(--color-white);
    border: none;
}

.warning-button:hover {
    box-shadow: 0px 0px 0px 1px var(--color-green);
}

</style>
