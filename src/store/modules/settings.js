import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, supportPinyinSearch } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  supportPinyinSearch,
  loading: false
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  changeLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

