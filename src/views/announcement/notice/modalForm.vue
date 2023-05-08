<template>
  <el-dialog title="查看公告" :visible.sync="formVisible" :close-on-click-modal="false" width="45%" class="custom-dialog" @close="close">
    <h1 style="color: #000;font-size:18px">{{ form.title }}</h1>
    <p style="color: #666;font-size:14px;margin: 15px 0;">发布时间： {{ form.updateDate }}</p>
    <quill-editor
      ref="myQuillEditor"
      v-model="form.text"
      disabled
      :options="myQuillEditor"
    />
  </el-dialog>
</template>

<script>
import editorOption from './editorOption' // 富文本配置
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'ModalForm',
  components: { quillEditor },
  data() {
    return {
      formVisible: false,
      myQuillEditor: editorOption,
      form: {}
    }
  },
  mounted() {
  },
  methods: {
    close() {
      this.form = {}
      this.formVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-dialog {
  height: 90%;
  overflow: hidden;
  padding-bottom: 20px;
  >>> .el-dialog {
    height: 90%;
    overflow: hidden;
    .el-dialog__body {
      height: 90%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .quill-editor {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
  >>> .quill-editor .ql-toolbar {
    display: none;
  }
  >>> .quill-editor .ql-container.ql-snow {
    border: none;
  }
}
</style>
