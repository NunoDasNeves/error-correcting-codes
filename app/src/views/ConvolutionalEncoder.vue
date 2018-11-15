<template>
  <div class="main-content">
    <h3 style="font-family:var(--font-monospace);">Convolutional Codes</h3>
    <section>

      <div v-if="!encoder_started">
        Convolutional Codes add redundant information to a stream of bits in order to increase reliability in noisy communication channels.
        <p></p>
        The <router-link :to="{ name: 'decoder', params: {} }">Viterbi Algorithm</router-link> can be used to restore the original bitstream up to a certain error rate.
        <p></p>
        Type a short string to encode:
        <p></p>
        <AppInput v-model="input_string" :valid="input_string.length <= MAX_INPUT_CHARS" style="width:40px;"/>
        &nbsp;&nbsp;<span v-if="input_string.length > MAX_INPUT_CHARS">Please limit the input to {{ MAX_INPUT_CHARS }} characters</span>
        <p></p>

        <div v-if="input_string.length > 0 && input_string.length <= MAX_INPUT_CHARS">
          Input binary:<br>
          <InputBits :bits='input' :index="-50" :K="0"/>
        </div>

        <p></p>
        <AppButton @click.native="start_encoder" :disabled="!input_string.length" :type="'green'">Start Encoding</AppButton>
      </div>

      <div v-else>
        <AppButton :type="'warning'" @click.native="stop_encoder">Back</AppButton>
        <br/>

        A convolutional encoder has <Math>$K$</Math> single-bit registers. <Math>$K - 1$</Math> of these are the <span class='bit-text-blue'>state bits</span> of the encoder.<br>
        Each <span class='bit-text-red'>input bit</span> enters the encoder via the leftmost register. At each step of encoding, the registers are shifted right.<br>
        <p></p>
        For each input bit, an <Math>$n$</Math>-bit <span class='bit-text-green'>output symbol</span> is produced by the encoder.<br>
        Each output bit is obtained by <Math>$n$</Math> modulo-2 adders (equivalent to <span class="bit-text">XOR</span>), which add a subset of the encoder registers.<br>
        <Math>$n$</Math> generator polynomials define which registers are added to produce each output bit.
        <AppSpoiler :title="'More on generator polynomials'">
          <Math>
            Generator polynomials are of degree $K-1$ and take the form:
            $G^{i}(x) = g_0^{i} + g_1^{i}x + ... + g_{K-1}^{i}x^{K-1}$ for $1 \leq i \leq n$, where each coefficient $g_k^{i} \in \{0, 1\}$
            <p></p>
            For the $j$th output symbol, bit $b_{j}^{i}$ will be the coefficient of $x^{j}$ in the product $P(x)G^{i}(x)$, where $P(x)$ is the polynomial representation of the input stream.
            <p></p>
            \begin{align}
            P(x)G^{i}(x) &={} (p_0 + p_1x + p_2x^2 + ...)(g_0^{i} + g_1^{i}x + ... + g_{K-1}^{i}x^{K-1}) \\
                         &={} \begin{aligned}[t]
                            &p_0g_0^{i} +  \\
                           (&p_0g_1^{i} + p_1g_0^{i})x + \\
                            &... \\
                           (&p_0g_{K-1}^{i} + ... + p_{K-2}g_0^{i})x^{K-1} \\
                           (&p_1g_{K-1}^{i} + ... + p_{K-1}g_0^{i})x^K \\
                            &... \\
                           (&p_{j-(K-1)}g_{K-1}^{i} + ... + p_{j}g_0^{i})x^j \\
                            &... \end{aligned} \\
                         &={} \begin{aligned}[t]
                            &p_0g_0^{i} + \\
                           (&p_1g_0^{i} + p_0g_1^{i})x \\
                            &... \\
                           (&p_jg_0^{i} + p_{j-1}g_1^{i} + ... + p_{j-(K-1)}g_{K-1}^{i})x^{j} \\
                            &... \end{aligned}

            \end{align}
            So, $G^{i}(x)$ can be treated as a 'sliding window' over $P(x)$, which is equivalent to a convolution of the two sequences of coefficients:
            $$
              b_{j}^{i} = \sum_{k=0}^{\infty}p_{j-k}g_{k}^{i} \mod{2}
            $$
            Note:
            <ul class="dot-list">
              <li>Non-existent coefficents can be simply treated as $0$</li>
              <li>Summation $\bmod{2}$ is equivalent to XOR</li>
              <li>No matter the length of $P(x)$, $b_{j}^{i}$ is the sum of at most $K$ non-zero terms</li>
            </ul>
            This operation is what the convolutional encoder implements.
          </Math>
        </AppSpoiler>

        <HorizLine />

        <h3>Sample Encoder</h3>
        <div class="params">
          <Math>
          $K = 3$<br>
          $n = 3$<br>
          </Math>
          generator polynomials: <span v-html="show_gen"/><br/>
        </div>


        Input binary:<br/>
        <InputBits :bits='encoder.input' :index="encoder.i" :K="K"/>

        <EncoderDiagram :input="encoder.reg" :output="encoder.outputs[encoder.outputs.length - 1]" :gen="gen" :gen_colors="GEN_COLORS"/>

        <AppButton :type="'warning'" @click.native="reset_encoder"><< Reset</AppButton>
        <AppButton @click.native="encoder.next" :disabled="encoder.finished">Next Bit ></AppButton>
        <AppButton @click.native="() => { while(!encoder.finished) encoder.next(); }" :disabled="encoder.finished">Encode all >></AppButton>
        <p></p>
        All output symbols:
        <OutputBits :symbols='encoder.outputs'/>
        <p v-if="encoder.finished">
          To see how the message can be decoded in the presence of errors, click below.
        </p>
        <p v-else></p> <!-- spacing hack -->
        <AppButton @click.native="decode" :disabled="!encoder.finished" :type="'green'">Decode</AppButton>

      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import InputBits from '@/components/Encoder/InputBits.vue'
