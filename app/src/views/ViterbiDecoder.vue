<template>
  <div class="main-content">
    <h3 style="font-family:var(--font-monospace);">Viterbi Algorithm</h3>
    <section>

      <div v-if="!got_params && !decoder_started">
        The Viterbi algorithm is a Dynamic Programming algorithm that can be used to efficiently decode <router-link :to="{ name: 'encoder', params: {} }">Convolutional Codes</router-link>.<br>
        This page is really a continuation of that topic, so you may want to read that first.

        <HorizLine />
        First we need to encode some data.<br>
        We will use an encoder with the following parameters:<br>
        <div class="params">
          <Math>
          $K = 3$<br>
          $n = 3$<br>
          </Math>
          generator polynomials: {{ decoder_params.gen.map(curr => `(${curr})`).join(' , ')}}<br/>
        </div>
        Please enter a short string:
        <p></p>
        <AppInput v-model="input_string" :valid="input_string.length <= MAX_INPUT_CHARS" style="width:40px;"/>
        &nbsp;&nbsp;<span v-if="input_string.length > MAX_INPUT_CHARS">Please limit the input to {{ MAX_INPUT_CHARS }} characters</span>
        <p></p>

        <div v-if="input_string.length > 0 && input_string.length <= MAX_INPUT_CHARS">
          Input binary:<br>
          <InputBits :bits='encoder_input' :index="-50" :K="0"/>
        </div>

        <p></p>
        <AppButton @click.native="encode_string" :type="'green'">Encode</AppButton>
      </div>

      <form v-else-if="!decoder_started">
        <AppButton :type="'warning'" @click.native="() => { got_params = false; decoder_params.input = [] }">Back</AppButton><br/>
        If this is your first time looking at the Viterbi algorithm, you may want to <a @click="start_decoder">skip straight to the decoder</a> for now.
        <p></p>
        <h3>Errors</h3>
        Transmission across a noisy medium may introduce errors which can be corrected during decoding.<br>
        Obviously, there is a limit to how many errors can be corrected. In this case, we can reliably correct a sequence of up to {{ "TODO" }} errors.

        <AppSpoiler :title="'More on correcting capability'">
          The error correcting capability of a convolutional code is <Math>$\lfloor\frac{d - 1}{2}\rfloor$</Math>, where <Math>$d$</Math> is the 'free distance' of the code.
          <p></p>
          The free distance is just the minimal Hamming Distance between all pairs of distinct sequences of output symbols that can be produced by the encoder.</br>
          This metric gives some intuition about the maximum length of a 'burst' of errors that can still be reliably decoded.
          <p></p>
          One way to obtain <Math>$d$</Math> is to compare all possible decoding paths to the path containing all <span class="bit-text">000</span>:<br>
          <p></p>
          <ErrorTrellis :encoder="error_trellis_encoder"/>
          <AppButton @click.native="error_trellis_prev" :disabled="!error_trellis_prev_valid">< Prev</AppButton>
          <AppButton @click.native="error_trellis_next" :disabled="!error_trellis_next_valid">Next ></AppButton>
          <p></p>
          Clearly the minimal distance is <Math>$d = 7$</Math>, so we can expect our code to reliably correct up to <Math>$\lfloor\frac{d - 1}{2}\rfloor = 3$</Math> errors relatively near to each other.
          <p></p>
          Note, however, that the possiblity of correcting a given set of errors in a stream is a function of both the code and the input, and deriving general metrics for allowed frequencies of erroneous symbols is non-trivial!
        </AppSpoiler>

        The encoder generates a binary stream, which we display here broken up into symbols of length <Math>$n$</Math>.<br>
        Click individual bits to flip them, or just add some random error.<br/>
        <InputErrorBits
          :bits="decoder_params.input"
          :n="decoder_params.n"
          :errors="errors"
          :callback="toggle_error"
          :flip="true"
          />
          <AppButton @click.native="() => errors = {}">Clear</AppButton>
          <AppButton @click.native="randomize_errors">Random</AppButton>
          <br/>
        <AppButton @click.native="start_decoder" :type="'green'">Start Decoding</AppButton>
      </form>

      <div v-else>
        <AppButton :type="'warning'" @click.native="stop_decoder">Back</AppButton>
        <AppButton :type="'warning'" @click.native="reset_decoder">Reset</AppButton>
        <br/>
        Input symbols:<br/>
        <InputErrorBits
          :bits="decoder_params.input"
          :n="decoder_params.n"
          :errors="errors"
          :callback="() => ({})"
          :flip="false"
          :curr_symbol="decoder.i/decoder.n"
          />

        <AppSpoiler :title="'Trellis Diagram'"><TrellisDiagramInfo/></AppSpoiler>

        <TrellisDiagram :decoder="decoder"/>

        <AppButton :disabled="decoder.i == 0 && decoder.curr_state == 0" @click.native="decoder.prev_state">< Previous State</AppButton>
        <AppButton :disabled="decoder.finished" @click.native="decoder.next_state">Next State ></AppButton>
        <AppButton :disabled="decoder.finished" @click.native="decoder.next_symbol">Next Symbol >></AppButton>

        <p></p>

        The output of the decoder is the most likely sequence of bits to have caused the sequence of symbols in the presence of minimal errors.<br/>
        This sequence is traced back through the table, from the minimal hamming distance in the last column.<br/>
        <AppButton @click.native="decoder.decode" :type="'green'">Decode</AppButton>
        <p></p>
        <div v-if="decoded_strings.length == 1">
          The most likely input string is:<br/>
          "{{ decoded_strings[0] }}"
        </div>
        <div v-else-if="decoded_strings.length > 1">
          In this case, due to errors there are multiple equally-likely decodings.<br/>
          They cannot be differentiated based on culmulative Hamming distance alone:<br/>
          <ul>
            <li v-for="(s, i) in decoded_strings" :key="i">
              "{{ s }}"
            </li>
          </ul>
        </div>

      </div>

    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import OutputBits from '@/components/Encoder/OutputBits.vue'
