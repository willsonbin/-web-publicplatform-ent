<template>
  <div id="app-wrapper" class="app-wrapper">
    <div class="head">
      <img src="../../assets/images/logo.png">
      <section class="projectTitle">
        <p class="bigTitle">中国检验检疫科学研究院粤港澳大湾区研究院</p>
        <p class="smallTile">Chinese Academy of Inspection and Quarantine Greater Bay Area</p>
      </section>
      <el-tag>企业端</el-tag>
      <div class="user-center">
        <!-- <el-dropdown>
          <span class="el-dropdown-link" style="color: #fff;cursor: pointer;">
            <span style="margin-right:6px;">
              <img src="../../assets/images/loginPic.png">
            </span>
            <span>{{ userInfo.userName }}，你好</span>
          </span>
        </el-dropdown> -->
      </div>
    </div>
    <div class="main">
      <section class="app-main">
        <div class="side-bar" style="margin-right:20px">
          <div class="scrollbar">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <p class="scrollbar-wrapper-title">服务导航</p>
              <el-menu default-active="3" class="el-menu-vertical-demo" @select="changeMenu">
                <el-menu-item index="1">
                  <span slot="title">企业注册</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <span slot="title">企业登录</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <span slot="title">找回密码</span>
                </el-menu-item>
              </el-menu>
            </el-scrollbar>
          </div>
        </div>
        <div class="content">
          <transition name="fade-transform" mode="out-in">
            <div class="content-padding-box content-padding">
              <div style="padding: 6px 0px;background:#fff">
                <span class="rightTop">找回密码</span>
                <section class="stepsContent">
                  <el-steps :active="active" finish-status="success">
                    <el-step title="验证账号" />
                    <el-step title="设置新密码" />
                    <el-step title="重置成功" />
                  </el-steps>
                  <section class="formContent">
                    <el-form
                      ref="numberValidateForm"
                      :model="numberValidateForm"
                      :rules="numberValidateRules"
                      label-width="120px"
                    >
                      <el-form-item v-if="active===0" label="手机号码：" prop="phone">
                        <el-input
                          v-model="numberValidateForm.phone"
                          clearable
                          maxlength="11"
                          size="large"
                          style="width: 143%;"
                        />
                      </el-form-item>
                      <el-form-item
                        v-if="active===0"
                        label="短信验证码："
                        prop="smsCode"
                        class="codeInput"
                      >
                        <el-input
                          v-model="numberValidateForm.smsCode"
                          clearable
                          maxlength="6"
                          size="large"
                          style="width: 143%;"
                        />
                        <button class="code-btn" :disabled="!show" @click.prevent="getCode()">
                          <span v-show="show">获取验证码</span>
                          <span v-show="!show" class="count">{{ count }} s</span>
                        </button>
                      </el-form-item>
                      <el-form-item v-if="active===1" label="输入新密码：" prop="newPwd">
                        <el-input
                          v-model="numberValidateForm.newPwd"
                          clearable
                          maxlength="16"
                          type="password"
                          show-password
                          size="large"
                          style="width: 143%;"
                        />
                        <PasswordStrength :new-pws="numberValidateForm.newPwd" />
                      </el-form-item>
                      <el-form-item v-if="active===1" label="再次输入：" prop="surePwd">
                        <el-input
                          v-model="numberValidateForm.surePwd"
                          clearable
                          maxlength="16"
                          type="password"
                          show-password
                          size="large"
                          style="width: 143%;"
                        />
                      </el-form-item>
                    </el-form>
                    <section v-if="active===3">
                      <el-result icon="success" title="重置成功">
                        <template slot="extra">
                          <el-button type="primary" @click="reLogin">重新登录</el-button>
                        </template>
                      </el-result>
                    </section>
                  </section>
                </section>
              </div>
              <section class="bottomContent">
                <el-button
                  v-if="active!==3"
                  type="primary"
                  @click="submitForm()"
                >下一步</el-button>
              </section>
            </div>
          </transition>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { phoneNumber, passwordVerify } from '../../utils/validate'
