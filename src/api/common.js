module.exports = {
  // 查询原产国/地区树形数据
  getCountryAreaTree: {
    path: '/dict/area/tree',
    method: 'GET',
    server: 'trace'
  },
  uploadFile: {
    path: '/file/upload',
    method: 'Post',
    server: 'trace'
  },
  // 获取公钥
  getPublicKey: {
    path: '/getPublicKey',
    method: 'GET',
    server: 'trace'
  }
}
