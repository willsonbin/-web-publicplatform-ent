import { Message } from 'element-ui'
export default {
  // 非空校验
  notNullCheck: (rule, value, callback) => {
    // console.log(value, rule.required)
    if (!rule.required) {
      callback()
      return
    }
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (Array.isArray(value) && value.length === 0) {
      callback(new Error('请选择'))
    } else {
      callback()
    }
  },
  containerNumber: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (/[^\x00-\xff]/g.test(value) || /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(value) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  foodName: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (value.length <= 1 || value.length >= 33 || /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(value) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  hsCode: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (value.length <= 1 || value.length >= 33 || /[^\x00-\xff]/g.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  ifatsCode: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (/[^\x00-\xff]/g.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  rule: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (value.length <= 1 || value.length >= 51 || /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(value) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  gtin: (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.length <= 7 || value.length >= 33) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  brand: (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.length <= 1 || value.length >= 33 || /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(value) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  // 检验是否为excel文件
  checkFileType(type) {
    if (type === 'xls' || type === 'xlsx') {
      return true
    }
    return false
  },
  beforeAvatarUpload(file, accept, size) {
    const isLt2M = file.size / 1024 / 1024 < size
    var fileSuffix = file.name.slice(file.name.lastIndexOf('.') + 1)
    var isAccept = true
    if (accept && accept.indexOf(fileSuffix) < 0) {
      isAccept = false
    }
    if (!isAccept) {
      var str = accept.replace(/\./g, '')
      Message({
        showClose: true,
        message: `请上传${str}格式`,
        type: 'error'
      })
      return false
    }
    if (!isLt2M) {
      Message({
        showClose: true,
        message: '上传的文件超出了限制的文件大小',
        type: 'error'
      })
      return false
    }
    return true
  },
  // 上传附件非空校验
  fillListNotNullcheck: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请上传附件'))
    } else {
      callback()
    }
  },
  reportNumber: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请填写必填项'))
    } else if (value.length !== 18) {
      callback(new Error('请输入18位'))
    } else if (/[^\d]/g.test(value) || /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(value) || /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  notLangOfCn: (rule, value, callback) => {
    if (!value && rule.required) {
      callback(new Error('请输入必填项'))
    } else if (/[\u4e00-\u9fa5]/g.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  telephone: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (/[\u4e00-\u9fa5]/g.test(value) || /[a-zA-Z]/.test(value) || !/^[0-9-]{1,13}$/.test(value)) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  email: (rule, value, callback) => {
    if (!rule.required && !value) {
      callback()
    }
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (/[\u4e00-\u9fa5]/g.test(value) || value.indexOf('@') === -1) {
      callback(new Error('输入格式有误'))
    } else {
      callback()
    }
  },
  password: (rule, value, callback) => {
    if (!rule.required && !value) {
      callback()
    }
    var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,32}$/
    if (!value) {
      callback(new Error('请输入必填项'))
    } else if (value.length < 12 || value.length > 32) {
      callback(new Error('密码长度在12位至32位'))
    } else if (!reg.test(value)) {
      callback(new Error('至少包含大写字母、小写字母、数字、特殊符号'))
    } else {
      callback()
    }
  }
}
