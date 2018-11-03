<template>
  <div class="main-content">
    <h3>Viterbi Decoder</h3>
    <section>

      <form v-if="!got_params && !decoder_started">
        input string: <AppInput v-model="input_string" :valid="input_string.length <= 10"/>
        <div v-if="input_string.length > 10">
          Please limit the input to 10 characters
        </div>
        <AppButton @click.native="encode_string">Encode</AppButton>
      </form>

      <form v-else-if="!decoder_started">
        Input binary:<br/>
        <InputErrorBits
          :bits="decoder_params.input"
          :n="decoder_params.n"
          :errors="errors"
          :callback="toggle_error"
          /><br/>
          Click bits to add errors.
          <AppButton @click.native="() => errors = {}">Clear errors</AppButton>
          <AppButton @click.native="randomize_errors">Random errors</AppButton>
          <br/>
        <AppButton @click.native="start_decoder">Start Decoding</AppButton>
      </form>

      <div v-else>
        <AppButton :type="'warning'" @click.native="stop_decoder">Stop</AppButton>
        <AppButton :type="'warning'" @click.native="reset_decoder">Reset</AppButton>
        <br/>
        Input binary:<br/>
        {{ decoder_params.input }}

        State map:<br/>
        All possible encoder states and their outputs
        <p></p>

        Trellis<br/>
        Trellis/DP diagram
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

  toggle_error(index: number) {
    this.errors[index] = !this.errors[index]
    this.errors = {...this.errors} // we need to change the reference to make the prop reactive...
  }

  randomize_errors() {
    const error_array: boolean[] = new Array<boolean>(this.decoder_params.input.length).fill(false)
    this.errors = error_array.reduce((acc:any, curr:boolean, i:number) => {
      acc[i] = Boolean(Math.round(Math.random()*2/3))
      return acc
    }, {})
  }

  // flip bits in input corresponding to error map
  apply_errors() {
    Object.keys(this.errors).map((value:string) => {
      if (this.errors[value]) {
        this.decoder_params.input[Number(value)] = Number(!this.decoder_params.input[Number(value)])
      }
    })
  }

  start_decoder() {
    this.apply_errors()
    DecoderModule.start_decoder(this.decoder_params)
  }
  stop_decoder() {
    this.apply_errors()
    DecoderModule.stop_decoder()
  }
  reset_decoder() {
    this.apply_errors()
    this.decoder.reset()
  }

  created() {
    // use passed params if they exist
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
