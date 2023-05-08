const editorOption = {
  placeholder: '请输入文本',
  theme: 'snow',
  modules: {
    clipboard: {
      // 粘贴版，处理粘贴时候带图片
      matchers: [[Node.ELEMENT_NODE, handleCustomMatcher]]
    },
    // 工具栏定义的
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
        [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
        [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
        [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
        [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
        [{ font: [] }], // 字体种类-----[{ font: [] }]
        [{ align: [] }], // 对齐方式-----[{ align: [] }]
        // ['link'] // 链接 照片
        ['link', 'image'] // 链接 照片
      ]
    }
    // imageResize: {
    //   displaySize: true
    // }
  }
}
function handleCustomMatcher(node, Delta) {
  // const ops = []
  // Delta.ops.forEach(op => {
  //   if (op.insert && typeof op.insert === 'string') { // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
  //     ops.push({
  //       insert: op.insert
  //     })
  //   }
  // })
  // Delta.ops = ops
  return Delta
}
export default editorOption
