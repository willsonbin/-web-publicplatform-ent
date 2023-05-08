module.exports = {
  // 查询企业备案信息
  orgRecordInfo: {
    path: '/organization/loginOrgInfo',
    method: 'GET',
    server: 'trace'
  },
  // 获取商品列表信息
  getGoodsList: {
    path: '/goods',
    method: 'GET',
    server: 'trace'
  },
  // 添加商品
  addGoods: {
    path: '/goods',
    method: 'POST',
    server: 'trace'
  },
  // 编辑商品
  editGoods: {
    path: '/goods',
    method: 'PUT',
    server: 'trace'
  },
  // 删除商品
  deleteGoods: {
    path: '/goods/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  // 根据id查询商品信息
  getGoodsIfoById: {
    path: '/goods/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  // 上传图片
  uploadFile: {
    path: '/file/upload',
    method: 'POST',
    server: 'trace'
  },
  // 用户查询
  getUserList: {
    path: '/user',
    method: 'GET',
    server: 'trace'
  },
  // 修改状态
  updateUserStatus: {
    path: '/user/batchUpdateStatus',
    method: 'PUT',
    server: 'trace'
  },
  // updateUserPwd: {
  //   path: '/user/updateUserPwd',
  //   method: 'PUT',
  //   server: 'trace'
  // },
  updateUserPwd: {
    path: '/user/batchUpdateUserPwd',
    method: 'PUT',
    server: 'trace'
  },
  // 新增用户
  addUser: {
    path: '/user',
    method: 'POST',
    server: 'trace'
  },
  // 修改用户
  editUser: {
    path: '/user',
    method: 'PUT',
    server: 'trace'
  },
  // 删除用户
  deleteUser: {
    path: '/user/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  getuserDetail: {
    path: '/user/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  // 获取企业角色
  selectRoleByOrgId: {
    path: '/role/selectRoleByOrgId',
    method: 'GET',
    server: 'trace'
  },
  // 根据类型生成账号
  getUserAccount: { // 0政府 1企业
    path: '/user/account',
    method: 'GET',
    server: 'trace'
  },
  getOrgRecordInfo: {
    path: '/organization/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  editOrganization: {
    path: '/organization',
    method: 'PUT',
    server: 'trace'
  },
  getOrganization: { // 分页查询组织信息
    path: '/entOrganization',
    method: 'GET',
    server: 'trace'
  },
  addOrganization: { // 新增组织
    path: '/entOrganization',
    method: 'POST',
    server: 'trace'
  },
  putOrganization: { // 编辑组织
    path: '/entOrganization',
    method: 'PUT',
    server: 'trace'
  },
  putOrganizationStatus: { // 批量修改组织状态
    path: '/entOrganization/batchUpdateStatus',
    method: 'PUT',
    server: 'trace'
  },
  deleteOrganization: { // 删除组织
    path: '/entOrganization/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  addOrganizationArea: { // 新增组织销售区域
    path: '/entOrganization/saveArea',
    method: 'POST',
    server: 'trace'
  },
  getOrganizationArea: { // 获取组织销售区域
    path: '/entOrganization/getArea',
    method: 'GET',
    server: 'trace'
  },
  getAnnouncement: { // 公告内容列表-分页
    path: '/announcement',
    method: 'GET',
    server: 'trace'
  },
  selectInstitutionList: { // 选择检测机构
    path: '/productReview/selectInstitutionList',
    method: 'GET',
    server: 'trace'
  },
  getOrgApproveList: {
    path: '/orgApprove',
    method: 'GET',
    server: 'trace'
  },
  // 新增企业认证
  addOrgApprove: {
    path: '/orgApprove',
    method: 'POST',
    server: 'trace'
  },
  // 编辑企业认证
  editOrgApprove: {
    path: '/orgApprove',
    method: 'PUT',
    server: 'trace'
  },
  // 删除企业认证
  deleteOrgApprove: {
    path: '/orgApprove',
    method: 'DELETE',
    server: 'trace'
  },
  importEntOrganization: { // 组织管理-批量导入
    path: '/entOrganization/import',
    method: 'POST',
    server: 'trace'
  },
  entOrganizationTemplate: { // 组织管理-下载模板
    path: '/dict/template/download',
    method: 'POST',
    server: 'trace'
  },
  // 个人中心信息修改
  centerEditUser: {
    path: '/user/update',
    method: 'PUT',
    server: 'trace'
  }
}
