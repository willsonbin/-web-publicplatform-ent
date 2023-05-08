<template>
  <div id="pwdForm">
    <div class="topTips">
      <i class="el-icon-warning" style="color:#FE9900; font-size:16px; margin-right:10px" />
      确定要修改密码？如果密码修改成功，需要重新登录！
    </div>
    <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" label-width="110px" label-position="top">
      <!-- 为了解决默认读取页面账户密码的问题(START) -->
      <el-input class="zc_display" type="text" />
      <el-input class="zc_display" type="password" />
      <!-- 为了解决默认读取页面账户密码的问题(END) -->
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="basicForm.oldPwd" placeholder="请输入" maxlength="16" show-password clearable />
      </el-form-item>
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
import PasswordStrength from '../../../views/common/passwordStrength.vue'
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
        userName: '',
        oldPwd: '',
        newPwd: '',
        surePwd: '',
        orgType: 1,
        encryptToken: ''

      },
      showCheckPwd: false,
      basicFormRules: {
        // userName: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }],
        oldPwd: [{ required: true, message: '请输入旧密码', trigger: ['blur', 'change'] }],
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
          this.$confirm('确定修改密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          })
            .then(() => {
              const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
              param.oldPwd = this.$util.CalcUtils.handleJsencrypt(this.publicKey, param.oldPwd)
              param.newPwd = this.$util.CalcUtils.handleJsencrypt(this.publicKey, param.newPwd)
              param.surePwd = this.$util.CalcUtils.handleJsencrypt(this.publicKey, param.surePwd)
              this.$backend.request(this.$api.login.updatePwd, param).then((response) => {
                if (response.success) {
                  this.$util.TipsUtils.message({ success: true, message: '密码已修改，请重新登录' })
                  this.$emit('handleSubmit')
                  this.close()
                  this.$store.dispatch('user/logout').then(() => {
                    this.$router.push(`/login`)
                    this.$store.dispatch('bread/setBreadList', []).then(() => {})
                  })
                } else {
                  this.$util.TipsUtils.message(response)
                }
              })
            })
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
  .el-form .el-form-item{
    width: 100%
  }
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
>>> .el-form-item--medium .el-form-item__label{
  font-weight: normal;
  padding: 0px;
}
  >>> .el-form-item .el-input--medium .el-input__inner{
    width: 100%
  }
  >>> .el-form-item__error{
  position: unset;
  margin-top: 0px;
}
>>> .el-form-item{
  margin-bottom: 10px;
}
>>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  position: unset !important;
}
}

</style>
