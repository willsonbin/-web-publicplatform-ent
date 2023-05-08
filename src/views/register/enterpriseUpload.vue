<template>
  <div class="wrapper">
    <section class="formItem">
      <span class="formTitle">基本信息：</span>
      <el-form
        ref="basicForm"
        :model="basicForm"
        :rules="rules"
        label-width="150px"
        class="demoRuleForm"
        label-position="right"
      >
        <el-form-item label="国家/地区：" prop="areaArray">
          <el-cascader v-model="basicForm.areaArray" :options="countryAreaTree" filterable :props="{ checkStrictly: true, value: 'value' }" style="width:320px" />
        </el-form-item>
        <el-form-item label="企业名称：" prop="name">
          <el-input v-model="basicForm.name" maxlength="50" clearable style="width:320px" />
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="creditCode">
          <el-input v-model="basicForm.creditCode" maxlength="18" clearable style="width:320px" />
        </el-form-item>
        <el-form-item label="企业法人：" prop="representative">
          <el-input
            v-model="basicForm.representative"
            maxlength="30"
            clearable
            style="width:320px"
          />
        </el-form-item>
        <el-form-item label="联系电话：" prop="contactPhone">
          <el-input v-model="basicForm.contactPhone" maxlength="13" clearable style="width:320px" />
        </el-form-item>
        <el-form-item label="企业地址：" prop="address">
          <el-input v-model="basicForm.address" maxlength="100" clearable style="width:400px" />
        </el-form-item>
        <el-form-item ref="licenseRef" label="营业执照扫描件：" prop="businessLicense">
          <PicUpload
            accept=".jpg, .png"
            :file-img-list="basicForm.businessLicense || []"
            :multiple="true"
            :limit="2"
            :arr-index="-1"
            :size="5"
            @uploadFile="uploadCerFile"
          />
          <span class="rowTips">上传限制jpg、png格式，单次上传不允许超过5M，最多可上传两张</span>
        </el-form-item>
        <span class="formTitle" style="margin-bottom:20px">管理员资料：</span>
        <el-form-item label="账号：" prop="userName">
          <el-input v-model="basicForm.userName" maxlength="30" clearable style="width:320px" />
        </el-form-item>
        <el-form-item label="真实姓名：" prop="contact">
          <el-input v-model="basicForm.contact" maxlength="30" clearable style="width:320px" />
        </el-form-item>
        <el-form-item label="身份证号码：" prop="idNumber">
          <el-input v-model="basicForm.idNumber" maxlength="18" clearable style="width:320px" />
        </el-form-item>
        <el-form-item label="手机号码：" prop="telephone">
          <el-input v-model="basicForm.telephone" maxlength="11" clearable style="width:320px" />
        </el-form-item>
        <el-form-item label="短信验证码：" prop="verificationCode" class="codeInput">
          <el-input
            v-model="basicForm.verificationCode"
            clearable
            maxlength="6"
            style="width:280px"
          />
          <button class="code-btn" :disabled="!show" @click.prevent="getCode()">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{ count }} s</span>
          </button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script>
import {
  specialChar,
  identityCode,
  checkTelphone,
  verifyAccount,
  phoneNumber
} from '../../utils/validate'
import PicUpload from '../common/picUpload'
import { mapGetters } from 'vuex'
export default {
  components: { PicUpload },
  data() {
    return {
      show: 'false',
      count: '',
      treeData: [],
      isBasicFormPass: false,
      isuploadPass: false,
      basicForm: {
        name: '',
        areaArray: ['CHN'],
        creditCode: '',
        representative: '',
        contactPhone: '',
        address: '',
        businessLicense: [],
        type: 1,
        userName: '',
        contact: '',
        idNumber: '',
        telephone: '',
        areaNumber: '',
        status: 0,
        verificationCode: '',
        countryCode: ''
      },
      rules: {
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        areaArray: [
          { required: true, message: '请选择国家地区', trigger: 'change' }
        ],
        creditCode: [
          {
            required: true,
            message: '请输入统一社会信用代码',
            trigger: 'blur'
          },
          {
            min: 18,
            max: 18,
            message: '请输入正确的统一社会信用代码',
            trigger: 'blur'
          },
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
        businessLicense: [
          { required: true, message: '请输入上传营业执照', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { validator: verifyAccount, trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: specialChar, trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          {
            max: 18,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
          }
          // { validator: isIdentity, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: phoneNumber, trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
          // { min: 4, max: 6, message: "验证码长度为4-6个字符", trigger: "blur" }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ])
  },
  mounted() {
    this.$store.dispatch('common/getCountryAreaTree')
  },

  methods: {
    // 获取短信验证码
    getCode() {
      if (this.basicForm.telephone === '') {
        return this.$message.error('手机号不能为空')
      } else if (this.basicForm.telephone.length < 11) {
        return this.$message.error('请输入正确的手机号')
      }
      // axios请求发送短信验证码
      const param = this.basicForm.telephone
      this.$backend.request(this.$api.register.getValidateCode, param).then(res => {
        console.log(res, '发送短信验证')
      })
      // 验证码倒计时
      if (!this.timer) {
        this.count = 60
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    /** ******************************** */
    // 图片上传
    uploadCerFile(goodPic, file, index) {
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
    // 获取国家地区
    getAreaInfo() {
      this.$backend
        .request(this.$api.common.getCountryAreaTree, { type: 0 })
        .then(response => {
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
    // 表单提交
    submitForm() {
      this.$refs['basicForm'].validate(valid => {
        if (valid && this.basicForm.businessLicense.length > 0) {
          this.handeleFormInfo()
        } else {
          this.$emit('isCheckedTwo', false)
          this.$emit('error')
        }
      })
    },
    handeleFormInfo() {
      const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
      param.countryCode = param.areaArray[0]
      this.$backend
        .request(this.$api.register.registerOrg, param)
        .then(response => {
          if (response.success) {
            this.$emit('resultCode', response.data.businessNumber)
            this.$emit('isCheckedTwo', true)
            return
          } else {
            this.$emit('error')
            this.$message.error(response.message)
            this.$emit('isCheckedTwo', false)
            return
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.codeInput {
  position: relative;
}
.code-btn {
  width: 100px;
  height: 20px;
  position: absolute;
  top: 10px;
  left: 175px;
  z-index: 222;
  //#ef8466橘色
  color: #409eff;
  font-size: 14px;
  border: none;
  border-left: 1px solid #bababa;
  padding-left: 10px;
  background-color: #fff;
  cursor: pointer;
}
.wrapper {
  width: 100%;
  .formItem {
    margin-bottom: 20px;
    .formTitle {
      font-size: 16px;
      border-bottom: 1px solid #e2e2e2;
      width: 100%;
      display: inline-block;
      padding-bottom: 5px;
    }
  }
  .demoRuleForm {
    margin-top: 20px;
    font-weight: normal;
  }
  .rowTips {
    color: #c3c3c3;
    font-size: 14px;
  }
}
>>> .el-form-item__error {
  position: unset;
  margin-top: 0px;
}
>>> .el-form-item {
  margin-bottom: 16px;
}
>>> .el-form-item--medium .el-form-item__label {
  font-weight: normal;
}
>>> .el-form-item .el-input--medium .el-input__inner {
  width: 100%;
}
</style>
