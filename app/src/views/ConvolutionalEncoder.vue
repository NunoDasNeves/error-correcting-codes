<template>
  <div class="main-content">
    <h3>Convolutional Encoder</h3>
    <section>

      <form v-if="!encoder_started">
        input string: <AppInput v-model="encoder_params.input"/>
        <!--K: <AppInput v-model="encoder_params.K"/>-->
        <!--n: <AppInput v-model="encoder_params.n"/>-->
        <AppButton @click.native="start_encoder">Start</AppButton>
      </form>
      <div v-else>
        <AppButton :alt="true" @click.native="stop_encoder">Stop</AppButton>
        <h4>encoder parameters:</h4>
        <p>K: {{ encoder_params.K }}</p>
        <p>n: {{ encoder_params.n }}</p>
        <p>generator polynomials: {{ encoder_params.gen }}</p>
        <AppSpoiler :title="'What are generator polynomials?'">
          <p><Math>For iteration $j$, bit $b_{i}$ will be the coefficient of $x^{j}$th in:</Math></p>
          <p v-for="g in encoder_params.gen">
            <Math>$ S({{ latex_polynomial_string(g) }}) $</Math>
          </p>
          <p>
            <Math>Where $S$ is the polynomial representation of the input stream</Math>
          </p>
        </AppSpoiler>
        <p>input string: "{{ encoder_params.input }}"</p>
        <!--p>
          <Math>
            <p>Generator polynomials of degree $K - 1 = {{encoder_params.K - 1}}$ take the form</p>
            <p>$G^{j}(x) = g_0^{j} + g_1^{j}x + ... + g_{K-1}x^{K}$ for $1 \leq j \leq n$, where $g_i \in \{0, 1\}$</p>
            <p></p>
          </Math>
        </p-->
        <p> input binary: </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      encoder_started: false,
      encoder_params: {
        input: '',
        K: 3,
        n: 3,
        gen: [[1,1,1], [0,1,1], [1,0,1]]
      }
    }
  },
  methods: {
    start_encoder() {
      this.encoder_started = true
    },
    stop_encoder() {
      this.encoder_started = false
    },
    latex_polynomial_string(poly:number[]): string {
      return poly.map((a:number, i:number)=>`${a}${i ? (i > 1 ? 'x^{'+i+'}' : 'x') : ''}`).join(' + ')
    }
  }
})
</script>

<style scoped lang="less">
section {
  background: var(--color-white);
}
</style>
