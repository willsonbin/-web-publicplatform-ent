module.exports = {
  // 溯源码申请
  addCodeOrder: {
    path: '/codeOrder',
    method: 'POST',
    server: 'trace'
  },
  getCodeOrder: {
    path: '/codeOrder',
    method: 'GET',
    server: 'trace'
  },
  // 分页查询溯源填报列表
  getReportList: {
    path: '/reportInfo',
    method: 'GET',
    server: 'trace'
  },
  // 根据id查询溯源信息详情
  getReportInfoById: {
    path: '/reportInfo/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  // 删除溯源填报
  deleteReportList: {
    path: '/reportInfo/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  // 添加商品溯源填报
  addReportGoods: {
    path: '/reportInfo',
    method: 'POST',
    server: 'trace'
  },
  // 修改商品溯源填报
  editReportGoods: {
    path: '/reportInfo',
    method: 'PUT',
    server: 'trace'
  },
  // 根据商品名称模糊查询商品信息/goods/like/{name}
  getGoodsInfo: {
    path: '/goods/like/{{name}}',
    method: 'GET',
    server: 'trace'
  },
  // 获取当前最大码值
  getCodeInfo: {
    path: '/codeInfo/maxTpid/{{orgId}}',
    method: 'GET',
    server: 'trace'
  }
}
