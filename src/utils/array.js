export default {
  /**
     * 数组求和
     */
  sum(arr) {
    let count = 0
    if (arr instanceof Array) {
      for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'string' || typeof arr[i] === 'number') {
          count += parseFloat(arr[i])
        }
      }
    }
    return count
  },
  addItem(arr, number) {
    if (arr instanceof Array) {
      for (let i = 0; i < number; i++) {
        arr.push([])
      }
      return arr
    }
    return arr
  },
  /**
     * 数组每项的值为空则用_now对应的值替换
     */
  replaceItem(_old, _now) {
    if (_old instanceof Array && _now instanceof Array) {
      for (let i = 0; i < _old.length; i++) {
        if (this.$util.stringUtil.isEmpty(_old[i]) && _now.length > i) {
          _old[i] = _now[i]
        }
      }
    }
    return _old
  },
  /**
     * 数组去重复
     * @param arr {type=Array} 要去重复的数组
     */
  unique(arr) {
    const result = []
    const hash = {}
    for (let i = 0, elem; (elem = arr[i]) != null; i++) {
      if (!hash[elem]) {
        result.push(elem)
        hash[elem] = true
      }
    }
    return result
  },
  /**
     * 数组赋值 适用于值得数组
     * @author Bruce.yang
     * @param {Array} arr 数组
     * @param {String} val 要赋予的值
     * @return {Array} 返回改变值后的数组
     */
  changeValue(arr, val) {
    arr.forEach((dom, index) => {
      arr[index] = val
    })
    return arr
  },
  /**
     * @desc 数组转树
     * @param {Array} arr - 需要转化的数组
     * @param {String} id - 节点 ID
     * @param {String} pId - 父节点 ID
     * @param {String} children - 子级属性名
     * @return {Array} 返回树结构数组
     */
  arrayToTree(arr, id = 'id', pId = 'pId', children = 'children') {
    const res = []
    const hash = {}
    let len = 0
    if (arr && arr.length > 0) {
      len = arr.length
    }
    for (let i = 0; i < len; i++) {
      hash[arr[i][id]] = arr[i]
    }
    for (let j = 0; j < len; j++) {
      const obj = arr[j]
      const hashVP = hash[obj[pId]]
      if (hashVP) {
        !hashVP[children] && (hashVP[children] = [])
        hashVP[children].push(obj)
      } else {
        res.push(obj)
      }
    }
    return res
  },
  remove(arr, val) {
    const index = arr.indexOf(val)
    if (index > -1) {
      arr.splice(index, 1)
    }
  },
  removeById(arr, val, data) {
    const index = arr.findIndex((item) => {
      return item.tempId === val
    })
    if (index > -1) {
      if (data) {
        arr.splice(index, 1, data)
      } else {
        arr.splice(index, 1)
      }
    }
  },
  // 根据field进行分组
  groupArr(list, field, name, code) {
    let fieldList = []
    const att = []
    list.map((e) => {
      fieldList.push(e[field])
    })
    fieldList = fieldList.filter((e, i, self) => {
      return self.indexOf(e) === i
    })
    for (var j = 0; j < fieldList.length; j++) {
      var arr = list.filter((e) => {
        return e[field] === fieldList[j]
      })
      att.push({
        name: arr[0][name],
        code: arr[0][code],
        list: arr
      })
    }
    return att
  },
  isRepeat(arr, key) {
    const nary = arr.sort()
    for (let i = 0; i < nary.length - 2; i++) {
      if (nary[i][key] === nary[i + 1][key]) {
        return true
      }
    }
    return false
  },
  commafy(num) { // 数字千分位分割
    return num.toString().indexOf('.') !== -1
      ? num.toLocaleString()
      : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
}
