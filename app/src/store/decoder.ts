import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Decoder } from '@/algorithms/viterbi_encoder_decoder'
import store from '@/store';

export interface IDecoderState {
  decoder_obj: Decoder
  decoder_started: boolean
  input: number[]
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
  input: number[] = [1,0,1,1,0]

  get decoder() {
    return this.decoder_obj
  }

  @Action({ commit: 'SET_INPUT' })
  set_input(i: number[]) { return i }

  @Mutation
  SET_INPUT(i: number[]) {
    this.input = i
  }

  @Action({ commit: 'SET_STARTED' })
  set_decoder_started(b: boolean) { return b }

  @Mutation
  SET_STARTED(b: boolean) {
    this.decoder_started = b
  }


  @Action({ commit: 'NEW_DECODER' })
  start_decoder(params: DecoderParams) { return params }

  @Mutation
  NEW_DECODER(params: DecoderParams) {
    this.decoder_obj = new Decoder(params.n, params.K, params.gen, params.input)
  }

}

export const DecoderModule = getModule(DecoderState);
