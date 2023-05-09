<template>
  <el-dialog
    title="标签数据"
    :visible.sync="labelDataVisiable"
    width="30%"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <section v-if="!isFormVisible" class="dialogWrap">
      <div class="topContent">
        <i class="el-icon-warning" style="color: #FC9F0D;font-size: 40px;margin-bottom: 10px;" />
        <h3 style="margin-bottom:10px">{{ productName }} ({{ batchNo }})</h3>
        <p class="downloadTips">未获取到已赋码的标签数据，如已申请标签，可将标签数据上传后绑定
          <!-- <el-button type="text" @click="downTemplate">示例文件</el-button> -->
        </p>
      </div>
      <div class="labelLimit">
        <span>标签上限： <b style="color: #E71F19">100</b>万个</span>
      </div>
      <div class="uploadArea">
        <el-upload
          v-if="showUploadBtn"
          class="upload-demo"
          drag
          action="/"
          accept=".xls,.xlsx"
          :auto-upload="false"
          :on-change="onChange"
          :show-file-list="true"
        >
          <i class="el-icon-upload" style="color: #0F58FF" />
          <div class="el-upload__text">{{ importForm.file.name||'将文件拖到此处或点击上传' }}</div>
        </el-upload>
      </div>
      <div v-if="!showUploadBtn" class="continue-upload">
        <i class="el-icon-circle-check" />
        <div>
          <p>（{{ uploadTotal || 0 }}条）导入成功！</p>
          <p>{{ importForm.file.name }}</p>
        </div>
      </div>
      <span v-if="showUploadBtn" style="align-self: center; margin-top:5px">请确保导入的数据文件，与“标签申请”下载的一致！</span>
    </section>
    <section v-if="isFormVisible" class="dialogWrap">
      <div class="topContent">
        <i class="el-icon-warning" style="color: #FC9F0D;font-size: 40px;margin-bottom: 10px;" />
        <h3 style="margin-bottom:10px">正在准备解除产品{{ productName }} ({{ batchNo }}) 标签绑定！</h3>
      </div>
      <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" label-position="top">
        <el-form-item v-if="isShowOrderNo" label="业务编号：" prop="orderNo">
          <el-select v-model="basicForm.orderNo " placeholder="请选择" clearable @change="hanleChangeOrderNo">
            <el-option v-for="item in alreadyLabels" :key="item.orderNo" :label="item.orderNo" :value="item.orderNo" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isShowOrderNo" label="解除类型：" prop="type ">
          <el-select v-model="basicForm.type " placeholder="请选择" clearable @change="hanleChangeType">
            <el-option label="码段" value="0" />
            <el-option label="码值" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="basicForm.type==='0'" label="码段：" prop="startSegment">
          <section style="display:flex; flex-direction: row;align-items: center;align-content: center;">
            <el-input v-model="basicForm.startSegment" placeholder="请输入内容" maxlength="16" clearable :disabled="isShowOrderNo" />
            <span class="line" />
            <el-input v-model="basicForm.endSegment" placeholder="请输入内容" maxlength="16" clearable :disabled="isShowOrderNo" />
          </section>
        </el-form-item>
        <el-form-item v-if="basicForm.type === '1'" label="码值：" prop="code">
          <el-input v-model="basicForm.code" placeholder="请输入内容" maxlength="16" clearable />
        </el-form-item>
        <el-form-item label="解除理由：" prop="remarks">
          <el-input v-model="basicForm.remarks" type="textarea" :rows="3" placeholder="请输入理由" maxlength="200" show-word-limit @blur="basicForm.remark = basicForm.remark.trim()" />
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer" class="dialog-footer">
      <section v-if="!isUnbind">
        <el-button v-if="showUploadBtn" @click="handleCancel">取 消</el-button>
        <el-button v-if="showUploadBtn" type="primary" :loading="loading" @click="uploadFile">上传</el-button>
      </section>
      <section v-if="isUnbind">
        <el-button v-if="isShowUnBindBtn" @click="handleShowForm">解除绑定</el-button>
        <el-button v-if="isShowupdateBtn" type="primary" @click="uploadFileContinue">更新数据</el-button>
        <el-button v-if="isUploadBtn" type="primary" :loading="loading" @click="uploadFile">上传</el-button>
        <el-button v-if="unbindCancel" @click="handleCancelUnBind">取消</el-button>
        <el-button v-if="unbindConfirm" type="primary" @click="handleConfirmUnbind">确定</el-button>
      </section>
    </div>
  </el-dialog>
