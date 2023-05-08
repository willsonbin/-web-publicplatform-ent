module.exports = {
  // 登录
  tempLogin: {
    path: '/login',
    method: 'POST',
    server: 'trace'
  },
  // 获取菜单按钮权限
  getMenuList: {
    path: '/menu/permission',
    method: 'GET',
    server: 'trace'
  },
  // 修改密码
  updatePwd: {
    path: '/user/updatePwd',
    method: 'PUT',
    server: 'trace'
  },
  // 记录信息
  recordInformation: {
    path: '/statistics',
    method: 'POST',
    server: 'trace'
  },
  getSysConfig: {
    path: '/sysConfig',
    method: 'GET',
    server: 'trace'
  }
}
