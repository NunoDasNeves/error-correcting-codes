import Vue from 'vue';
import Vuex from 'vuex';
import { IEncoderState } from './encoder'
import { IDecoderState } from './decoder'

Vue.use(Vuex);

export interface IRootState {
  encoder: IEncoderState,
  decoder: IDecoderState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
