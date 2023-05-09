<template>
  <div id="app-wrapper" class="app-wrapper">
    <div class="head">
      <img src="../../assets/images/logo.png">
      <section class="projectTitle">
        <p class="bigTitle">中国检验检疫科学研究院粤港澳大湾区研究院</p>
        <p class="smallTile"> Chinese Academy of Inspection and Quarantine Greater Bay Area</p>
      </section>
      <el-tag>企业端</el-tag>
    </div>
    <div class="main">
      <section class="app-main">
        <div class="side-bar">
          <div class="scrollbar">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <p class="scrollbar-wrapper-title">服务导航</p>
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @select="changeMenu"
              >
                <el-menu-item index="1">
                  <span slot="title">企业登录</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <span slot="title">企业注册</span>
                </el-menu-item>
              </el-menu>
            </el-scrollbar>
          </div>
        </div>
        <div class="content show-content">
          <transition name="fade-transform" mode="out-in">
            <div class="content-padding-box content-padding">
              <div style="padding:0px;background:#fff">
                <span class="rightTop">
                  企业注册
                </span>
                <section class="stepsContent">
                  <el-steps :active="active" finish-status="success">
                    <el-step title="阅读注册协议" />
                    <el-step title="填写企业资料" />
                    <el-step title="提交审核" />
                  </el-steps>
                  <section class="formContent">
                    <Protocal v-show="active ===0" ref="protocalForm" @isChecked="getChecked" />
                    <EnterpriseUpload v-show="active ===1 || active ===2" ref="basicForm" @isCheckedTwo="getTwoChecked" @resultCode="getCode" @error="handleError" />
                    <Result v-show="active ===3" ref="resultForm" />
                  </section>
                </section>
              </div>
              <section v-if="active!==3" class="bottomContent">
                <el-button type="primary" style="margin-left: 80%;" :disabled="isNextStep" :loading="loading" @click="submitForm()">{{ active === 0 ? `${content}`: '确认提交' }}</el-button>
              </section>
            </div>
          </transition>

        </div>

      </section>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Protocal from './protocal.vue'
import EnterpriseUpload from './enterpriseUpload.vue'
import Result from './result.vue'
export default {
  name: 'Password',
  components: { Protocal, EnterpriseUpload, Result },
  data() {
    return {
      active: 0,
      isNextStep: true,
      numberValidateForm: {
        age: ''
      },
      formVisible: false,
      submitLoading: false,
      isAddNext: true,
      loading: false,
      content: '下一步', // 按钮里显示的内容
      totalTime: 10 // 记录具体倒计时时间
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.getProtocalInfo()
    this.countDown()
  },
  methods: {
    handleError() {
      this.loading = false
    },
    countDown() {
      const clock = window.setInterval(() => {
        this.totalTime--
        this.content = this.totalTime + '秒'
        if (this.totalTime < 0) {
          window.clearInterval(clock)
          this.content = '下一步'
          this.totalTime = 3
          this.$refs.protocalForm.isDisabled = false
        }
      }, 1000)
    },
    // 获取业务编码
    getCode(val) {
      this.loading = false
      this.$refs.resultForm.codeNumber = val
    },
    getProtocalInfo() {
      this.$nextTick(() => {
        this.$refs.protocalForm.getSysConfig()
      })
    },
    // 重新登录
    changeMenu(val) {
      if (val === '1') {
        this.$router.push({ path: '/login' })
      } else {
        this.$router.push({ path: '/register' })
      }
    },
    // 获取子组件选中的状态
    getChecked(val) {
      if (val) {
        this.isNextStep = false
      } else {
        this.isNextStep = true
      }
    },
    // 第二步状态
    getTwoChecked(val) {
      if (val) {
        this.isAddNext = true
        this.active = 3
      } else {
        this.isAddNext = false
        return
      }
    },
    // 提交审核
    submitForm() {
      if (this.isAddNext) {
        this.active++
      }
      if (this.active === 1) {
        // this.$refs.basicForm.getAreaInfo()
      } else if (this.active === 2) {
        this.loading = true
        this.$refs.basicForm.submitForm()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

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
      height: 100%;
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
  box-shadow: 0 0 10px rgba(0,0,0,0.07);
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
  .scrollbar-wrapper-title{
    font-size: 16px;
    padding: 12px 20px;
    color: #333;
    background: #fff;
    border-bottom: 1px solid #E2E2E2;
    font-family: SourceHanSansCN-Regular;
  }
}
.formContent{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
}
::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    position: inherit;
}
.rightTop{
  border-bottom: 1px solid #E5E5E5 ;
  padding: 12px 10px;
  margin-bottom: 20px;
  display: inline-block;
  width: 100%;
}
.stepsContent{
    width: 80%;
    display: flex;
    align-content: center;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    padding-top: 30px;
}
.bottomContent{
    background: #fff;
    box-shadow: 0 -4px 8px -1px #E2E2E2;
    width: 100%;
    height: 60px;
    line-height: 60px;
}
::v-deep .el-step__main{
    float: left;
    margin-left: 34px;
    margin-top: -30px;
}
::v-deep .el-step.is-horizontal .el-step__line{
  width: calc(100% - 130px);
  left: 130px;
  // right: 8px;
}
// ::v-deep .el-step.is-horizontal:first-child{
//   left: 110px;
// }
::v-deep .el-step__head.is-success{
  color: #0F58FF;
  border-color: #0F58FF
}
::v-deep .el-step__title.is-success{
  color: #333;
}
::v-deep .el-step__head.is-process{
  color: #0F58FF;
  border-color: #0F58FF
}
::v-deep .el-step__title .is-process{
 color: #333;
 ::v-deep .el-step__icon{
   background: #0F58FF !important;
 }
 ::v-deep .is-text{
   color: #fff;
 }
 ::v-deep .el-step.is-horizontal .el-step__line:first-of-type{
   width: 56%;
 }
}
</style>
