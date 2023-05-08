import { logout } from '@/api/user'
import { Message } from 'element-ui'
import { getToken, setToken, removeToken, setPermission } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import backend from './../../utils/backend'
import api from './../../api/index'
// import loginApi from '../../api'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userMenu: {},
  orgInfoFlag: window.sessionStorage.getItem('orgInfoFlag') ? window.sessionStorage.getItem('orgInfoFlag') : false,
  userInfo: window.sessionStorage.getItem('userInfo') ? JSON.parse(window.sessionStorage.getItem('userInfo')) : {}, // 登录用户信息
  companyInfo: window.sessionStorage.getItem('companyInfo') ? JSON.parse(window.sessionStorage.getItem('companyInfo')) : {} // 登录用户所属企业信息
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menu) => {
    state.userMenu = menu
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_COMPANY_INFO: (state, companyInfo) => {
    state.companyInfo = companyInfo
  },
  SET_ORGINFO_FLAG: (state, orgInfoFlag) => {
    state.orgInfoFlag = orgInfoFlag
  }
}

const actions = {
  getFlag({ commit }, orgInfoFlag) {
    commit('SET_ORGINFO_FLAG', orgInfoFlag)
  },
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  // user login
  login({ commit }, userInfo) {
    const { password, loginName, encryptToken } = userInfo
    return new Promise((resolve, reject) => {
      backend.request(api.login.tempLogin, {
        password: password,
        loginName: loginName,
        orgType: 1,
        encryptToken: encryptToken
      }).then((response) => {
        if (response.success && response.data) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          commit('SET_USER_INFO', data)
          commit('SET_ORGINFO_FLAG', data.orgInfoFlag)
          setToken(data.token)
          window.sessionStorage.setItem('userInfo', JSON.stringify(data))
          window.sessionStorage.setItem('orgInfoFlag', data.orgInfoFlag)
          // 获取登录用户所属企业信息
          backend.request(api.enterprise.getOrgRecordInfo, { id: response.data.orgId }).then((res) => {
            if (res.success && res.data) {
              commit('SET_COMPANY_INFO', res.data)
              window.sessionStorage.setItem('companyInfo', JSON.stringify(res.data))
            }
          })
        } else {
          Message({
            message: response.message,
            type: 'error',
            duration: 3 * 1000,
            showClose: true
          })
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      backend.request(api.login.getMenuList).then((response) => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        setPermission(data)
        window.sessionStorage.setItem('permissions', JSON.stringify(data) || [])
        commit('SET_ROLES', ['admin'])
        // resolve(data)
        resolve({ permissions: data })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getUserMenu')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
