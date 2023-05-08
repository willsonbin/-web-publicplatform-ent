
import backend from './../../utils/backend'
import api from './../../api/index'

const state = {
  countryAreaTree: window.sessionStorage.getItem('countryAreaTree') ? JSON.parse(window.sessionStorage.getItem('countryAreaTree')) : [],
  productTree: []
}

const mutations = {
  SET_COUNTRYAREATREE: (state, countryAreaTree) => {
    state.countryAreaTree = countryAreaTree
  },
  SET_PRODUCTTREE: (state, productTree) => {
    state.productTree = productTree
  }
}

const actions = {
  // 获取原产国/地区树areaType:（0-国内，1-国外）
  getCountryAreaTree({ commit }) {
    return new Promise((resolve, reject) => {
      backend.request(api.common.getCountryAreaTree, { type: 0 }).then((response) => {
        var data = response.data
        var fn = function(items) {
          items.forEach(item => {
            item.label = item.areaName || ''
            // item.parentId 不存在的是国家，取areaCode、存在的是地区，取areaNumber
            item.value = item.parentId ? item.areaNumber : item.areaCode
            if (item.child && item.child.length > 0) {
              item.children = item.child
              fn(item.child)
            } else {
              item.children = null
            }
          })
        }
        fn(data)
        window.sessionStorage.setItem('countryAreaTree', JSON.stringify(data))
        commit('SET_COUNTRYAREATREE', data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取HS编码树
  getProductTree({ commit }) {
    return new Promise((resolve, reject) => {
      backend.request(api.common.getProductTree).then((response) => {
        console.log(response)
        var data = response.data
        var fn = function(items) {
          items.forEach(item => {
            if (item.children && item.children.length > 0) {
              fn(item.children)
            } else {
              item.children = null
            }
          })
        }
        fn(data)
        commit('SET_PRODUCTTREE', data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
