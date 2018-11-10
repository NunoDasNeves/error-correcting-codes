<template>
  <div class="main-content">
    <h3>Reed Solomon Codes</h3>
    <section>

      <form v-if="!encoder_started">
        Type a (short) input string:<br/>
        <AppInput v-model="input_string" :valid="input_string.length <= MAX_INPUT_CHARS" style="width:40px;"/><br/>
        <div v-if="input_string.length > MAX_INPUT_CHARS">
          Please limit the input to {{ MAX_INPUT_CHARS }} characters
        </div>
        <AppButton @click.native="" :type="'green'">Start Encoding</AppButton>
      </form>

      <AppButton :type="'warning'" @click.native="">Back</AppButton>

    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ components: {  } })
export default class ConvolutionalEncoder extends Vue {
  input_string: string = ''

  MAX_INPUT_CHARS: number = 4

}
</script>

<style scoped lang="less">
section {
  background: var(--color-white);
}

</style>
