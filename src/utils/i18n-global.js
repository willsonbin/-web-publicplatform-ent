import VueI18n from 'vue-i18n'
import Vue from 'vue'
import ElementLocale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhTwLocale from 'element-ui/lib/locale/lang/zh-TW'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'CHNS', // this.$i18n.locale 通过切换locale的值来实现语言切换
  messages: {},
  silentTranslationWarn: true
})

ElementLocale.i18n((key, value) => i18n.t(key, value))
i18n.setLocaleMessage('CHNS', zhLocale)
i18n.setLocaleMessage('CHNT', zhTwLocale)
i18n.setLocaleMessage('ENG', enLocale)

Vue.prototype.$STR = function(string, defaultStr, params) {
  const formatStr = this.$t(string, params)
  if (formatStr !== string) {
    return formatStr
  } else {
    if (params) {
      return stringFormat(defaultStr, params)
    } else {
      return defaultStr
    }
  }
}

Vue.prototype.$switchLanguage = function(LANG) {
  LANG = LANG || 'CHNS'
  let data = {}
  if (LANG === 'CHNS') {
    // 简体中文
    data = Object.assign(require('../conf/zh_cn').default, zhLocale)
  } else if (LANG === 'CHNT') {
    // 繁体中文
    data = Object.assign(require('../conf/zh_tw').default, zhTwLocale)
  } else if (LANG === 'ENG') {
    // 英文
    data = Object.assign(require('../conf/en').default, enLocale)
  }
  i18n.setLocaleMessage(LANG, data)
  i18n.locale = LANG
}
function stringFormat(str, arr) {
  if (str == null || str === undefined || str.length === 0) {
    return ''
  }
  for (var i = 0; i < arr.length; i++) {
    str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), arr[i])
  }
  return str
}

// initLang();
export default i18n
