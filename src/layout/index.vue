<template>
  <div id="app-wrapper" class="app-wrapper">
    <div class="head">
      <section class="leftHeader">
        <img src="../assets/images/logo.png">
        <section class="projectTitle">
          <p class="bigTitle">中国检验检疫科学研究院粤港澳大湾区研究院</p>
          <p class="smallTile"> Chinese Academy of Inspection and Quarantine Greater Bay Area</p>
        </section>
        <el-tag>企业端</el-tag>
      </section>
      <section class="rightContent">
        <section class="entContent">
          <span>欢迎 {{ userInfo.orgNameCn }}</span>
          <el-button v-if="userInfo.isAdmin === 0 && !userInfo.orgInfoFlag" type="text" style="color: #333" @click="jumpEnterpriseInfo">[完善资料]</el-button>
        </section>
        <section class="personContent">
          <el-dropdown placement="bottom-end">
            <span class="el-dropdown-link" style="color: #333;cursor: pointer;display:flex;align-items:center">
              <span style="margin-right:6px;">
                <i class="el-icon-user-solid" style="color: #729DF5; font-size:20px" />
              </span>
              <span>{{ userInfo.userName }}<span style="margin-left:5px">您好</span><span style="margin:0 10px;">|</span> 个人中心</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><p @click="jumpPersonalCnter">基本信息</p></el-dropdown-item>
              <el-dropdown-item divided><p @click="updatePwd">修改密码</p></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <section>
            <el-button type="text" style="color: #333; margin-left:3px" @click="logout"><span style="margin:0 10px;">|</span>退出登录</el-button>
          </section>
        </section>
      </section>
    </div>
    <div class="main">
      <AppMain />
    </div>
    <el-dialog title="修改密码" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
      <PwdModalForm v-if="formVisible" ref="modalForm" @handleSubmit="handleSubmitForm" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'
import PwdModalForm from './components/PwdModalForm'
export default {
  name: 'Layout',
  components: {
    AppMain, PwdModalForm
  },
  mixins: [ResizeMixin],
  data() {
    return {
      formVisible: false,
      submitLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    // 跳转到个人中心
    jumpPersonalCnter() {
      this.$router.push({ path: '/personalCenter', query: { id: this.userInfo.userId }})
    },
    // 跳转到企业备案信息
    jumpEnterpriseInfo() {
      this.$router.push({ path: '/enterprise/record/info' })
    },
    // 修改密码
    updatePwd() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs['modalForm'].basicForm.userName = this.userInfo.userName
      })
    },
    // 提交成功
    handleSubmitForm() {
      this.formVisible = false
    },
    handleSubmit() {
      this.$refs.modalForm.submit()
    },
    close() {
      const that = this
      that.$nextTick(() => {
        that.$refs['modalForm'] && that.$refs['modalForm'].close()
        that.formVisible = false
      })
    },
    async logout() {
      this.$confirm('您确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('user/logout').then(() => {
            this.$router.push(`/login`)
            this.$store.dispatch('bread/setBreadList', []).then(() => {})
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
    .head {
      flex-shrink: 0;
      width: 100%;
      // height: 10%;
      z-index: 9;
      display: flex;
      align-items: center;
      flex-direction: row;
      padding: 12px 30px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.07);
      justify-content: space-between;
      .leftHeader{
        display: flex;
        align-items: center;
      }
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
      flex: 1;
      overflow: hidden;
    }
  .rightContent{

    .entContent{
        display: flex;
        font-size: 14px;
        color: #333;
        align-items: center;
        >span{
          flex: 1;
          text-align: right;
        }
      }
    .personContent{
      display: flex;
      align-items: center;
      margin-top: 6px;
    }
  }
}
</style>
