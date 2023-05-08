import FileSaver from 'file-saver'
import { axios } from './backend'
import { Message } from 'element-ui'

/**
 * 从Content-disposition中提取文件名
 * @param disposition
 * @returns {string}
 */
export default {
  extractDispositionName(disposition) {
    // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
    const pattern = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
    const result = pattern.exec(disposition)
    return decodeURI(decodeURIComponent(escape(result[1])))
  },

  /**
 * js 作为代理从远程获取文件内容然后下载文件
 * @param response
 */
  jsDownload(response) {
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const filename = this.extractDispositionName(response.headers['content-disposition'])

    FileSaver.saveAs(blob, filename)
  },
  // jsDownload(response, self) {
  //   const reader = new FileReader() // 创建读取文件对象
  //   try {
  //     reader.readAsText(response.data, 'utf-8') // 设置读取的数据以及返回的数据类型为utf-8
  //     reader.addEventListener('loadend', () => {
  //       try {
  //         const res = JSON.parse(reader.result) // 返回的数据
  //         if (res.message) return self.$message({ showClose: true, message: res.message, type: 'error' })
  //       } catch (error) {
  //         const blob = new Blob([response.data], { type: response.headers['content-type'] })
  //         const filename = this.extractDispositionName(response.headers['content-disposition'])
  //         FileSaver.saveAs(blob, filename)
  //       }
  //     })
  //   } catch (error) {
  //     const blob = new Blob([response.data], { type: response.headers['content-type'] })
  //     const filename = this.extractDispositionName(response.headers['content-disposition'])
  //     FileSaver.saveAs(blob, filename)
  //   }
  // },
  jsDownloadDecodeURI(response) {
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const pattern = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
    const result = pattern.exec(response.headers['content-disposition'])
    FileSaver.saveAs(blob, decodeURI(result[1]))
  },

  // 下载txt
  jsDownLoadTxt(url) {
    const link = document.createElement('a')
    // 这里是将url转成blob地址，
    fetch(url).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
      link.href = URL.createObjectURL(blob)
      link.download = ''
      document.body.appendChild(link)
      link.click()
    })
  },
  getBlob(url) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest()

      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response)
        }
      }
      xhr.send()
    })
  },
  saveFileAs(blob, filename, type) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename)
    } else {
      const link = document.createElement('a')
      const body = document.querySelector('body')

      link.href = window.URL.createObjectURL(blob)
      link.download = filename + '.' + type

      // fix Firefox
      link.style.display = 'none'
      body.appendChild(link)

      link.click()
      body.removeChild(link)

      window.URL.revokeObjectURL(link.href)
    }
  },
  download(url, filename, type) {
    this.getBlob(url).then(blob => {
      this.saveFileAs(blob, filename, type)
    })
  },
  // 下载数据文件
  downLoadFile(url, data, params) {
    axios({
      method: 'GET',
      url: url,
      data,
      params,
      responseType: 'blob'
    }).then(res => {
      if (res.data.type === 'application/json') {
        // 转换成Blob类型数据
        const blobData = new Blob([res.data])
        const reader = new FileReader() // 创建读取文件对象
        reader.addEventListener('loadend', () => {
          const res = JSON.parse(reader.result) // 返回的数据
          if (res.message) {
            Message({
              message: res.message || '操作成功',
              type: res.success ? 'success' : 'error',
              duration: 3 * 1000,
              showClose: true
            })
          }
        })
        reader.readAsText(blobData, 'utf-8') // 设置读取的数据以及返回的数据类型为utf-8
      } else {
        this.jsDownload(res)
        Message({
          message: '操作成功',
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
