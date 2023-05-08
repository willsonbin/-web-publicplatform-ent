import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import StringUtil from "./utils/string";

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', '/auth-redirect', '/register', '/password'] // no redirect whitelist

function getTokeByUrl(url) {
  const urlStr = url.split('?')
  let params = null
  if (urlStr.length > 1) {
    params = urlStr[1]
    const vars = params.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === 'Token') {
        return pair[1]
      }
    }
  } else {
    return null
  }
}

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const token = getTokeByUrl(window.location.href)
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          store.dispatch('common/getCountryAreaTree')
          // store.dispatch('common/getProductTree')
          await store.dispatch('user/getUserMenu')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
          /* setUserMenuFlag()*/
          // dynamically add accessible routes
          if (from.path === '/' && to.path !== '/dashboard') {
            next('/dashboard')
          }
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          /* next({ ...to, replace: true })*/
          next({ ...to, replace: true })
        } catch (error) {
        // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/401`)
          NProgress.done()
        }
      }
    }
  } else if (token && window.config.remoteDebugg) {
    setToken(token)
    // 清除url上的Token
    // delTokeByUrl('Token')
    // const { permissions } = await store.dispatch('user/getInfo')
    // console.log('---------permission:' + JSON.stringify(permissions))
    // const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
    // router.addRoutes(accessRoutes)
    next('/')
  } else {
    /* has no token*/

    // other pages that do not have permission to access are redirected to the login page.
    // if (window.config.remoteDebugg) {
    //   // await store.dispatch('user/getInfo')
    //   next('/')
    //   NProgress.done()
    // } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
    // }
  }
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
