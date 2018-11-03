<template>
  <div class="main-content">
    <h3>Viterbi Decoder</h3>
    <section>

      <form v-if="!got_params">
        input string: <AppInput v-model="input_string" :valid="input_string.length <= 10"/>
        <div v-if="input_string.length > 10">
          Please limit the input to 10 characters
        </div>
        <!--K: <AppInput v-model="encoder_params.K"/>-->
        <!--n: <AppInput v-model="encoder_params.n"/>-->
        <AppButton @click.native="encode_string">Encode</AppButton>
      </form>

      <form v-else-if="!decoder_started">
        Input binary:<br/>
        <InputErrorBits
          :bits="decoder_params.input"
          :n="decoder_params.n"
          :errors="errors"
          :callback="(bit) => errors[bit] = !errors[bit]"
          />
        <AppButton @click.native="start_decoder">Start Decoding</AppButton>
      </form>

      <div v-else>
        Input binary:<br/>
        TODO
      </div>

    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import InputErrorBits from '@/components/Decoder/InputErrorBits.vue'
import { DecoderParams, DecoderModule } from '@/store/decoder.ts'
import { Encoder, Decoder, stringToBinaryArray, binaryArrayToString } from '@/algorithms/viterbi_encoder_decoder.ts'

@Component({ components: { InputErrorBits }})
export default class ViterbiDecoder extends Vue {
  @Prop({ type: Object, default:()=>null })
  passed_params!: any

  got_params: boolean = false
  input_string: string = ''
  errors: any = {}

  decoder_params: DecoderParams = {
      input: [],
      K: 3,
      n: 3,
      gen: [[1,1,1], [0,1,1], [1,0,1]]
  }

  get decoder(): Decoder {
    return DecoderModule.decoder
  }

  get decoder_started(): boolean {
    return DecoderModule.decoder_started
  }

  start_decoder() {
    if (this.input_string.length == 0 || this.input_string.length > 10) return
    DecoderModule.start_decoder(this.decoder_params)
    DecoderModule.set_decoder_started(true)
  }
  stop_decoder() {
    DecoderModule.set_decoder_started(false)
  }
  reset_decoder() {
    this.decoder.reset()
  }

  created() {
    // used passed params if they exist
    if (this.passed_params) {
      this.decoder_params = this.passed_params
      this.got_params = true
    }
  }

  encode_string() {
    const encoder_input: number[] = stringToBinaryArray(this.input_string)
    const encoder: Encoder = new Encoder(this.decoder_params.n, this.decoder_params.K, this.decoder_params.gen, encoder_input)
    this.decoder_params.input = encoder.encodeAndFlatten()
    this.got_params = true
  }


}
</script>

<style scoped lang="less">

</style>
