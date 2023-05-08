const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.log,
  userInfo: state => state.user.userInfo,
  loading: state => state.settings.loading,
  countryAreaTree: state => state.common.countryAreaTree,
  productTree: state => state.common.productTree,
  companyInfo: state => state.user.companyInfo,
  orgInfoFlag: state => state.user.orgInfoFlag
}
export default getters
