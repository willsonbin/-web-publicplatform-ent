<template>
  <div class="form-content">
    <div class="topTips">
      <i class="el-icon-warning" style="color:#FE9900; font-size:16px; margin-right:10px" />
      企业基本信息（企业名称、法人、联系电话、营业执照等），如需修改，请联系平台客服人员！
    </div>
    <div class="row-title" style="padding-top: 0px;margin-bottom: 10px;">
      <span>基本信息</span>
    </div>
    <div class="flex-form-submit flex-form-submit-three" style="margin-bottom:20px">
      <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" label-width="164px" disabled>
        <el-form-item label="注册时间：" prop="createDate" class="form-item-border-left">
          <el-input v-model="basicForm.createDate" />
        </el-form-item>
        <el-form-item label="注册IP：" prop="registerIp" class="form-item-border-right">
          <el-input v-model="basicForm.registerIp" />
        </el-form-item>
        <el-form-item label="最后编辑：" prop="updateDate" class="form-item-border-label-left">
          <el-input v-model="basicForm.updateDate" />
        </el-form-item>
        <el-form-item label="状态：" prop="status" class="form-item-border-label-right">
          <el-select v-model="basicForm.status" placeholder="请选择" style="width: 100%" clearable>
            <el-option label="待审核" value="0" />
            <el-option label="审核通过" value="1" />
            <el-option label="审核不通过" value="2" />
            <el-option label="锁定企业" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="row-title" style="padding-top: 0px;margin-bottom: 10px;">
      <span>企业信息</span>
    </div>
    <div class="flex-form-submit flex-form-submit-three" style="margin-bottom:20px">
      <el-form ref="basicForm" :model="basicForm" :rules="!isEdit ? basicFormRules : {}" label-width="164px" :disabled="isEdit">
        <el-form-item label="企业名称：" prop="name" class="form-item-border-left">
          <el-input v-model="basicForm.name" maxlength="50" disabled />
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="creditCode" class="form-item-border-right">
          <el-input v-model="basicForm.creditCode" maxlength="18" disabled />
        </el-form-item>
        <el-form-item label="国家地区：" prop="areaArray" class="form-item-border-left">
          <el-cascader
            v-model="basicForm.areaArray"
            style="width: 100%"
            :options="countryAreaTree"
            :props="{ checkStrictly: true, label: 'label', value: 'value'}"
            disabled
          />
        </el-form-item>
        <el-form-item label="企业法人：" prop="representative" class="form-item-border-right">
          <el-input v-model="basicForm.representative" maxlength="30" disabled />
        </el-form-item>
        <el-form-item label="联系电话：" prop="contactPhone" class="form-item-border-left">
          <el-input v-model="basicForm.contactPhone" maxlength="13" disabled />
        </el-form-item>
        <el-form-item label="企业地址：" prop="address" class="form-item-border-right">
          <el-input v-model="basicForm.address" maxlength="100" />
        </el-form-item>
        <el-form-item label="企业简介：" prop="remarks" style="width: 99.9%" class="form-item-border-label-left">
          <el-input v-model="basicForm.remarks" type="textarea" maxlength="200" />
        </el-form-item>
        <span style="margin: 20px 0px;width: 100%;font-size: 16px">图片信息</span>
        <div v-if="isEdit" class="picContent">
          <el-form-item label="营业执照扫描件：" prop="businessLicense" class="form-item-border-left">
            <span v-if="basicForm.businessLicense" class="imgWrapper imgWrapper-left" style="flex-direction:row;overflow-x:auto">
              <span v-for="item in basicForm.businessLicense" :key="item.id">
                <el-image
                  style="height:60px; margin-right:2px"
                  :src="item.url"
                  :preview-src-list="basicForm.businessLicense.map(item => item.url)"
                />
              </span>
              <!-- <img v-for="(item) in basicForm.businessLicense" :key="item.id" :src="item.url" style="width:60px; height:60px;margin-right:5px"> -->
            </span>
            <span v-else class="imgWrapper" style="border-left: 0; border-right: 0;border-bottom: 0;">暂无</span>
            <!-- <span v-for="item in scope.row.reportImages" :key="item.id" class="report-img-list">
              <el-image
                style="width:100%; height:100%; margin-right:2px"
                :src="item.url"
                :preview-src-list="scope.row.reportImages.map(item => item.url)"
              />
            </span> -->
          </el-form-item>
          <el-form-item label="企业展示图：" prop="displayDiagram" class="form-item-border-right">
            <span v-if="basicForm.displayDiagram" class="imgWrapper imgWrapper-right" style="flex-direction:row;overflow-x:auto">
              <span v-for="item in basicForm.displayDiagram" :key="item.id">
                <el-image
                  style="min-width:60px; height:60px; margin-right:2px"
                  :src="item.url"
                  :preview-src-list="basicForm.displayDiagram.map(item => item.url)"
                />
              </span>
              <!-- <img v-for="(item) in basicForm.displayDiagram" :key="item.id" :src="item.url" style="width:60px; height:60px; margin-right:5px"> -->
            </span>
            <span v-else class="imgWrapper" style="border-left: 0;border-bottom: 0;">暂无</span>
          </el-form-item>
          <el-form-item label="企业注册商标：" prop=" registeredTrademark" class="form-item-border-label-left">
            <span v-if="basicForm.registeredTrademark" class="imgWrapper imgWrapper-label-left" style="flex-direction:row;overflow-x:auto">
              <span v-for="item in basicForm.registeredTrademark" :key="item.id">
                <el-image
                  style="min-width:60px; height:60px; margin-right:2px"
                  :src="item.url"
                  :preview-src-list="basicForm.registeredTrademark.map(item => item.url)"
                />
              </span>
              <!-- <img v-for="(item) in basicForm.registeredTrademark" :key="item.id" :src="item.url" style="width:60px; height:60px; margin-right:5px"> -->
            </span>
            <span v-else class="imgWrapper" style="border-right: 0">暂无</span>
          </el-form-item>
          <el-form-item label="企业二维码：" prop="qrCode" class="form-item-border-label-right">
            <span v-if="basicForm.qrCode" class="imgWrapper imgWrapper-label-right" style="flex-direction:row;overflow-x:auto">
              <span v-for="item in basicForm.qrCode" :key="item.id">
                <el-image
                  style="min-width:60px; height:60px; margin-right:2px"
                  :src="item.url"
                  :preview-src-list="basicForm.qrCode.map(item => item.url)"
                />
              </span>
              <!-- <img v-for="(item) in basicForm.qrCode" :key="item.id" :src="item.url" style="width:60px; height:60px; margin-right:5px"> -->
            </span>
            <span v-else class="imgWrapper">暂无</span>
          </el-form-item>
        </div>
        <div v-else class="picContent">
          <el-form-item ref="licenseRef" label="营业执照扫描件：" prop="businessLicense">
            <span class="imgWrapper imgWrapper-left">
              <PicUpload accept=".jpg,.png" :size="5" :file-img-list="basicForm.businessLicense || []" :limit="1" :arr-index="-1" @uploadFile="uploadFileLicense" />
            </span>
          </el-form-item>
          <el-form-item ref="diagramRef" label="企业展示图：" prop="displayDiagram" class="diagram">
            <span class="imgWrapper imgWrapper-right">
              <PicUpload accept=".jpg,.png" :size="3" :file-img-list="basicForm.displayDiagram || []" :multiple="true" :limit="10" :arr-index="-1" @uploadFile="uploadDiagramFile" />
              <i class="uploadTips">上传企业展示图,每张不超过3M</i>
            </span>
          </el-form-item>
          <el-form-item label="企业注册商标：" prop=" registeredTrademark">
            <span class="imgWrapper imgWrapper-label-left">
              <PicUpload accept=".jpg,.png" :size="3" :file-img-list="basicForm.registeredTrademark || []" :multiple="true" :limit="10" :arr-index="-1" @uploadFile="uploadTrademark" />
              <i class="uploadTips">上传企业注册商标,每张不超过3M</i>
            </span>
          </el-form-item>
          <el-form-item label="企业二维码：" prop="qrCode">
            <span class="imgWrapper imgWrapper-label-right">
              <PicUpload accept=".jpg,.png" :size="3" :file-img-list="basicForm.qrCode || []" :multiple="true" :limit="10" :arr-index="-1" @uploadFile="uploadCode" />
              <i class="uploadTips">上传企业二维码,每张不超过3M</i>
            </span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <section v-if="isEdit && hasPermission('MENU_ORG_DATA_BUTTON_EDIT')" class="bottomContent">
      <el-button type="primary" @click="editForm">编辑资料</el-button>
    </section>
    <section v-if="!isEdit" class="bottomContent">
      <el-button type="primary" @click="cancelEditInfo">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitEditInfo">保存</el-button>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { specialChar, identityCode, checkTelphone } from '../../../utils/validate'
