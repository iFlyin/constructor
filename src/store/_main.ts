import Vue from 'vue';
import Vuex from 'vuex';
import CMS from './CMS';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: { CMS },
});
