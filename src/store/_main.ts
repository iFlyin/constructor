import Vue from 'vue';
import Vuex from 'vuex';
import { businessLogic } from './businessLogic';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { businessLogic },
});
