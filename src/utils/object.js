import StringUtil from './string'

export default {
  // 对象拷贝
  deepCopy(p, d) {
    let c
    if (p instanceof Array) {
      c = d || []
    } else {
      c = d || {}
    }
    for (const i in p) {
      if (typeof p[i] === 'object' && p[i] !== null) {
        c[i] = (p[i].constructor === Array) ? [] : {}
        this.deepCopy(p[i], c[i])
      } else {
        c[i] = p[i]
      }
    }
    return c
  },
  // 前位补零
  prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n)
  },
  // es6 Map
  // json对象转Map对象
  jsonToMap(obj) {
    const newMap = new Map()
    for (const k of Object.keys(obj)) {
      newMap.set(obj[k][0], obj[k][1])
    }
    return newMap
  },
  isObj(obj) {
    const arr = Object.keys(obj)
    return arr.length === 0
  },
  getImgToBase64(url, callback) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function() {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL('image/png')
      callback(dataURL)
      canvas = null
    }
    img.src = url
  },
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','); var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  },
  filterCode(operateCode) {
    for (const code in operateCode) {
      if (operateCode[code] !== null) {
        return code === 'qcc' ? operateCode[code].tpid : operateCode[code]
      }
    }
  },
  assignValue(arr, label, value, children) {
    arr.forEach((item) => {
      if (item.child && item.child.length > 0) {
        this.assignValue(item.child, label, value, children)
      } else {
        item.child = null
      }
      item.value = item[value]
      item.label = item[label]
      item.children = item[children]
    })
  },
  assignOtherValue(arr, label, value, children) {
    arr.forEach((item) => {
      if (item.child && item.child.length > 0) {
        this.assignOtherValue(item.child, label, value, children)
      } else {
        item.child = null
      }
      item.value = item[value]
      item.label = item[label]
      item.children = item[children]
    })
  },

  filterTreeById(arr, id) {
    arr.forEach((item) => {
      if (item.id === id) {
        throw new Error(JSON.stringify(item))
      }
      if (item.children && item.children.length > 0) {
        this.filterTreeById(item.children, id)
      }
    })
  },
  buildQuery(json) {
    if (!json) {
      return ''
    }
    if (StringUtil.isString(json)) return json
    let query = '?'
    for (const i in json) {
      query += (i + '=' + encodeURIComponent(json[i]) + '&')
    }
    if (query.charAt(query.length - 1) === '&') {
      query = query.substr(0, query.length - 1)
    }
    return query
  },
  /* 数量计算*/
  calcNum(data, flag) {
    let value = 0
    data.foodBatchList.forEach((item) => {
      switch (flag) {
        case 0:
          value += parseInt(item.quantity)
          break
        case 1:
          value += parseInt(item.netWeight)
          break
        case 2:
          value += parseInt(item.grossWeight)
          break
      }
    })
    value = value || ''
    if (!value) {
      return ''
    }
    switch (flag) {
      case 0:
        value += data.quantityUnitName ? data.quantityUnitName : data.foodBatchList[0].quantityUnitName
        break
      case 1:
        value += data.netWeightUnitName ? data.netWeightUnitName : data.foodBatchList[0].netWeightUnitName
        break
      case 2:
        value += data.grossWeightUnitName ? data.grossWeightUnitName : data.foodBatchList[0].grossWeightUnitName
        break
    }
    return value || ''
  },
  /* 企业类型*/
  filterComType(num) {
    if (!num) {
      return ''
    }
    num += ''
    num = num.split(',')
    let data = ''
    if (num.indexOf('1') > -1) {
      data = data + '生产商' + ','
    }
    if (num.indexOf('2') > -1) {
      data = data + '出口商' + ','
    }
    if (num.indexOf('3') > -1) {
      data = data + '进口商' + ','
    }
    if (num.indexOf('4') > -1) {
      data = data + '分销商' + ','
    }
    return data.slice(0, data.length - 1)
  },
  showRowData(list, key) {
    if (!list.loodFoodList) {
      return ''
    }
    let data = ''
    list.loodFoodList.forEach((item) => {
      data += item[key] + ','
    })
    data = data.slice(0, data.length - 1)
    return data
  },
  generateUUID() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }
}
