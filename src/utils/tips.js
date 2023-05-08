import { Message } from 'element-ui'
export default {
  message(response) {
    Message({
      message: response.message || '操作成功',
      type: response.type || (response.success ? 'success' : 'error'),
      duration: 3 * 1000,
      showClose: true
    })
  }
}