import InputBits from '@/components/Encoder/InputBits.vue'
import InputErrorBits from '@/components/Decoder/InputErrorBits.vue'
import ErrorTrellis from '@/components/Decoder/ErrorTrellisDiagram.vue'
import TrellisDiagram from '@/components/Decoder/Diagram.vue'
import TrellisDiagramInfo from '@/components/Decoder/DiagramInfo.vue'
import { DecoderParams, DecoderModule } from '@/store/decoder.ts'
import { Encoder, Decoder, stringToBinaryArray, binaryArrayToString, numberToArray } from '@/algorithms/viterbi_encoder_decoder.ts'

@Component({ components: { InputBits, OutputBits, InputErrorBits, TrellisDiagram, ErrorTrellis, TrellisDiagramInfo }})
export default class ViterbiDecoder extends Vue {
  @Prop({ type: Object, default:()=>null })
  passed_params!: any

  MAX_INPUT_CHARS: number = 4

  got_params: boolean = false
  input_string: string = ''
  errors: any = {}

  decoder_params: DecoderParams = {
      input: [],
      K: 3,
      n: 3,
      gen: [[1,1,1], [0,1,1], [1,0,1]]
  }

  get encoder_input(): number[] {
    return stringToBinaryArray(this.input_string)
  }

  get decoder(): Decoder {
    return DecoderModule.decoder
  }

  get decoder_started(): boolean {
    return DecoderModule.decoder_started
  }

  get decoded_strings(): string[] {
    return this.decoder.likely_decodings.map(binaryArrayToString)
  }

  error_trellis_input_length: number = 6
  error_trellis_input_num: number = 0xfc
  get error_trellis_input(): number[] { return numberToArray(this.error_trellis_input_num, this.error_trellis_input_length) }
  error_trellis_encoder: Encoder = new Encoder(3, 3, this.decoder_params.gen, this.error_trellis_input)
  get error_trellis_next_valid(): boolean { return this.error_trellis_input_num > 0xe6 }
  get error_trellis_prev_valid(): boolean { return this.error_trellis_input_num < 0xfc }
  error_trellis_next() {
    if (!this.error_trellis_next_valid) return
    this.error_trellis_input_num -= 2
    this.error_trellis_encoder = new Encoder(3, 3, this.decoder_params.gen, this.error_trellis_input)
    this.error_trellis_encoder.encodeAndFlatten()
  }
  error_trellis_prev() {
    if (!this.error_trellis_prev_valid) return
    this.error_trellis_input_num += 2
    this.error_trellis_encoder = new Encoder(3, 3, this.decoder_params.gen, this.error_trellis_input)
    this.error_trellis_encoder.encodeAndFlatten()
  }


  toggle_error(index: number) {
    this.errors[index] = !this.errors[index]
    this.errors = {...this.errors} // we need to change the reference to make the prop reactive...
  }

  randomize_errors() {
    const error_array: boolean[] = new Array<boolean>(this.decoder_params.input.length).fill(false)
    this.errors = error_array.reduce((acc:any, curr:boolean, i:number) => {
      acc[i] = Boolean(Math.round(Math.random()*3/5))
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
    this.decoder.reset()
  }

  created() {
    // use passed params if they exist
    if (this.passed_params) {
      this.decoder_params = this.passed_params
      this.got_params = true
      DecoderModule.stop_decoder()
    }

    this.error_trellis_encoder.encodeAndFlatten()
  }

  encode_string() {
    if (this.input_string.length === 0 || this.input_string.length > this.MAX_INPUT_CHARS) return
    const encoder: Encoder = new Encoder(this.decoder_params.n, this.decoder_params.K, this.decoder_params.gen, this.encoder_input)
    this.decoder_params.input = encoder.encodeAndFlatten()
    this.got_params = true
  }

}
</script>

<style scoped lang="less">
.params {
  border:var(--border);
  border-radius:10px;
  padding:10px 17px;
  margin:15px 0px;
  width: 50%;
}
</style>
