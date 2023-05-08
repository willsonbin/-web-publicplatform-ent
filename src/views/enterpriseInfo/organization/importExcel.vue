<template>
  <div class="excelContent">
    <el-dialog
      title="批量导入"
      :visible.sync="showExcelDialog"
      custom-class="customWidth"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <section class="container">
        <el-form ref="basicForm" :model="basicForm" label-width="100px" style="width: 360px" :rules="basicFormRules" label-position="top">
          <el-form-item label="导入组织：" prop="type">
            <el-radio-group v-model="basicForm.type">
              <el-radio :label="1">生产企业</el-radio>
              <el-radio :label="2">加工企业</el-radio>
              <el-radio :label="3">经销商</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-upload
          v-if="showUploadBtn"
          ref="uploadRef"
          v-loading="loading"
          class="upload-demo"
          drag
          action="/"
          :multiple="false"
          accept=".xls,.xlsx"
          :auto-upload="false"
          :on-change="onChange"
          :show-file-list="false"
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
        <p v-if="showUploadBtn && !showFileTips" style="width: 360px;text-align:left;line-height: 30px">请确保导入的文件与系统“<span style="cursor:pointer;color:#E71F19;" @click="downTemplate">默认模板.xlsx</span>”一致</p>
        <p v-if="showFileTips" style="width: 360px;text-align:left;line-height: 30px;color:#E71F19">{{ fileTips }}</p>
      </section>
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
  data() {
    return {
      showExcelDialog: false,
      importForm: {
        file: {}
      },
      loading: false,
      basicForm: {
        type: ''
      },
      basicFormRules: {
        type: [{ required: true, message: '请选择导入组织', trigger: 'change' }]
      },
      showUploadBtn: true,
      uploadTotal: '',
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
    downTemplate() {
      axios({
        method: 'POST',
        url: window.config.traceUrl + '/dict/template/download?type=10',
        responseType: 'blob'
      }).then(res => {
        this.$util.DownLoadUtils.jsDownload(res)
      }).catch(err => {
        console.log(err)
      })
    },
    uploadFileContinue() {
      this.showUploadBtn = true
      this.importForm = {
        file: {}
      }
      this.basicForm = {
        type: ''
      }
      this.$nextTick(() => {
        this.$refs['basicForm'].clearValidate()
      })
    },
    handleCancel() {
      this.importForm = {
        file: {}
      }
      this.basicForm = {
        type: ''
      }
      this.uploadTotal = ''
      this.$nextTick(() => {
        this.$refs['basicForm'].clearValidate()
      })
      this.showUploadBtn = true
      this.showExcelDialog = false
    },
    onChange(file) {
      this.importForm.file = file
    },
    // 文件上传
    uploadFile() {
      if (this.importForm.file.name === undefined) {
        this.$message({ showClose: true, message: '请先上传文件', type: 'error' })
        return
      }
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const param = {
            file: this.importForm.file.raw,
            type: this.basicForm.type
          }
          this.$backend.request(this.$api.enterprise.importEntOrganization, param, {}, false, true).then(response => {
            this.loading = false
            this.$util.TipsUtils.message(response)
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
      })
    }
  }
}
</script>
<style lang="scss" scope>
.customWidth {
  width: 500px;
}
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
    .el-form-item--medium .el-form-item__label {
      line-height: 24px;
      padding-bottom: 0;
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
.upload-demo .el-upload-dragger {
  height: 100px;
  .el-icon-upload {
    font-size: 50px;
    margin: 8px 0;
  }
}
}

</style>
