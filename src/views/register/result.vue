<template>
  <div style="height: calc(100vh - 292px);">
    <el-result icon="success" title="提交成功">
      <template slot="extra" class="wrapper">
        <p style="margin-bottom: 30px; color:#999999">业务编码：{{ codeNumber }}</p>
        <span class="resultTips">
          您的资料已提交审核，我们将会在1个工作日内完成审核
        </span>
        <div style="margin-top:40px">
          <el-button type="primary" size="medium" style="width:130px" @click="goLogin">返回登录界面</el-button>
          <!-- <el-button type="primary" plain size="medium" style="width:130px" @click="close">关闭界面</el-button> -->
        </div>
      </template>
    </el-result>
  </div>
</template>
<script>
export default {
  data() {
    return {
      codeNumber: '123546'
    }
  },
  methods: {
    goLogin() {
      this.$router.push({ path: '/login' })
    }
    // close() {
    //   console.log('register')
    //   this.$router.push({
    //     path: '/register'
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  display: flex;
  flex-direction: column;
}
.resultTips{
  flex: 1;
  background: #FAFAFA;
  padding: 20px;
  font-size: 16px;
  margin: 20px 0px;
}
</style>
