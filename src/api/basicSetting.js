module.exports = {
  getLabelApply: { // 标签申请-分页列表查询
    path: '/label/order/page',
    method: 'GET',
    server: 'trace'
  },
  repealLableApply: { // 撤销标签申请
    path: '/label/order/{{id}}',
    method: 'PUT',
    server: 'trace'
  },
  getLableApplyDetail: { // 查询标签申请详情
    path: '/label/order/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  deleteLableApplyDetail: { // 删除标签申请
    path: '/label/order/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  getLabelOrderList: { // 追溯码列表-分页列表查询
    path: '/label/order/list/page',
    method: 'GET',
    server: 'trace'
  },
  getLabelOrderDetailsList: { // 追溯码列表-详情列表
    path: '/label/order/list/details',
    method: 'GET',
    server: 'trace'
  },
  detectionApply: { // 产品检测申请
    path: '/productReview/detectionApply',
    method: 'POST',
    server: 'trace'
  },
  selectInstitutionList: { // 选择产品检测机构
    path: '/productReview/selectInstitutionList',
    method: 'GET',
    server: 'trace'
  },
  productBatchUpdateStatus: { // 产品状态修改
    path: '/productReview/batchUpdateStatus',
    method: 'PUT',
    server: 'trace'
  },
  productReview: { // 上传报告
    path: '/productReview',
    method: 'POST',
    server: 'trace'
  },
  getProductReviewPage: { // 产品报告分页查询
    path: '/productReview',
    method: 'GET',
    server: 'trace'
  },
  getSelectListByOrgId: { // 获取检测产品列表
    path: '/trace/allProductAndMaterials',
    method: 'GET',
    server: 'trace'
  },
  getBatchList: { // 获取产品批次列表
    path: '/batch/selectListByProductId/{{productId}}',
    method: 'GET',
    server: 'trace'
  },
  deleleteProductPreport: { // 删除产品检测报告
    path: '/productReview/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  productRecordOperation: {
    path: '/productReview/recordOperation',
    method: 'PUT',
    server: 'trace'
  },
  getProDetailInfo: { // 获取产品批次列表
    path: '/productReview/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  getEffectReview: { // 功效宣称检测-分页列表
    path: '/effectReview',
    method: 'GET',
    server: 'trace'
  },
  addEffectReview: { // 功效宣称检测-检测申请
    path: '/effectReview/detectionApply',
    method: 'POST',
    server: 'trace'
  },
  getEffectReviewDetail: { // 功效宣称检测-详情
    path: '/effectReview/{{id}}',
    method: 'GET',
    server: 'trace'
  },
  getEffectDictList: { // 功效宣称检测-功效宣称字典列表
    path: '/effectReview/selectEffectList',
    method: 'GET',
    server: 'trace'
  },
  getOrganTestList: { // 功效宣称检测-机构列表（type--1认证机构 2检测机构）
    path: '/effectReview/selectInstitutionList',
    method: 'GET',
    server: 'trace'
  },
  editEffectReviewStatus: { // 功效宣称检测-取消、撤回
    path: '/effectReview/recordOperation',
    method: 'PUT',
    server: 'trace'
  },
  deleleteEffectReview: { // 功效宣称检测-删除
    path: '/effectReview/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  getShippingAddressAll: { // 收货地址-全部列表
    path: '/shippingAddress/list',
    method: 'GET',
    server: 'trace'
  },
  getShippingAddress: { // 收货地址-分页列表
    path: '/shippingAddress/page',
    method: 'GET',
    server: 'trace'
  },
  addShippingAddress: { // 收货地址-新增
    path: '/shippingAddress',
    method: 'POST',
    server: 'trace'
  },
  editShippingAddress: { // 收货地址-编辑
    path: '/shippingAddress',
    method: 'PUT',
    server: 'trace'
  },
  deleteShippingAddress: { // 收货地址-删除
    path: '/shippingAddress/{{id}}',
    method: 'DELETE',
    server: 'trace'
  },
  deleteBatchShippingAddress: { // 收货地址-批量删除
    path: '/shippingAddress/btach',
    method: 'DELETE',
    server: 'trace'
  },
  downLoadImages: { // 功效宣称检测-下载图片
    path: '/effectReview/downloadPics',
    method: 'POST',
    server: 'trace'
  },
  getLabelStatusPage: { // 作废激活列表
    path: '/label/status/page',
    method: 'GET',
    server: 'trace'
  },
  getLabelStatusActive: {
    path: '/label/status/active', // 码值激活
    method: 'PUT',
    server: 'trace'
  },
  getLabelStatusInvalid: {
    path: '/label/status/invalid', // 码值作废
    method: 'PUT',
    server: 'trace'
  },
  getBatchByProduct: { // 根据商品查询批次信息
    path: '/trace/batch/batchByProduct/{{id}}{{ddde}}',
    method: 'GET',
    server: 'trace'
  },
  getProductBatch: { // 根据企业选择商品
    path: '/trace/product/byOrg',
    method: 'GET',
    server: 'trace'
  },
  addProductAttr: { // 添加产品属性
    path: '/productAttr',
    method: 'POST',
    server: 'trace'
  },
  eidtProductAttr: { // 修改产品属性
    path: '/productAttr',
    method: 'PUT',
    server: 'trace'
  },
  changeAttrBatchStatus: { // 产品属性状态修改
    path: '/productAttr/changeBatchStatus',
    method: 'PUT',
    server: 'trace'
  },
  deleteAttrBatch: { // 删除
    path: '/productAttr/deleteBatch',
    method: 'DELETE',
    server: 'trace'
  },
  getProductAttrPage: { // 获取产品属性列表（分页）
    path: '/productAttr/page',
    method: 'GET',
    server: 'trace'
  },
  shipLableApply: { // 标签申请-收货
    path: '/label/order/receipt/{{id}}',
    method: 'PUT',
    server: 'trace'
  }
}
