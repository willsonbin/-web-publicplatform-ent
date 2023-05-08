const state = {
  breadList: []
}
const mutations = {
  SET_BREADLIST: (state, breadList) => {
    state.breadList = breadList
  }
}

const actions = {
  setBreadList({ commit }, breadList) {
    commit('SET_BREADLIST', breadList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
