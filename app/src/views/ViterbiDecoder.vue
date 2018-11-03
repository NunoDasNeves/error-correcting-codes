<template>
  <div class="viterbi-decoder">
    {{ decoder_params.input }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import InputBits from '@/components/Encoder/InputBits.vue'
import OutputBits from '@/components/Encoder/OutputBits.vue'
import { DecoderParams, DecoderModule } from '@/store/decoder.ts'
import { Decoder, binaryArrayToString } from '@/algorithms/viterbi_encoder_decoder.ts'

@Component({ components: { InputBits, OutputBits } })
export default class ViterbiDecoder extends Vue {
  @Prop({type: Object, default: {}})
  passed_params!: any

  decoder_params: DecoderParams = {
      input: [],
      K: 3,
      n: 3,
      gen: [[1,1,1], [0,1,1], [1,0,1]]
  }

  created() {
    if (this.passed_params != {})
      this.decoder_params = this.passed_params
  }

}
</script>

<style scoped lang="less">

</style>