import PasswordStrength from '../common/passwordStrength.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Password',
  components: { PasswordStrength },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.numberValidateForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      show: 'false',
      count: '', // 倒计时
      active: 0,
      passwordType: 'password',
      numberValidateForm: {
        phone: '',
        smsCode: '', // 验证码
        newPwd: '',
        surePwd: '',
        orgType: 1,
        encryptToken: ''
      },
      numberValidateRules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: phoneNumber, trigger: 'blur' }
        ],
        smsCode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
          // { min: 4, max: 6, message: "验证码长度为4-6个字符", trigger: "blur" }
        ],
        newPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度为8-16个字符', trigger: 'blur' },
          { validator: passwordVerify, trigger: 'blur' }
        ],
        surePwd: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      publicKey: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  activated() {
    this.active = 0
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
          this.numberValidateForm.encryptToken = res.data.token
        }
      })
    },
    // 获取短信验证码
    getCode() {
      if (this.numberValidateForm.phone === '') {
        return this.$message.error('手机号不能为空')
      } else if (this.numberValidateForm.phone.length < 11) {
        return this.$message.error('请输入正确的手机号')
      } else {
        // 验证手机号是否注册
        const param = this.numberValidateForm.phone
        this.$backend
          .request(this.$api.password.validatePhone, param)
          .then(res => {
            // 未注册
            if (!res.success) {
              return this.$message.error(res.message)
            } else {
              // 已注册：请求发送短信验证码
              this.sendCodeTimer()
              const param = this.numberValidateForm.phone
              this.$backend
                .request(this.$api.password.getValidateCode, param)
                .then(res => {
                  console.log(res)
                  if (!res.success) {
                    return this.$message.error(res.message)
                  }
                })
            }
          })
      }
    },
    // 发送验证码倒计时
    sendCodeTimer() {
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
    reLogin() {
      this.$router.push({ path: '/login' })
    },
    /** **************************** */
    // 重新登录
    changeMenu(val) {
      if (val === '1') {
        this.$router.push({ path: '/register' })
      } else if (val === '2') {
        this.$router.push({ path: '/login' })
      } else {
        this.$router.push({ path: '/password' })
      }
    },
    submitForm() {
      // window.that = this
      this.$refs['numberValidateForm'].validate(valid => {
        if (valid && this.publicKey) {
          const param = this.$util.ObjectUtils.deepCopy(
            this.numberValidateForm
          )
          switch (this.active - 0) {
            // 验证码
            case 0:
              // 请求校验短信验证码
              this.$backend
                .request(this.$api.password.validateCode, param)
                .then(res => {
                  console.log(res)
                  if (!res.success) {
                    return this.$message.error(res.message)
                  } else {
                    this.active = 1
                  }
                })
              break
            // 设置新密码
            case 1:
              param.telephone = param.phone
              param.newPwd = this.$util.CalcUtils.handleJsencrypt(this.publicKey, param.newPwd)
              param.surePwd = this.$util.CalcUtils.handleJsencrypt(this.publicKey, param.surePwd)
              delete param.phone
              this.$backend
                .request(this.$api.register.forgetPwd, param)
                .then(response => {
                  if (response.success) {
                    this.active = 3
                  } else {
                    this.active = 0
                    this.numberValidateForm = {}
                    return this.$message.error(response.message)
                  }
                })
              break
            // 成功
            case 3:
            default:
              break
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.codeInput {
  position: relative;
}
.code-btn {
  width: 100px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: -83px;
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
.app-wrapper {
  @include clearfix;
  height: 100%;
  width: 100%;
  background: #F5F5F5;
    .head {
      width: 100%;
      z-index: 9;
      display: flex;
      align-items: center;
      flex-direction: row;
      padding: 12px 30px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.07);
      .projectTitle{
          margin: 0px 10px;
          color: #003C7A;
          .bigTitle{
              font-weight: bold;
              font-size: 24px;
          }
          .smallTile{
              font-family: 16px;
          }
      }
        .el-tag{
          border-radius: 15px;
          background: none;
          color: #4C76A2;
          font-weight: 500;
          margin-left: 10px;
          font-size: 16px;
          letter-spacing: 2px;
          border-color: #4C76A2
        }
      .user-center {
        color: white;
        display: flex;
        align-items: center;
        font-size: 16px;
        img{
          width: 12px;
        }
      }
    }
    .main{
      padding: 20px 20px 0px 0;
      height: calc(100% - 84px);
    }
}
.app-main {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333333;
  display: flex;
  .side-bar {
    width: 15%;
    margin-right: 20px;
    min-width: 200px;
  }
  .content{
    flex: 1;
    overflow: auto;
    box-shadow: 0 0 10px rgba(0,0,0,0.07);
    background: #fff;
    .bread-list{
      background: #fff;
      margin-bottom: 24px;
      padding: 13px 10px;
    }
  }
  .content-padding-box{
    padding: 0;
    padding-bottom: 30px;
  }
  .content-padding{
    padding: 0;
  }
}
.scrollbar {
  height: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.07);
}
.scrollbar-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  color: #333333;
  background: #fff;
  display: flex;
  .scrollbar-wrapper-title {
    height: 42px;
    line-height: 42px;
    font-size: 16px;
    padding: 0 20px;
    color: #333333;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    font-family: SourceHanSansCN-Regular;
  }
}
.formContent {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
}
>>> .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  position: inherit;
}
.rightTop {
  border-bottom: 1px solid #e5e5e5;
  padding: 10px;
  margin-bottom: 20px;
  display: inline-block;
  width: 100%;
}
.stepsContent {
  width: 80%;
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  padding-top: 30px;
}
.bottomContent {
  background: #fff;
  box-shadow: 0 -4px 8px -1px #e2e2e2;
  height: 60px;
  position: fixed;
  bottom: 0;
  width: calc(85% - 40px);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 50px;
}
>>> .el-form-item .el-input--medium .el-input__inner {
  width: 100%;
}
>>> .el-form-item__error {
  position: unset;
  margin-top: 0px;
}
>>> .el-form-item__label {
  font-weight: normal;
}
>>> .el-step__main {
  float: left;
  margin-left: 34px;
  margin-top: -30px;
}
>>> .el-step.is-horizontal .el-step__line {
  left: 136px;
  right: 8px;
}
>>> .el-step__head.is-success {
  color: #0f58ff;
  border-color: #0f58ff;
}
>>> .el-step__title.is-success {
  color: #333;
}
>>> .el-step__head.is-process {
  color: #0f58ff;
  border-color: #0f58ff;
}
>>> .el-step__title .is-process {
  color: #333;
  >>> .el-step__icon {
    background: #0f58ff !important;
  }
  >>> .is-text {
    color: #fff;
  }
}
</style>
