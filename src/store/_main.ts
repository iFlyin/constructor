import Vue from 'vue';
import Vuex from 'vuex';
import CMS from './CMS';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { CMS },
});
