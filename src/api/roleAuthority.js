module.exports = {
  getRoleList: {
    path: '/role',
    method: 'GET',
    server: 'trace'
  },
  getRoleInfo: {
    path: '/role/',
    method: 'GET',
    server: 'trace'
  },
  updateRoleStatus: {
    path: '/role/batchUpdateStatus',
    method: 'PUT',
    server: 'trace'
  },
  getPermissionTree: {
    path: '/menu/menuTree',
    method: 'GET',
    server: 'trace'
  },
  addRole: {
    path: '/role',
    method: 'POST',
    server: 'trace'
  },
  editRole: {
    path: '/role',
    method: 'PUT',
    server: 'trace'
  },
  deleteRoleInfo: {
    path: '/role/',
    method: 'DELETE',
    server: 'trace'
  },
  getOprationList: { // 操作日志-分页列表
    path: '/log/page?',
    method: 'GET',
    server: 'trace'
  },
  getOprationModule: { // 操作日志-获取操作模块
    path: '/log/module/list',
    method: 'GET',
    server: 'trace'
  },
  getOprationType: { // 操作日志-获取操作类型
    path: '/log/operate/list?',
    method: 'GET',
    server: 'trace'
  }
}
