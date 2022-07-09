import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list:[0,0,0,0]
  },
  modules: {
    app,   //->  app : app
    user,
    permission
  },
  getters
})
