import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: null,
    userId: null
  },
  mutations: {
    GETCURRENTUSER(state, payload) {
      state.userData = payload.data;
      state.userId= payload.id;
    },
    CLEARUSERDATA(state) {
      state.userData = null;
      state.userId = null;
    },
    SETUSERDATA(state, payload) {
      Object.assign(state.userData, payload);
    }
  },
  actions: {
    getCurrentUser({ commit }, condition) {

      return new Promise(async (res, rej) => {
        let { vm, account } = condition;

        try {
          // Get data from db
          let query = await vm.$db.collection('/users').where('account', '==', account).get();

          // prepare payload
          let payload = {
            id: query.docs[0].id,
            data: query.docs[0].data()
          }

          // Commit.
          commit('GETCURRENTUSER', payload);
        } catch (err) {
          rej(err);
        }
        res();
      })
    }
  }
})
