import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Decoder } from '@/algorithms/viterbi_encoder_decoder'
import store from '@/store';

export interface IDecoderState {
  decoder_obj: Decoder
  decoder_started: boolean
}

export interface DecoderParams {
  input: number[];
  K: number;
  n: number;
  gen: number[][];
}

@Module({ dynamic: true, store, name: 'decoder' })
class DecoderState extends VuexModule implements IDecoderState {
  decoder_obj: Decoder = Decoder.example([])
  decoder_started: boolean = false

  get decoder() {
    return this.decoder_obj
  }

  @Action({ commit: 'STOP_DECODER' })
  stop_decoder() { }

  @Mutation
  STOP_DECODER() {
    this.decoder_started = false
  }

  @Action({ commit: 'START_DECODER' })
  start_decoder(params: DecoderParams) { return params }

  @Mutation
  START_DECODER(params: DecoderParams) {
    this.decoder_obj = new Decoder(params.n, params.K, params.gen, params.input)
    this.decoder_started = true
  }

}

export const DecoderModule = getModule(DecoderState);
