<template>
  <div class="excelContent">
    <el-dialog
      title="批量导入"
      :visible.sync="showExcelDialog"
      width="30%"
    >
      <section class="container">
        <!-- <div class="excelTips">
          <i class="el-icon-warning" style="font-size: 22px; color:#F0981B" />
          <p>选择本地文件导入至系统，请确保导入的文件与系统“<el-button type="text" @click="downTemplate">默认模板.xlsx</el-button>”一致，注意*为导入的必填项！</p>
        </div> -->
        <el-upload
          v-if="showUploadBtn"
          ref="uploadRef"
          class="upload-demo"
          drag
          action="/"
          :multiple="false"
          accept=".xls,.xlsx"
          :auto-upload="false"
          :on-change="onChange"
          :show-file-list="true"
        >
          <i class="el-icon-upload" style="color:#0F58FF" />
          <div class="el-upload__text">{{ importForm.file.name||'将文件拖到此处或点击上传' }}</div>
        </el-upload>
        <div v-if="!showUploadBtn" class="continue-upload">
          <i class="el-icon-circle-check" />
          <div>
            <p>（{{ uploadTotal || 0 }}条）导入成功！</p>
            <p>{{ importForm.file.name }}</p>
          </div>
        </div>
        <p v-if="showUploadBtn && !showFileTips" style="align-self: center;">请确保导入的文件与系统“<el-button type="text" style="color: #E71F19;" @click="downTemplate">默认模板.xlsx</el-button>”一致！</p>
        <p v-if="showFileTips" style="width: 360px;text-align:left;line-height: 30px;color:#E71F19">{{ fileTips }}</p>
      </section>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="showExcelDialog = false">取 消</el-button>
        <el-button type="primary" @click="uploadFile">上传</el-button>
      </span> -->
      <span slot="footer" class="dialog-footer">
        <el-button v-if="showUploadBtn" @click="handleCancel">取 消</el-button>
        <el-button v-if="showUploadBtn" :loading="loading" type="primary" @click="uploadFile">上传</el-button>
        <el-button v-if="!showUploadBtn" :loading="loading" type="primary" @click="uploadFileContinue">继续上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { axios } from '@/utils/backend'
export default {
  props: ['importapi', 'type', 'importType'],
  data() {
    return {
      showExcelDialog: false,
      importForm: {
        file: {}
      },
      showUploadBtn: true,
      uploadTotal: 0,
      loading: false,
      showFileTips: false,
      fileTips: ''
    }
  },
  watch: {
    showExcelDialog() {
      this.onChange({})
    }
  },
  methods: {
    handleCancel() {
      this.importForm = {
        file: {}
      }
      this.uploadTotal = ''
      this.showUploadBtn = true
      this.showExcelDialog = false
    },
    uploadFileContinue() {
      this.showUploadBtn = true
      this.importForm = {
        file: {}
      }
    },
    downTemplate() {
      this.loading = true
      axios({
        method: 'POST',
        url: window.config.traceUrl + `/dict/template/download?type=${this.type}`,
        data: '',
        responseType: 'blob'
      }).then(res => {
        this.loading = false
        this.$util.DownLoadUtils.jsDownload(res)
      }).catch(err => {
        console.log(err)
      })
    },
    onChange(file) {
      this.importForm.file = file
    },
    // 文件上传
    uploadFile() {
      if (this.importForm.file.name === undefined) return this.$message({ showClose: true, message: '请先上传文件', type: 'error' })
      const formdata = new FormData()
      formdata.append('file', this.importForm.file.raw)
      const url = this.importapi
      let param = {}
      if (this.importType === undefined) {
        param = { }
      } else {
        param = { type: this.importType }
      }
      // this.$backend.spcialRequest(url, formdata, { responseType: 'blob' }, this.type === undefined ? '' : param).then(response => {
      //   this.$util.TipsUtils.message(response)
      //   this.showExcelDialog = false
      // })
      this.loading = true
      this.$backend.request(url, { file: this.importForm.file.raw }, {}, false, true, param).then(response => {
        this.loading = false
        this.$util.TipsUtils.message(response)
        this.labelDataVisiable = false
        if (response.success) {
          this.showUploadBtn = false
          this.showFileTips = false
          this.fileTips = ''
          this.uploadTotal = response.data || 0
          this.$emit('ok')
        } else {
          this.showFileTips = true
          this.fileTips = '文件导入失败，请修改后重新上传'
          this.showUploadBtn = true
          this.importForm = {
            file: {}
          }
          this.$forceUpdate()
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scope>
.excelContent{
    display: flex;
    align-content: center;
    justify-content: center;
    .excelTips{
        background: #EBEEF5;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px;
        margin-bottom: 10px;
        p{
            margin-left: 10px;
            line-height: 24px;
        }
}
.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.el-upload-list__item-name{
  display: none;
}
}
.continue-upload {
  display: flex;
  align-items: center;
  color: #0f58ff;
  .el-icon-circle-check {
    font-size: 50px;
    font-weight: 600;
    color: #0f58ff;
    margin-right: 20px;
  }
  p{
    line-height: 24px;
  }
}

</style>
