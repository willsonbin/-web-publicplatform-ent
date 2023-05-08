module.exports = {
  // 发送短信验证码
  getValidateCode: {
    path: '/platform/sms/{{phone}}',
    method: 'GET',
    server: 'trace'
  },
  // 验证短信验证码
  validateCode: {
    path: '/platform/sms',
    method: 'GET',
    server: 'trace'
  },
  // 验证手机号
  validatePhone: {
    path: '/user/phone/{{phone}}',
    method: 'GET',
    server: 'trace'
  }
}
