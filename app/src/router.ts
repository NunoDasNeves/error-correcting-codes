import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Encoder from './views/ConvolutionalEncoder.vue';
import Decoder from './views/ViterbiDecoder.vue';
import ReedSolomon from './views/ReedSolomon.vue';
import Test from './views/Test.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/reed-solomon',
      name: 'reed-solomon',
      component: ReedSolomon,
    },
    {
      path: '/encoder',
      name: 'encoder',
      component: Encoder,
    },
    {
      path: '/decoder',
      name: 'decoder',
      component: Decoder,
      props: ({ params: { passed_params } }) => ({
        passed_params
      }),
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
    },
  ],
});
