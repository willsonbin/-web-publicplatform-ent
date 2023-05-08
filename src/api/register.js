module.exports = {
  // 获取国家地区
  registerOrg: {
    path: '/organization',
    method: 'POST',
    server: 'trace'
  },
  getSysConfig: {
    path: '/sysConfig',
    method: 'GET',
    server: 'trace'
  },
  forgetPwd: {
    path: '/user/forgetPwd',
    method: 'PUT',
    server: 'trace'
  },
  // 获取短信验证码
  getValidateCode: {
    path: '/platform/sms/{{phone}}',
    method: 'GET',
    server: 'trace'
  }

}
