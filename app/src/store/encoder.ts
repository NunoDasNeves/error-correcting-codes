import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Encoder } from '@/algorithms/viterbi_encoder_decoder'
import store from '@/store';

export interface IEncoderState {
  encoder_obj: Encoder
  encoder_started: boolean
  input_string: string
}

export interface EncoderParams {
  input: number[];
  K: number;
  n: number;
  gen: number[][];
}

@Module({ dynamic: true, store, name: 'encoder' })
class EncoderState extends VuexModule implements IEncoderState {
  encoder_obj: Encoder = Encoder.example()
  encoder_started: boolean = false
  input_string: string = ''

  get encoder() {
    return this.encoder_obj
  }

  @Action({ commit: 'SET_INPUT_STRING' })
  set_input_string(s: string) { return s }

  @Mutation
  SET_INPUT_STRING(s: string) {
    this.input_string = s
  }

  @Action({ commit: 'SET_STARTED' })
  set_encoder_started(b: boolean) { return b }

  @Mutation
  SET_STARTED(b: boolean) {
    this.encoder_started = b
  }


  @Action({ commit: 'NEW_ENCODER' })
  start_encoder(params: EncoderParams) { return params }

  @Mutation
  NEW_ENCODER(params: EncoderParams) {
    this.encoder_obj = new Encoder(params.n, params.K, params.gen, params.input)
  }

}

export const EncoderModule = getModule(EncoderState);