import OutputBits from '@/components/Encoder/OutputBits.vue'
import EncoderDiagram from '@/components/Encoder/Diagram.vue'
import { EncoderParams, EncoderModule } from '@/store/encoder.ts'
import { Encoder, stringToBinaryArray } from '@/algorithms/viterbi_encoder_decoder.ts'

@Component({ components: { InputBits, EncoderDiagram, OutputBits } })
export default class ConvolutionalEncoder extends Vue {

  MAX_INPUT_CHARS: number = 4
  GEN_COLORS:string[] = ['red', 'blue', 'green', 'orange', 'purple', 'black']

  get encoder(): Encoder {
    return EncoderModule.encoder
  }

  get encoder_started(): boolean {
    return EncoderModule.encoder_started
  }

  get input_string(): string {
    return EncoderModule.input_string
  }

  set input_string(s:string) {
    EncoderModule.set_input_string(s)
  }

  get input(): number[] {
    return stringToBinaryArray(this.input_string)
  }

  K: number = 3
  n: number = 3
  gen: number[][] = [[1,1,1], [0,1,1], [1,0,1]]

  get show_gen(): string {
    return this.gen.map((curr, i) => `(<span style="color:${this.GEN_COLORS[i]};">${curr}</span>)`).join(' , ')
  }

  start_encoder() {
    if (this.input_string.length == 0 || this.input_string.length > this.MAX_INPUT_CHARS) return
    EncoderModule.start_encoder({input: this.input, K: this.K, n: this.n, gen: this.gen})
  }
  stop_encoder() {
    EncoderModule.stop_encoder()
  }
  reset_encoder() {
    this.encoder.reset()
  }
  latex_polynomial_string(poly:number[]): string {
    return poly.map((a:number, i:number)=>`${a}${i ? (i > 1 ? 'x^{'+i+'}' : 'x') : ''}`).join(' + ')
  }

  decode() {
    const flattened: number[] = this.encoder.outputs.reduce((acc, curr) => acc.concat(curr), [])
    const params: any = {input: this.input, K: this.K, n: this.n, gen: this.gen}
    params.input = flattened
    this.$router.push({ name: 'decoder', params: { passed_params: params}})
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

.dot-list {
  margin-left: 20px;
}
.dot-list > li {
  list-style-type: disc;
}
.bit-text-red {
  font-family:var(--font-monospace);
  background-color:var(--color-bit-input);
}

.bit-text-green {
  font-family:var(--font-monospace);
  background-color:var(--color-bit-output);
}

.bit-text-blue {
  font-family:var(--font-monospace);
  background-color:var(--color-bit-state);
}
</style>
