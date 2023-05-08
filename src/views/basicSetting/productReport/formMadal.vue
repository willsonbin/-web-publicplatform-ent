<template>
  <div>
    <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" label-position="right">
      <span v-if="formType==='2'" class="title">检测信息</span>
      <el-form-item v-if="formType==='2'" label="检测机构：" prop="testingFacilityName">
        <el-autocomplete
          v-model="basicForm.testingFacilityName"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelectFacilityName"
        />
      </el-form-item>
      <el-form-item v-if="formType==='1'" label="检测机构：" prop="testingFacilityId">
        <el-select v-model="basicForm.testingFacilityId" placeholder="请选择" clearable>
          <el-option v-for="item in institutionList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="检测产品：" prop="productId">
        <el-select v-model="basicForm.productId" placeholder="请选择" clearable @change="handleSelectProduct">
          <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="检测批次：" prop="batchId">
        <el-select v-model="basicForm.batchId" placeholder="请选择" clearable>
          <el-option v-for="item in batchList" :key="item.id" :label="item.batchNo" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-input
          v-model="basicForm.remarks"
          type="textarea"
          :rows="2"
          placeholder="请输入理由"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>
      <span v-if="formType==='2'" class="title">报告信息</span>
      <el-form-item v-if="formType==='2'" label="报告名称：" prop="reportName">
        <el-input v-model="basicForm.reportName" type="text" placeholder="请输入" maxlength="30" clearable />
      </el-form-item>
      <el-form-item v-if="formType==='2'" label="报告编号：" prop="reportNo">
        <el-input v-model="basicForm.reportNo" type="text" placeholder="请输入" maxlength="30" clearable />
      </el-form-item>
      <el-form-item v-if="formType==='2'" ref="reportRef" label="上传报告：" prop="reportImages">
        <PicUpload :size="3" accept=".jpg,.png,.pdf" :file-img-list="basicForm.reportImages || []" :multiple="true" :limit="10" :arr-index="-1" @uploadFile="uploadCerFile" />
        <span class="row-title-tips">（上传限制jpg、png、pdf格式，单次上传不允许超过3M）</span>
      </el-form-item>
      <el-form-item v-if="formType==='2'" ref="reportRef" label="检测视频：" prop="vedioList">
        <VedioUpload :size="5" accept=".mp4,.flv" :file-img-list="basicForm.vedioList || []" :multiple="false" :limit="1" :arr-index="-1" @uploadFile="uploadVedio" />
        <span class="row-title-tips">（上传限制mpv、flv格式，单次上传不允许超过5M）</span>
      </el-form-item>
      <el-form-item v-if="formType==='2'" label="依据标准：" prop="standard">
        <el-input v-model="basicForm.standard" type="text" placeholder="请输入" maxlength="30" clearable />
      </el-form-item>
      <el-form-item v-if="formType==='2'" label="报告说明：" prop="standardNotes">
        <el-input
          v-model="basicForm.standardNotes"
          type="textarea"
          :rows="3"
          placeholder="请输入理由"
          maxlength="300"
          show-word-limit
          clearable
        />
        <b class="tips">提醒:上传由具备CNAS、CMA、CATL等资质的机构出具的对应批次的报告</b>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PicUpload from './fileUpload.vue'
