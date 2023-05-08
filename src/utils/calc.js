import BigNumber from 'bignumber.js'
import { getLang } from '@/utils/auth'
import { JSEncrypt } from 'jsencrypt'
export default {
  add(num1, num2) {
    const x = new BigNumber(num1)
    return (x.plus(num2)).toString(10)
  },
  addWeight(num1, num2) {
    const x = new BigNumber(num1)
    return (x.plus(num2))
  },
  comparedTo(num1, num2) {
    const x = new BigNumber(num1)
    return x.comparedTo(num2) === 1 || x.comparedTo(num2) === 0
  },
  minus(num1, num2) {
    const x = new BigNumber(num1)
    return (x.minus(num2)).toString(10)
  },
  times(num1, num2) {
    var x = new BigNumber(num2)
    // return x.multipliedBy(num1)
    return x.times(num1)
  },
  // 表格固定列的宽度
  calcStyleWidth(data) {
    switch (data) {
      case 'date':// 时间
        return '160px'
      case 'index': // 序号
        return '50px'
      case 'options': // 操作(2个)
        return '100px'
      case 'option': // 操作(1个)
        return '86px'
      case 'options-three': // 操作(3个)
        return '140px'
      case 'status': // 状态开关
        return '100px'
      case 'number': // 编号
        return '200px'
      case 'process': // 编号
        return '200px'
      case 'foodName': // 食品(hs编码)
        return '200px'
    }
  },
  // 根据语言计算label的宽度
  calcLabelWidth(num1, num2) {
    return getLang() === 'CHNS' ? num1 : num2
  },
  // 时间格式化
  formateDate(time, type) {
    var date = new Date(time)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? '0' + d : d
    var h = date.getHours()
    h = h < 10 ? '0' + h : h
    var minute = date.getMinutes()
    var second = date.getSeconds()
    minute = minute < 10 ? '0' + minute : minute
    second = second < 10 ? '0' + second : second
    if (type === 'date') {
      return y + '-' + m + '-' + d
    } else {
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
  },
  // Random user password
  randomPassword(length) {
    length = Number(length)
    // Limit length
    if (length < 6) {
      length = 6
    } else if (length > 16) {
      length = 16
    }
    const passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*']
    var password = []
    let n = 0
    for (let i = 0; i < length; i++) {
      // If password length less than 9, all value random
      if (password.length < (length - 4)) {
        // Get random passwordArray index
        const arrayRandom = Math.floor(Math.random() * 4)
        // Get password array value
        const passwordItem = passwordArray[arrayRandom]
        // Get password array value random index
        // Get random real value
        const item = passwordItem[Math.floor(Math.random() * passwordItem.length)]
        password.push(item)
      } else {
        // If password large then 9, lastest 4 password will push in according to the random password index
        // Get the array values sequentially
        const newItem = passwordArray[n]
        const lastItem = newItem[Math.floor(Math.random() * newItem.length)]
        // Get array splice index
        const spliceIndex = Math.floor(Math.random() * password.length)
        password.splice(spliceIndex, 0, lastItem)
        n++
      }
    }
    return password.join('')
  },
  // 数据加密
  handleJsencrypt(publicKey, data) {
    // 使用公钥加密
    // const PUBLIC_KEY = store.getters.publicKey
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)
    const result = encrypt.encrypt(data)
    return result
  }
}
