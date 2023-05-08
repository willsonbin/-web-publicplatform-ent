<template>
  <div class="login-container">
    <img style="position: absolute; top: 48px;left: 48px;width: 97px;" src="../../assets/images/big-logo.png">
    <div class="content-left">
      <el-carousel style="width: 500px;height:500px" arrow="never" trigger="click">
        <el-carousel-item v-for="(item, index) in swipperList" :key="index" style="width: 500px;height:500px">
          <img style="width: 500px;height: 340px" src="../../assets/images/login-swipper.png">
          <h1>{{ item.title }}</h1>
          <p>{{ item.content }}</p>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="content-right">
      <div class="login-container-form">
        <h3>正在登录 公共技术服务平台</h3>
        <h4><span>企业登录</span><span class="template">（试运行）</span></h4>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <el-form-item prop="loginName">
            <el-input
              ref="loginName"
              v-model="loginForm.loginName"
              placeholder="账号"
              name="loginName"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="
                  passwordType === 'password' ? 'eye' : 'eye-open'
                "
              />
            </span>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <section class="verifyContent">
              <el-input
                v-model="loginForm.verifyCode"
                placeholder="验证码"
                tabindex="3"
                autocomplete="on"
                @blur="handleVerifyCode"
              />
              <span @click="refreshCode">
                <Identify :identify-code="identifyCode" />
              </span>
            </section>
          </el-form-item>
          <el-form-item style="margin-top:5px">
            <el-button
              :loading="loading"
              type="primary"
              style="background:#1388EF"
              @click="handleLogin"
            >登 录</el-button>
          </el-form-item>
          <section class="linkContent">
            <div><span>企业没有账号？</span><span style="cursor:pointer" @click="goRegister">去注册</span></div>
            <div><span style="color: #333333; font-size:14px;cursor:pointer;text-decoration:underline;" @click="goPassword">忘记密码？</span></div>
          </section>
        </el-form>
        <section class="loginBottom">
          <p>Copyright <span style="font-size:14px">©</span> 2022  All Rights Reserved 中国检科院粤港澳大湾区研究院 </p>
          <!-- <span>承建：深圳前海量子云码科技有限公司</span>
          <span>如有问题，咨询电话：{{ telephone }} </span> -->
          <span class="jumpLink" @click="jumpThird"> 粤ICP备2022043477号-2</span>
          <!-- <p>如有问题，请前往 <el-button type="text" style="color:#0000FF">用户帮助</el-button> 咨询电话：{{ telephone }}</p> -->
        </section>
      </div>
    </div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { getToken } from '@/utils/auth'
