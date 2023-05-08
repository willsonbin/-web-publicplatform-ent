import Vue from 'vue'
import 'babel-polyfill'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/assets/iconfont/iconfont.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router' // internationalization

/* import i18n from './lang'*/ import i18n from './utils/i18n-global'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import backend from './utils/backend'
import api from './api/index'
import util from './utils/main'
import './directive/index'
import DebounceInputCom from '@/components/DebounceInput/index.js'
import VueQuillEditor from 'vue-quill-editor'
import lodash from 'lodash'
Vue.prototype.lodash = lodash

// // 全局组件
// import DebounceInput from '@/components/DebounceInput'
// Vue.component('DebounceInput', DebounceInput)
Vue.use(DebounceInputCom)
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

import axios from 'axios'
axios.defaults.withCredentials = true // 让ajax携带cookie
Vue.prototype.$http = axios // 这样设置就可以在组件内用 this.$http 使用axios了
axios.defaults.baseURL = '' // 初始化基础地址

import echarts from 'echarts'
// import 'echarts/map/js/world'
Vue.prototype.$echarts = echarts

import * as filters from './filters' // global filters
Object.defineProperty(Vue.prototype, '$backend', {
  get() {
    return backend
  }
})
Object.defineProperty(Vue.prototype, '$api', {
  get() {
    return api
  }
})
Object.defineProperty(Vue.prototype, '$util', {
  get() {
    return util
  }
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 日期过滤器
// eslint-disable-next-line no-irregular-whitespace
Vue.filter('dateFormate', function(value) {
  if (!value) {
    // eslint-disable-next-line no-irregular-whitespace
    return ''
  } else {
    value = value.toString()
    // eslint-disable-next-line no-irregular-whitespace
    return value.split(' ')[0]
  }
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