</template>

<script>
import { axios } from '@/utils/backend'
export default {
  props: ['importapi'],  // eslint-disable-line
  data() {
    return {
      labelDataVisiable: false,
      importForm: {
        file: {}
      },
      basicForm: {
        orderNo: '',
        batchId: '',
        code: '',
        endSegment: '',
        remarks: '',
        startSegment: '',
        type: '0' // 解除类型（0-码段，1-码值）
      },
      basicFormRules: {
        type: [{ required: true, message: '请选择解除类型', trigger: 'change' }],
        startSegment: [
          { required: true, message: '请输入起始值', trigger: 'blur' }
        ],
        endSegment: [
          { required: true, message: '请输入终止值', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入码值', trigger: 'blur' }],
        remarks: [{ required: true, message: '请输入解除理由', trigger: 'blur' }]
      },
      batchId: '',
      batchNo: '',
      productName: '',
      loading: false,
      uploadTotal: '',
      showUploadBtn: true,
      isUnbind: false, // 控制底部按钮
      isShowupdateBtn: true, // 更新数据按钮
      isFormVisible: false, // 解除绑定表单
      isUploadBtn: false, // 上传按钮
      isShowUnBindBtn: false, // 解除绑定按钮
      unbindCancel: false, // 解绑时取消按钮
      unbindConfirm: false, // 解绑时确认按钮
      alreadyLabels: [],
      isShowOrderNo: false // 判断业务编号是否显示
    }
  },
  watch: {
    showExcelDialog() {
      this.onChange({})
    }
  },
  methods: {
    getExportExcel(id) {
      this.$backend.request(this.$api.traceabilityInfo.getExportExcel, id).then((res) => {
        if (res.success) {
          if (res.data && res.data.length > 0) {
            this.alreadyLabels = res.data
            this.isShowOrderNo = true
            this.isFormVisible = true
            this.isUnbind = true
            this.isShowUnBindBtn = true
          } else {
            this.isShowOrderNo = false
            this.alreadyLabels = []
            this.isFormVisible = false
            this.isUnbind = false
            this.isShowUnBindBtn = false
          }
        }
      })
    },
    hanleChangeOrderNo(val) {
      if (val) {
        this.alreadyLabels.map((item) => {
          if (item.orderNo === val) {
            this.basicForm.startSegment = item.startSegment
            this.basicForm.endSegment = item.endSegment
          }
        })
      } else {
        this.basicForm.startSegment = ''
        this.basicForm.endSegment = ''
      }
    },
    // 解除绑定按钮
    handleShowForm() {
      this.isFormVisible = true
      this.isShowupdateBtn = false
      this.isShowUnBindBtn = false
      this.isUploadBtn = false
      this.unbindCancel = true
      this.unbindConfirm = true
    },
    // 取消绑定
    handleCancelUnBind() {
      this.isFormVisible = false
      this.isUploadBtn = true
      this.isShowUnBindBtn = true
      this.unbindCancel = false
      this.unbindConfirm = false
      this.showUploadBtn = true
    },
    // 弹框取消
    handleCancel() {
      this.importForm = {
        file: {}
      }
      this.uploadTotal = ''
      this.showUploadBtn = true
      this.labelDataVisiable = false
      this.$nextTick(() => {
        this.$refs['basicForm'] && this.$refs['basicForm'].clearValidate()
      })
    },
    // 确定解绑
    handleConfirmUnbind() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          this.$backend.request(this.$api.traceabilityInfo.batchRelieveBind, param).then((response) => {
            if (response.success) {
              this.labelDataVisiable = false
              this.$emit('ok')
            }
            this.$util.TipsUtils.message(response)
            this.clear()
          })
        }
      })
    },
    // 更新数据
    uploadFileContinue() {
      this.isFormVisible = false
      this.showUploadBtn = true
      this.isShowupdateBtn = false
      this.isUploadBtn = true
      this.importForm = {
        file: {}
      }
      this.$nextTick(() => {
        this.$refs['basicForm'] && this.$refs['basicForm'].clearValidate()
      })
    },
    onChange(file) {
      this.importForm.file = file
    },
    // 作废类型切换
    hanleChangeType(val) {
      this.basicForm.type = val
      this.basicForm.endSegment = ''
      this.basicForm.remarks = ''
      this.basicForm.startSegment = ''
      this.basicForm.code = ''
      this.$nextTick(() => {
        this.$refs.basicForm.clearValidate()
      })
    },
    clear() {
      this.showUploadBtn = true
      this.isUnbind = false // 控制底部按钮
      this.isShowupdateBtn = true // 更新数据按钮
      this.isFormVisible = false // 解除绑定表单
      this.isUploadBtn = false // 上传按钮
      this.isShowUnBindBtn = false // 解除绑定按钮
      this.unbindCancel = false
      this.unbindConfirm = false
      this.basicForm.type = '0'
      this.basicForm.startSegment = ''
      this.basicForm.endSegment = ''
      this.basicForm.orderNo = ''
      this.basicForm.remarks = ''
    },
    // 文件下载
    downTemplate() {
      this.loading = true
      axios({
        method: 'POST',
        url: window.config.traceUrl + '/dict/template/download?type=7',
        data: '',
        responseType: 'blob'
      }).then(res => {
        this.loading = false
        this.$util.DownLoadUtils.jsDownload(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 文件上传
    uploadFile() {
      if (this.importForm.file.name === undefined) return this.$message({ showClose: true, message: '请先上传文件', type: 'error' })
      const formdata = new FormData()
      formdata.append('', this.importForm.file.raw)
      const url = this.importapi
      const param = { batchId: this.batchId }
      this.loading = true
      this.$backend.request(url, { file: this.importForm.file.raw }, {}, false, true, param).then(response => {
        this.loading = false
        this.$util.TipsUtils.message(response)
        // this.labelDataVisiable = false
        if (response.success) {
          this.isUnbind = true
          this.showUploadBtn = false
          this.uploadTotal = response.data || 0
          this.isFormVisible = false
          this.isShowUnBindBtn = true
          this.isShowupdateBtn = true
          this.unbindCancel = false
          this.unbindConfirm = false
          this.isUploadBtn = false
          this.importForm = {
            file: {}
          }
          this.showFileTips = false
          this.fileTips = ''
          this.$emit('ok')
        } else {
          this.showFileTips = true
          this.fileTips = '文件导入失败，请修改后重新上传'
          this.clear()
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getLabelDetail(row) {
      this.productName = row.productName
      this.batchNo = row.batchNo
      this.batchId = row.id
      this.basicForm.batchId = row.id
      this.getExportExcel(row.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogWrap{
  display: flex;
  flex-direction: column;
  .topContent{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .downloadTips{
      margin-bottom: 10px;
      color: #333;
      border-bottom: 1px solid #F0F0F0;
    }
  }
  .labelLimit{
    align-self: flex-start;
    margin-left: 50px;
  }
  .uploadArea{
    margin-top: 10px;
    align-self: center;
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
  .line{
    width: 50px;
    height: 1px;
    background: #dcdfe6;
    display: inline-block;
}
  ::v-deep .el-upload-list__item-name{
    display: none;
  }
  ::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    position: unset;
  }
::v-deep .el-form-item .el-input--medium .el-input__inner {
    width: 100%;
}
}
</style>
