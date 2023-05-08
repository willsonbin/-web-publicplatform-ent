module.exports = {
  // 获取产品列表信息
  getProductPage: {
    path: '/trace/product/page',
    method: 'GET',
    server: 'trace'
  },
  addProducts: {
    path: '/trace/product',
    method: 'POST',
    server: 'trace'
  },
  editProducts: {
    path: '/trace/product',
    method: 'PUT',
    server: 'trace'
  },
  deleteProducts: {
    path: '/trace/product/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  getProductsInfo: {
    path: '/trace/product/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  importExcelProduct: {
    path: '/trace/product/import',
    method: 'POST',
    server: 'trace'
  },
  muchProductSubmit: {
    path: '/trace/product/review',
    method: 'PUT',
    server: 'trace'
  },
  changeProductStatus: {
    path: '/trace/product/changeStatus/',
    method: 'PUT',
    server: 'trace'
  },
  // 获取原料列表信息
  getMaterialPage: {
    path: '/trace/material/page',
    method: 'GET',
    server: 'trace'
  },
  getMaterialFuzzy: {
    path: '/trace/material/fuzzy',
    method: 'GET',
    server: 'trace'
  },
  getProductFuzzy: {
    path: '/trace/product/fuzzy',
    method: 'GET',
    server: 'trace'
  },
  addMaterial: {
    path: '/trace/material',
    method: 'POST',
    server: 'trace'
  },
  editMaterial: {
    path: '/trace/material',
    method: 'PUT',
    server: 'trace'
  },
  deleteMaterial: {
    path: '/trace/material/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  // 获取原料属性
  getProductAttr: {
    path: '/productAttr/category/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  productCategory: {
    path: '/dict/productCategory/list',
    method: 'GET',
    server: 'trace'
  },
  // 获取原料详情
  getMaterialInfo: {
    path: '/trace/material/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  // 原料导入
  materialExportExcel: {
    path: '/trace/material/import',
    method: 'POST',
    server: 'trace'
  },
  muchSubmit: {
    path: '/trace/material/review',
    method: 'PUT',
    server: 'trace'
  },
  changeStatus: {
    path: '/trace/material/changeStatus/',
    method: 'PUT',
    server: 'trace'
  },
  addBatchInfo: {
    path: '/trace/batch',
    method: 'POST',
    server: 'trace'
  },
  editBatchInfo: {
    path: '/trace/batch/{{id}}',
    method: 'PUT',
    server: 'trace'
  },
  deleteBatchInfo: {
    path: '/trace/batch/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  getBatchPage: {
    path: '/trace/batch/page',
    method: 'GET',
    server: 'trace'
  },
  addLableApply: {
    path: '/label/order/apply',
    method: 'POST',
    server: 'trace'
  },
  // 查询批次信息
  getBatchDetail: {
    path: '/trace/batch/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  // 标签数据导入
  importLabelUrl: {
    path: '/trace/batch/importLabel',
    method: 'POST',
    server: 'trace'
  },
  // 批次导入
  batchImport: {
    path: '/trace/batch/import',
    method: 'POST',
    server: 'trace'
  },
  // 解除绑定
  batchRelieveBind: {
    path: '/trace/batch/relieveBind',
    method: 'PUT',
    server: 'trace'
  },
  // 获取原料信息
  getMaterialDetail: {
    path: '/trace/material/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  // 获取产品详情
  getProductDetail: {
    path: '/trace/product/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  // 导入
  productImport: {
    path: '/trace/product/import',
    method: 'POST',
    server: 'trace'
  },
  // 生产企业查询
  getEntOrganizationList: {
    path: '/entOrganization/list',
    method: 'GET',
    server: 'trace'
  },
  getDeliveryPage: { // 发货记录-分页列表
    path: '/delivery/page',
    method: 'GET',
    server: 'trace'
  },
  addDeliveryPage: { // 发货记录-新增发货
    path: '/delivery',
    method: 'POST',
    server: 'trace'
  },
  editDeliveryPage: { // 发货记录-修改发货
    path: '/delivery',
    method: 'PUT',
    server: 'trace'
  },
  getDeliveryDetail: { // 发货记录-查看详情
    path: '/delivery/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  getOrganizationList: { // 发货记录-获取全部经销商
    path: '/entOrganization/list',
    method: 'GET',
    server: 'trace'
  },
  getBatchByProduct: { // 根据产品名称id查询批次信息
    path: '/trace/batch/batchByProduct/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  getProductList: { // 获取原料/产品集合
    path: '/trace/product/byOrg',
    method: 'GET',
    server: 'trace'
  },
  changeDeliveryStatus: { // 发货记录-修改状态（取消、发货、退货等）
    path: '/delivery/changeStatus/{{id}}',
    method: 'PUT',
    server: 'trace'
  },
  // 恢复
  dliveryRecover: { // 发货记录-修改状态（取消、发货、退货等）
    path: '/delivery/recover/{{id}}',
    method: 'PUT',
    server: 'trace'
  },
  deleteDeliveryPage: { // 发货记录-删除发货单
    path: '/delivery/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  setDeliveryMaterial: { // 发货记录-设为原料
    path: '/delivery/setMaterial/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  getExportExcel: {
    path: '/trace/batch/exportLabelList/{{id}}',
    method: 'GET',
    server: 'trace'
  }
}
