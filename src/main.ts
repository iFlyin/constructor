import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/_main';
import VuexHistory from 'vuex-history';

Vue.use( VuexHistory );
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