import VedioUpload from './vedioUpload.vue'
var isApply = true
export default {
  components: { PicUpload, VedioUpload },
  data() {
    return {
      basicForm: {
        testingFacilityName: '',
        testingFacilityId: '',
        productId: '',
        batchId: '',
        remarks: '',
        reportName: '',
        reportNo: '',
        reportImages: [],
        standard: '',
        standardNotes: '',
        status: 1,
        id: '',
        vedioList: []
      },
      basicFormRules: {
        testingFacilityName: [{ required: true, message: '请输入检测机构', trigger: 'blur' }],
        testingFacilityId: [{ required: true, message: '请选择检测机构', trigger: 'change' }],
        productId: [{ required: true, message: '请选择检测产品', trigger: ['change', 'blur'] }],
        batchId: [{ required: true, message: '请选择产品批次', trigger: 'change' }],
        reportName: [{ required: isApply, message: '请输入报告名称', trigger: 'blur' }],
        reportNo: [{ required: isApply, message: '请输入报告编号', trigger: 'blur' }],
        reportImages: [{ required: isApply, message: '请上传图片', trigger: ['change', 'blur'] }],
        standard: [{ required: isApply, message: '请输入依据标准', trigger: 'blur' }],
        standardNotes: [{ required: isApply, message: '请输入标准说明', trigger: 'blur' }]
      },
      formType: '2',
      productList: [],
      batchList: [],
      institutionList: [],
      currentSelected: {}
    }
  },
  methods: {
    // 选择检测机构
    handleSelectFacilityName(val) {
      this.currentSelected = val
    },
    // 查询检测机构
    selectInstitutionList() {
      this.$backend.request(this.$api.basicSetting.selectInstitutionList, { type: 2 }).then(res => {
        this.institutionList = res.data || []
      })
    },
    // 输入匹配
    querySearch(queryString, cb) {
      var institutionList = this.institutionList
      this.institutionList.forEach((item) => {
        item.value = item.name
      })
      var results = queryString ? institutionList.filter(this.createFilter(queryString)) : institutionList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (institutionList) => {
        return (institutionList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    clear() {
      this.$refs.basicForm.remarks = ''
      this.$refs.basicForm.resetFields()
      this.$refs.basicForm.clearValidate()
    },
    getCurrentMust(val) {
      isApply = val
    },
    submitForm() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          let url = ''
          if (this.formType === '2') { // 上传报告
            url = this.$api.basicSetting.productReview
          } else { // 检测申请
            url = this.$api.basicSetting.detectionApply
          }
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          if (this.$util.StringUtils.isArray(param.remarks)) {
            param.remarks = param.remarks.pop()
          }
          param.reportImages = this.basicForm.reportImages.concat(this.basicForm.vedioList)
          delete param.vedioList
          if (this.formType === '2') {
            delete param.status
            if (Object.keys(this.currentSelected).length !== 0) {
              const n = Number(this.currentSelected.id)
              if (isNaN(n)) {
                param.id = this.currentSelected.id
              } else {
                delete param.id
              }
            }
          }
          this.$backend.request(url, param).then(res => {
            if (res.success) {
              this.$util.TipsUtils.message({ success: true, message: '操作成功' })
            } else {
              this.$util.TipsUtils.message(res)
            }
            this.clear()
            this.$emit('refreshList')
          })
        }
      })
    },
    // 查询检测产品列表
    getSelectListByOrgId() {
      this.$backend.request(this.$api.basicSetting.getSelectListByOrgId).then(res => {
        this.productList = res.data || []
      })
    },
    // 切换产品
    handleSelectProduct(val) {
      if (val) {
        this.batchList = []
        this.getBatchList(val)
      } else {
        this.batchList = []
        this.basicForm.batchId = ''
      }
    },
    // 查询检测批次列表
    getBatchList(id) {
      this.$backend.request(this.$api.basicSetting.getBatchList, id).then(res => {
        this.batchList = res.data || []
      })
    },
    // 上传图片
    uploadCerFile(goodPic, file, index) {
      index = parseInt(index)
      var me = this
      if (index === -1) {
        me.basicForm.reportImages = []
        for (const files of goodPic) {
          me.basicForm.reportImages.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
        if (this.basicForm.reportImages.length > 0) {
          this.$nextTick(() => {
            this.$refs.reportRef.validateMessage = ''
          })
        }
      }
    },
    // 上传视频
    uploadVedio(goodPic, file, index) {
      index = parseInt(index)
      var me = this
      if (index === -1) {
        me.basicForm.vedioList = []
        for (const files of goodPic) {
          me.basicForm.vedioList.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  margin-bottom: 10px;
  font-weight: bold;
  width: 120px;
}
.tips{
  font-weight: normal;
  font-size: 12px;
  color: #C3C3C3;
}
.row-title-tips{
  font-size: 12px;
  color: #C3C3C3;
  display: inline-block;
}
>>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  position: unset;
}
>>> .el-form-item__error{
  position: unset;
  margin-top: 0
}
</style>