import PicUpload from '../../common/picUpload'
export default {
  name: 'EnterpriseRecord',
  components: { PicUpload },
  data() {
    return {
      basicForm: {
        createDate: '',
        registerIp: '',
        updateDate: '',
        status: '',
        name: '',
        creditCode: '',
        areaArray: [],
        representative: '',
        contactPhone: '',
        addres: '',
        remarks: '',
        businessLicense: [],
        displayDiagram: [],
        registeredTrademark: [],
        qrCode: []
      },
      basicFormRules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }],
        areaArray: [
          { required: true, message: '请选择国家地区', trigger: 'change' }
        ],
        creditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { min: 18, max: 18, message: '请输入正确的统一社会信用代码', trigger: 'blur' },
          { validator: identityCode, trigger: 'blur' }
        ],
        representative: [
          { required: true, message: '请输入企业法人', trigger: 'blur' },
          { validator: specialChar, trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkTelphone, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入企业地址', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请输入企业简介', trigger: 'blur' }
        ],
        displayDiagram: [
          { required: true, message: '请上传企业展示图', trigger: 'blur' }
        ]
      },
      orgType: [{ name: '政府单位', type: 0 }, { name: '进口商', type: 1 }],
      currentFile: {},
      treeData: [],
      isEdit: true,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo', 'countryAreaTree'
    ])
  },
  activated() {
    this.getOrgRecordInfo()
    this.getAreaInfo()
  },

  methods: {
    // 取消编辑
    cancelEditInfo() {
      this.isEdit = true
      this.getOrgRecordInfo()
    },
    // 提交编辑资料
    submitEditInfo() {
      this.$refs['basicForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$backend.request(this.$api.enterprise.editOrganization, this.basicForm).then((response) => {
            this.loading = false
            if (response.success) {
              this.isEdit = true
              this.$store.dispatch('user/getFlag', true)
              window.sessionStorage.setItem('orgInfoFlag', true)
            } else {
              this.$util.TipsUtils.message(response)
              return
            }
          })
        }
      })
    },
    // 上传营业执照
    uploadFileLicense(goodPic, file, index) {
      index = parseInt(index)
      if (index === -1) {
        this.basicForm.businessLicense = []
        for (const files of goodPic) {
          this.basicForm.businessLicense.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
        if (this.basicForm.businessLicense.length > 0) {
          this.$nextTick(() => {
            this.$refs.licenseRef.validateMessage = ''
          })
        }
      }
    },
    // 企业展示图上传
    uploadDiagramFile(goodPic, file, index) {
      index = parseInt(index)
      if (index === -1) {
        this.basicForm.displayDiagram = []
        for (const files of goodPic) {
          this.basicForm.displayDiagram.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
        if (this.basicForm.displayDiagram.length > 0) {
          this.$nextTick(() => {
            this.$refs.diagramRef.validateMessage = ''
          })
        }
      }
    },
    // 企业注册商标
    uploadTrademark(goodPic, file, index) {
      index = parseInt(index)
      if (index === -1) {
        this.basicForm.registeredTrademark = []
        for (const files of goodPic) {
          this.basicForm.registeredTrademark.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
      }
    },
    uploadCode(goodPic, file, index) {
      index = parseInt(index)
      if (index === -1) {
        this.basicForm.qrCode = []
        for (const files of goodPic) {
          this.basicForm.qrCode.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
      }
    },
    // 编辑按钮
    editForm() {
      this.isEdit = false
    },
    // 获取国家地区
    getAreaInfo() {
      this.$backend.request(this.$api.common.getCountryAreaTree, { type: 0 }).then((response) => {
        if (response.success) {
          this.treeData = response.data
          this.$util.ObjectUtils.assignValue(
            this.treeData,
            'areaName',
            'areaNumber',
            'child'
          )
        }
      })
    },
    // 获取当前企业信息
    getOrgRecordInfo() {
      const orgId = this.userInfo.orgId
      this.$backend.request(this.$api.enterprise.getOrgRecordInfo, orgId).then((response) => {
        this.basicForm = response.data || {}
        this.basicForm.status = response.data.status.toString()
        const arr = JSON.parse(response.data.areaNumber)
        const newArr = []
        arr.map((item) => {
          newArr.push(item.number)
        })
        this.userInfo.orgNameCn = response.data.name
        this.$store.dispatch('user/setUserInfo', this.userInfo)
        window.sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        this.basicForm.areaArray = newArr
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content{
    display: flex;
    flex-direction: column;
  .topTips{
  border: 1px solid #FFCA79;
  background: #FFF5E5;
  color: #FE9900;
  font-size: 14px;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 8px;
  margin-bottom: 20px;
}
.rowTips{
    color: #C3C3C3;
    font-size: 14px;
  }
.imgWrapper{
    border: 1px solid #dfe4ed;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 10px 5px;
    flex-direction: column;
    overflow: hidden;
    overflow-x: auto;
    >>>.el-image__inner {
      width: auto !important;
    }
}
.imgWrapper-left {
  border-left: none;
  border-right: none;
  border-bottom: none;
}
.imgWrapper-right {
  border-left: none;
  border-bottom: none;
}
.imgWrapper-label-left {
  border-right: none;
}
.imgWrapper-label-right {
  // border-left: none;
}
.bottomContent{
    background: #fff;
    box-shadow: 0 -4px 8px -1px #E2E2E2;
    width: 84%;
    padding: 20px;
    position: fixed;
    bottom: 0;
    right:20px;
    display: flex;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
}
.picContent{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  >>> .el-form-item .el-form-item__label {
    flex-shrink: 0;
  }
  >>> .el-form-item .el-form-item__content {
    overflow: hidden;
    overflow-x: auto;
  }
}
.uploadTips{
  font-size: 12px;
  color: #333;
  font-style: normal;
}
}
.diagram{
 >>> .el-form-item__error{
    top: 38%;
    left: 100px;
  }
}
>>> .flex-form-submit-three .el-form-item{
  width: 50%;
}
>>> .form-item-border-left {
  .el-form-item__label {
    border-bottom: none;
  }
  .el-form-item__content .el-input .el-input__inner {
    border-bottom: none;
    border-left: none;
    border-right: none;
  }
}
>>> .form-item-border-right {
  .el-form-item__label {
    border-bottom: none;
  }
  .el-form-item__content .el-input .el-input__inner {
    border-bottom: none;
    border-left: none;
  }
}
>>> .form-item-border-label-left {
  .el-form-item__label {
    border-right: none;
  }
   .el-form-item__content .el-input .el-input__inner {
    border-right: none;
  }
}
>>> .form-item-border-label-right {
  .el-form-item__label {
    border-right: none;
  }
}
</style>
