<template>
  <div class="main-content">
    <h3>Convolutional Encoder</h3>
    <section>

      <form v-if="!encoder_started">
        input string: <AppInput v-model="input_string" :valid="input_string.length <= 10"/>
        <div v-if="input_string.length > 10">
          Please limit the input to 10 characters
        </div>
        <!--K: <AppInput v-model="encoder_params.K"/>-->
        <!--n: <AppInput v-model="encoder_params.n"/>-->
        <AppButton @click.native="start_encoder">Start</AppButton>
      </form>
      <div v-else>
        <AppButton :type="'warning'" @click.native="stop_encoder">Stop</AppButton>
        generator polynomials: {{ encoder_params.gen }}<br/>

        <AppSpoiler :title="'What are generator polynomials?'">
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
              <li>No matter the length of $P(x)$, $b_{j}^{i}$ is composed of at most $K$ non-zero terms</li>
            </ul>
            This operation is what the convolutional encoder implements.
          </Math>
        </AppSpoiler>

        Input binary:<br/>
        <InputBits :bits='encoder.input' :index="encoder.i" :K="encoder_params.K"/>

        <AppButton @click.native="next" :disabled="encoder.finished">Next</AppButton>

        <EncoderDiagram :input="encoder.reg" :output="encoder.outputs[encoder.outputs.length - 1]" :gen="encoder_params.gen"/>

        Output symbols:
        <OutputBits :symbols='encoder.outputs'/>

        <AppButton @click.native="decode" :disabled="!encoder.finished">Decode</AppButton>

      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import InputBits from '@/components/Encoder/InputBits.vue'
import OutputBits from '@/components/Encoder/OutputBits.vue'
import EncoderDiagram from '@/components/Encoder/Diagram.vue'
import { EncoderParams, EncoderModule } from '@/store/encoder.ts'
import { Encoder, stringToBinaryArray } from '@/algorithms/viterbi_encoder_decoder.ts'

@Component({ components: { InputBits, EncoderDiagram, OutputBits } })
export default class ConvolutionalEncoder extends Vue {
  encoder_params: EncoderParams = {
                    input: [],
                    K: 3,
                    n: 3,
                    gen: [[1,1,1], [0,1,1], [1,0,1]]
                    }

  get encoder(): Encoder {
    return EncoderModule.encoder
  }

  get input_string(): string {
    return EncoderModule.input_string
  }
  set input_string(s:string) {
    EncoderModule.set_input_string(s)
  }

  get encoder_started(): boolean {
    return EncoderModule.encoder_started
  }

  start_encoder() {
    if (this.input_string.length == 0 || this.input_string.length > 10) return
    this.encoder_params.input = stringToBinaryArray(this.input_string)
    EncoderModule.start_encoder(this.encoder_params)
    EncoderModule.set_encoder_started(true)
  }
  stop_encoder() {
    EncoderModule.set_encoder_started(false)
  }
  latex_polynomial_string(poly:number[]): string {
    return poly.map((a:number, i:number)=>`${a}${i ? (i > 1 ? 'x^{'+i+'}' : 'x') : ''}`).join(' + ')
  }
  next() {
    EncoderModule.encoder.next()
  }

  decode() {
    const flattened: number[] = this.encoder.outputs.reduce((acc, curr) => acc.concat(curr), [])
    const params: any = { ...this.encoder_params }
    params.input = flattened
    this.$router.push({ name: 'decoder', params: { passed_params: params}})
  }
}
</script>

<style scoped lang="less">
section {
  background: var(--color-white);
}
.dot-list {
  margin-left: 20px;
}
.dot-list > li {
  list-style-type: disc;
}
</style>
