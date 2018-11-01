<template>
  <input type="text" :value="value" @input="$emit('input', $event.target.value)" :class="valid ? 'input-valid' : 'input-invalid'"/>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppInput extends Vue {
  @Prop()
  value!:any
  @Prop(Boolean)
  valid!:boolean
}
</script>

<style scoped>
input[type=text] {
  border: var(--border);
  border-radius: 2px;
  font: inherit;
  resize: none;
  padding: 10px;
  outline: none;
  width: calc(100% - 20px);
  height: 20px;
  transition: 0.2s border ease-in-out;
}

input:active, input:focus {
  border: 1px solid #acc;
}

.input-invalid {
  border: 1px solid var(--color-invalid) !important;
  border-radius: 2px;
}
</style>
