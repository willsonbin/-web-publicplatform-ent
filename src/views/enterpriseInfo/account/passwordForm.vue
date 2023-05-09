<template>
  <div id="pwdForm">
    <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" label-width="110px" label-position="top">
      <!-- 为了解决默认读取页面账户密码的问题(START) -->
      <el-input class="zc_display" type="text" />
      <el-input class="zc_display" type="password" />
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="basicForm.newPwd" placeholder="请输入" maxlength="16" show-password clearable />
        <PasswordStrength :new-pws="basicForm.newPwd" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="surePwd">
        <el-input v-model="basicForm.surePwd" placeholder="请输入" maxlength="16" show-password clearable />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { passwordVerify } from '../../../utils/validate'
import PasswordStrength from '../../common/passwordStrength.vue'
export default {
  components: { PasswordStrength },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.basicForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      basicForm: {
        newPwd: '',
        surePwd: '',
        orgType: 0,
        userId: '',
        userIds: [],
        encryptToken: ''
      },
      basicFormRules: {
        newPwd: [{ required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
          { min: 8, max: 16, message: '密码长度为8-16个字符', trigger: 'blur' },
          { validator: passwordVerify, trigger: 'blur' }],
        surePwd: [
          { required: true, message: '请再次输入密码', trigger: ['blur', 'change'] },
          { required: true, validator: validatePass2, trigger: ['blur', 'change'] }]
      },
      publicKey: ''
    }
  },
  mounted() {
    this.getPublicKey()
  },
  methods: {
    // 获取公钥
    getPublicKey() {
      this.$backend.request(this.$api.common.getPublicKey).then((res) => {
        if (res.success) {
          this.publicKey = res.data.key
          this.basicForm.encryptToken = res.data.token
        }
      })
    },
    submit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid && this.publicKey) {
          if (this.showCheckPwd) {
            return
          }
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          param.newPwd = this.$util.CalcUtils.handleJsencrypt(this.publicKey, param.newPwd)
          param.surePwd = this.$util.CalcUtils.handleJsencrypt(this.publicKey, param.surePwd)
          if (param.userIds.length <= 1) {
            param.userIds = [this.basicForm.userId]
          }
          this.$backend.request(this.$api.enterprise.updateUserPwd, param).then((response) => {
            this.$emit('error')
            if (response.success) {
              this.$emit('handleSubmit')
              this.close()
            }
            this.$util.TipsUtils.message(response)
          })
        } else {
          this.$emit('error')
        }
      })
    },
    close() {
      this.initData()
      this.clear()
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['basicForm'] && this.$refs['basicForm'].clearValidate()
      })
    },
    initData() {
      for (const item in this.basicForm) {
        this.basicForm[item] = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/******为了解决默认读取页面账户密码的问题******/
    .zc_display{
      position: absolute;
        left: -10000px;
        top: -10000px;
        height: 0;
        width: 0;
    }
#pwdForm{
  padding: 0 20px;
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
  ::v-deep .el-form-item--medium .el-form-item__label{
    font-weight: normal;
    padding: 0px;
  }
  ::v-deep .el-form-item .el-input--medium .el-input__inner{
    width: 100%
  }
  ::v-deep .el-form-item__error{
  position: unset !important;
  margin-top: 0px !important;
}
::v-deep .el-form-item{
  margin-bottom: 0px;
}
::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  position: unset !important;
}
}
</style>
