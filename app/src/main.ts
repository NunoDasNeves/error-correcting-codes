import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Math from '@/components/AppMathJax.vue';
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';
import AppSpoiler from '@/components/AppSpoiler.vue';

Vue.component('Math', Math)
Vue.component('AppInput', AppInput)
Vue.component('AppButton', AppButton)
Vue.component('AppSpoiler', AppSpoiler)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
