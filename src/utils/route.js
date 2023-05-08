export default {
  closeSelectedTag(that) {
    const view = that.$route
    that.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
      if (this.isActive(view, that)) {
        this.toLastView(visitedViews, view, that)
      }
    })
  },
  isActive(route, that) {
    return route.path === that.$route.path
  },
  toLastView(visitedViews, view, that) {
    console.log(visitedViews.slice(-1))
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
      that.$router.push(latestView.fullPath)
    } else {
      if (view.name === 'Dashboard') {
        that.$router.replace({ path: '/redirect' + view.fullPath })
      } else {
        that.$router.push('/')
      }
    }
  }
}
