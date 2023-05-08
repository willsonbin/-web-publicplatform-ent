<template>
  <div>
    <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" label-width="110px" label-position="right">
      <el-form-item label="认证机构：" prop="institutionId">
        <!-- <el-select
          v-model="basicForm.institutionId"
          placeholder="请选择"
          clearable
          filterable
          allow-create
          default-first-option
          @change="handleChageIns"
        >
          <el-option v-for="item in institutionList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select> -->
        <el-select
          ref="inputSelect"
          v-model="basicForm.institutionId"
          filterable
          placeholder="请输入"
          style="width: 100%"
          clearable
          @change="changeOrgName"
          @blur="blurOrgName"
        >
          <el-option v-for="item in institutionList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <section class="cerficationCont">
          <span class="uploadTips">注：选择平台指定机构，消费者溯源页面将会展示该机构已认证标识</span>
          <img src="../../../assets/images/certification.png" style="width:12%">
        </section>
      </el-form-item>
      <el-form-item label="证书名称：" prop="certificationName">
        <el-input v-model="basicForm.certificationName" placeholder="请输入" maxlength="50" clearable @blur="basicForm.certificationName = basicForm.certificationName.trim()" />
      </el-form-item>
      <el-form-item label="证书编号：" prop="certificationNo">
        <el-input v-model="basicForm.certificationNo" placeholder="请输入" maxlength="50" clearable @blur="basicForm.certificationNo = basicForm.certificationNo.trim()" />
      </el-form-item>
      <el-form-item ref="diagramRef" label="证书图片：" prop="certificationImages">
        <span class="imgWrapper">
          <PicUpload accept=".jpg,.png" :size="3" :limit="10" :file-img-list="basicForm.certificationImages || []" :multiple="true" :arr-index="-1" @uploadFile="uploadReportile" />
          <i class="uploadTips">上传证书图片,不超过3M</i>
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PicUpload from '../../common/picUpload.vue'
export default {
  components: { PicUpload },
  data() {
    return {
      formType: '1',
      basicForm: {
        institutionId: '',
        certificationName: '',
        certificationNo: '',
        certificationImages: [],
        status: '1',
        institutionName: '',
        id: ''
      },
      basicFormRules: {
        institutionId: [{ required: true, message: '请选择认证机构', trigger: ['blur', 'change'] }],
        certificationName: [{ required: true, message: '请输入证书名称', trigger: ['blur', 'change'] }],
        certificationNo: [{ required: true, message: '请输入证书编号', trigger: ['blur', 'change'] }],
        certificationImages: [{ required: true, message: '请上传证书图片', trigger: ['blur', 'change'] }]
      },
      institutionList: [],
      type: 0 // 0 后端返回  1手动输入
    }
  },
  methods: {
    changeOrgName(val) {
      this.type = 0
      this.$set(this.basicForm, 'institutionId', val)
    },
    blurOrgName(e) {
      if (e.target.value) {
        const name = e.target.value.trim()
        this.$set(this.basicForm, 'institutionId', name || '')
        this.type = 1
      }
    },
    // 获取详细信息
    getDetailInfo(item) {
      console.log('getDetailInfo', item)
      this.basicForm.certificationName = item.certificationName
      this.basicForm.certificationNo = item.certificationNo
      this.basicForm.certificationImages = item.certificationImages
      this.basicForm.institutionName = item.institutionName
      this.basicForm.id = item.id
      if (item.institutionId === null) {
        this.type = 1
        this.basicForm.institutionId = item.institutionName
      } else {
        this.type = 0
        this.basicForm.institutionId = item.institutionId
      }
    },
    handleSubmit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          var url = ''
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          // 新增
          if (this.formType === '1') {
            delete param.id
            url = this.$api.enterprise.addOrgApprove
          } else {
            url = this.$api.enterprise.editOrgApprove
          }
          if (this.type === 1) { // 手动输入
            param.institutionName = param.institutionId
            delete param.institutionId
            param.status = '2'
          } else {
            param.status = '1'
            delete param.institutionName
          }
          // console.log('0 后端返回  1手动输入', this.type)
          this.$backend.request(url, param).then((response) => {
            if (response.success) {
              this.$emit('refreshList')
            } else {
              this.$emit('error')
            }
            this.$util.TipsUtils.message(response)
            this.clear()
          })
        } else {
          this.$emit('error')
        }
      })
    },
    // 查询认证机构
    selectInstitutionList() {
      this.$backend.request(this.$api.enterprise.selectInstitutionList, { type: 1 }).then(res => {
        this.institutionList = res.data || []
      })
    },
    uploadReportile(goodPic, file, index) {
      index = parseInt(index)
      if (index === -1) {
        this.basicForm.certificationImages = []
        for (const files of goodPic) {
          this.basicForm.certificationImages.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
        if (this.basicForm.certificationImages.length > 0) {
          this.$nextTick(() => {
            this.$refs.diagramRef.validateMessage = ''
          })
        }
      }
    },
    clear() {
      this.$refs.basicForm.clearValidate()
      this.$refs.basicForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.cerficationCont{
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}
.uploadTips{
  font-size: 12px;
  color: #333;
  font-style: normal;
  margin-right: 5px;
}
>>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  position: unset;
}
>>> .el-form-item .el-input--medium .el-input__inner{
  width: 100%;
}
</style>
