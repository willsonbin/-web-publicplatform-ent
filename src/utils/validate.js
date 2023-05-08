/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return true
  /* const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0*/
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export function onlyNumber(rule, value, callback) {
  var exp = /^([1-9]{1}[0-9]{0,7})$/
  if (value && !exp.test(value)) {
    return callback(
      new Error('请输入数字')
    )
  } else {
    callback()
  }
}
/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(rule, value, callback) {
  var exp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  if (value && !exp.test(value)) {
    return callback(
      new Error("邮箱格式不正确'")
    )
  } else {
    callback()
  }
}
export function isIdentity(rule, value, callback) {
  var exp = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
  if (value && !exp.test(value)) {
    return callback(
      new Error("请输入正确的身份证'")
    )
  } else {
    callback()
  }
}
// 手机号&座机号
export function checkTelphone(rule, value, callback) {
  // let regPone = null
  // const mobile = /^((13|14|15|17|18)[0-9]{1}\d{8})$/ // 最新16手机正则
  // const tel = /^(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,6})?$/
  // const regPone = /^((\d{3,4}\-)|)\d{4,8}(|([-\u8f6c]{1}\d{1,5}))$/
  const regPone = /^[0-9-]*$/g
  // const tel = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/ // 座机
  // if (value !== null && value.charAt(0) === '4') { // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
  //   regPone = tel
  // } else if (value !== null && value.charAt(0) !== '4') {
  //   regPone = mobile
  // }
  if (value && !regPone.test(value)) {
    return callback(
      new Error('请输入正确的电话格式')
    )
  } else {
    callback()
  }
}

export function phoneNumber(rule, value, callback) {
  var exp = /^[1][345678][0-9]{9}$/
  if (value && !exp.test(value)) {
    return callback(
      new Error('请输入正确的手机号码')
    )
  } else {
    callback()
  }
}
export function specialChar(rule, value, callback) {
  // var exp = /^([\u4e00-\u9fa5]+|[a-zA-Z0-9]+)$/
  var regEn = /[`~!……@#$%^&*()_+<>?:"{},.\/;'[\]]/im
  var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
  console.log('value', regEn.test(value))
  if (value && regEn.test(value) || regCn.test(value)) {
  // if (value && !exp.test(value)) {
    return callback(
      new Error('不能含特殊字符')
    )
  } else {
    callback()
  }
}

export function identityCode(rule, value, callback) {
  var exp = /^[a-zA-Z0-9_]{0,}$/
  if (value && !exp.test(value)) {
    return callback(
      new Error('不能含有中文或特殊字符')
    )
  } else {
    callback()
  }
}
export function verifyAccount(rule, value, callback) {
  var exp = /^[a-zA-Z0-9\_-]*$/
  if (value && !exp.test(value)) {
    return callback(
      new Error('只能输入字母,数字,_,-')
    )
  } else {
    callback()
  }
}
// 保留两位小数
export function verifyBatchNo(rule, value, callback) {
  var exp = /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/
  if (value && !exp.test(value)) {
    return callback(
      new Error('输入格式不正确')
    )
  } else {
    callback()
  }
}
export function banCharacter(rule, value, callback) {
  // var exp = /^\w+$/
  var exp = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/
  // var exp = /^[\u4e00-\u9fa5]$/
  if (value && exp.test(value)) {
  // if (value && !exp.test(value)) {
    return callback(
      new Error('不能输入中文')
    )
  } else {
    callback()
  }
}
export function passwordVerify(rule, value, callback) {
  var exp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,64}$/
  if (value && !exp.test(value)) {
    return callback(
      new Error('密码必须由字母、数字、特殊字符组成')
    )
  } else {
    callback()
  }
}
