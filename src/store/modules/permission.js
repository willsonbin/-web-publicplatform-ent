import { asyncRoutes, constantRoutes } from '@/router'
import { getPermission } from '@/utils/auth'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
/*
  function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}*/
function hasPermission(roles, route) {
  // console.log('----hasPermisison', roles, route)
  if (route.meta && route.meta.roles) {
    if (window.config.remoteDebugg) {
      return (roles.some(role => route.meta.roles.includes(role)) && getPermission().indexOf(route.meta.permission) > -1) || route.hidden
    } else {
      return true
    }
  } else {
    return true
  }
  // if (route.meta && route.meta.roles) {
  // if (window.config.remoteDebugg) {
  // return (roles.some(role => route.meta.roles.includes(role)) && getPermission().indexOf(route.meta.permission) > -1) || route.hidden
  // } else {
  //   return true
  // }
  // }
  // else {
  //   return true
  // }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, permissions) {
    console.log(permissions)
    return new Promise(resolve => {
      /* let accessedRoutes
      if (permissions.includes('permissions')) {
        accessedRoutes = asyncRoutes || []
      } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
       }*/
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