import Identify from './components/sIdentity.vue'
export default {
  name: 'Login',
  components: { Identify },
  data() {
    // const validateloginName = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('请输入用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateVerifycode = (rule, value, callback) => {
      if (value !== this.identifyCode) {
        callback(new Error('验证码不正确,请重新输入'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      currentLanguage: 'CHNS',
      currentName: '简体中文',
      languageList: [
        {
          id: 0,
          value: 'CHNS',
          name: '简体中文'
        },
        {
          id: 1,
          value: 'CHNT',
          name: '繁体中文'
        },
        {
          id: 2,
          value: 'ENG',
          name: 'english'
        }
      ],
      loginForm: {
        loginName: '',
        password: '',
        verifyCode: '',
        encryptToken: ''
      },
      loginRules: {
        loginName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入账号'
          }
        ],
        password: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validatePassword
          }
        ],
        verifyCode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入验证码'
          },
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validateVerifycode
          }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      swipperList: [
        { url: '../../assets/images/login-swipper.png', title: '检验检测  标准认证', content: '助力粤港澳大湾区公共技术服务，提供便捷、有效发展环境' },
        { url: '../../assets/images/login-swipper.png', title: '食品安全  生物医药', content: '助力粤港澳大湾区公共技术服务，提供便捷、有效发展环境' },
        { url: '../../assets/images/login-swipper.png', title: '开放包容  助力发展', content: '助力粤港澳大湾区公共技术服务，提供便捷、有效发展环境' }
      ],
      telephone: '',
      identifyCodes: '123456789',
      identifyCode: '',
      publicKey: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    currentLanguage: function(newVal, oldVal) {
      var i = this.languageList.findIndex(ele => {
        return ele.value === newVal
      })
      if (i > -1) {
        this.currentName = this.languageList[i].name
      }
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.loginName === '') {
      this.$refs.loginName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getSysConfig()
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
    this.getPublicKey()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 获取公钥
    getPublicKey() {
      this.$backend.request(this.$api.common.getPublicKey).then((res) => {
        if (res.success) {
          this.publicKey = res.data.key
          this.loginForm.encryptToken = res.data.token
        }
      })
    },
    handleVerifyCode() {
      if (this.identifyCode !== this.loginForm.verifyCode) {
        this.loginForm.verifyCode = ''
        this.refreshCode()
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },
    jumpThird() {
      window.open('http://beian.miit.gov.cn/', '_blank')
    },
    // 获取系统配置
    getSysConfig() {
      this.$backend.request(this.$api.login.getSysConfig).then((response) => {
        if (response.success) {
          this.telephone = response.data.telephone
        }
      })
    },
    switchLanguage() {
      this.$switchLanguage(this.currentLanguage)
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && this.publicKey) {
          this.loading = true
          const params = this.$util.ObjectUtils.deepCopy(this.loginForm)
          // 对密码进行加密
          params.password = this.$util.CalcUtils.handleJsencrypt(this.publicKey, params.password)
          this.$store
            .dispatch('user/login', params)
            .then(() => {
              this.loading = false
              const hasToken = getToken()
              if (!hasToken) {
                this.refreshCode()
                this.loginForm.verifyCode = ''
                return
              }
              // 获取原产国/地区树
              // this.$store.dispatch('common/getCountryAreaTree')
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 用户注册页面
    goRegister() {
      this.$router.push({
        path: '/register'
      })
    },
    // 找回密码
    goPassword() {
      console.log('sdfdsf')
      this.$router.push({
        path: '/password'
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 750px;
  height: 100%;
  width: 100%;
  background: url("../../assets/images/login-bj.png") no-repeat 0 0;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  overflow-x: auto;
  >div{
    margin: 0 3%;
  }
  .content-left {
    >>> .el-carousel__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    >>> .el-carousel__indicators{
      >li .el-carousel__button {
        width: 10px;
        height: 10px;
        border-radius: 10px;
      }
      .is-active .el-carousel__button {
        background: #1388EF;
      }
    }
    h1 {
      color: #064396;
      font-size: 34px;
      text-align: center;
      margin: 25px 0 17px 0;
    }
    p{
      color: #555555;
    }
  }
  .content-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    // position: absolute;
    // top: 28%;
    // left: 58%;
    .login-container-form{
      padding: 0 40px 30px;
      width: 530px;
      height: 520px;
      background: #fff;
      border: 1px solid #90D0EC;
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
      h3 {
        color: #064396;
        font-size: 30px;
        margin: 50px 0 20px 20px;
        font-weight: normal;
      }
      h4 {
        font-size: 18px;
        color: #1388F1;
        margin: 0;
        margin-left: 20px;
        background: #fff;
        display: flex;
        .template {
          font-weight: normal;
          color: #333;
          font-size: 16px;
          margin-left: 8px;
        }
      }
    }
    .login-form {
      position: relative;
      width: 400px;
      margin: 0 auto;
      color: #333;
      background: #fff;
      padding: 30px 0px 30px 0px;
      .el-button{
        width: 100%;
        height: 44px;
        font-size: 16px;
      }
      >>> .el-form-item__error {
        right: 35px;
      }
    }
    >>> .el-form-item .el-input--medium .el-input__inner{
      width: 100%;
      height: 44px;
      border-radius: none;
      border: 1px solid #1388EF;
    }
    >>>.el-button--primary {
      border: 1px solid #1388EF;
      border-color: #1388EF;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .linkContent{
    color: #7F7F7F;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    margin: -10px 0 0 0;
    >>> .el-button{
      width: 50px !important;
      padding:0px !important
    }
  }
  .loginBottom{
    border-top: 1px solid #DCDCDC;
    padding-top: 5px;
    color: #B4B4B4;
    font-size: 12px;
    text-align: center;
    line-height: 24px;
    p{
      font-size: 14px;
      color: #B4B4B4;
      text-align: center;
      line-height: 24px;
    }
   >>> .el-button{
     padding:0px
   }
   .jumpLink{
      color: #1388f1;
      text-decoration: underline;
      cursor: pointer;
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .verifyContent{
    display: flex;
  }
}
</style>
