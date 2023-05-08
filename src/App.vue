<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  data() {
    return {
    }
  },
  watch: {
    $route(to) {
      const hasToken = getToken() // eslint-disable-line
      // if (hasToken) {
      //   this.$backend.request(this.$api.login.recordInformation, {
      //     path: to.path,
      //     type: 0 // 0:政府端 1: 企业端
      //   })
      // }
      if (to.path === '/dashboard' || to.path === '/') {
        this.$store.dispatch('bread/setBreadList', []).then(() => {})
        return
      }
      if (to.matched && to.matched.length > 0) {
        var arr = []
        to.matched.forEach((item, index) => {
          if (index === 0) {
            arr.push({
              name: item.meta.title,
              path: '/'
            })
          } else {
            arr.push({
              name: item.meta.title,
              path: item.path
            })
          }
        })
        this.$store.dispatch('bread/setBreadList', arr).then(() => {})
      }
    }
  }
}
</script>
