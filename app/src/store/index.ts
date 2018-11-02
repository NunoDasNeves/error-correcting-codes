import Vue from 'vue';
import Vuex from 'vuex';
import { IEncoderState } from './encoder'

Vue.use(Vuex);

export interface IRootState {
  encoder: IEncoderState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
