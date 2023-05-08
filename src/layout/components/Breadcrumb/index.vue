<template>
  <div class="bread-crumb">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumb-left">
      <el-breadcrumb-item v-for="(item,index) in breadList" :key="index" @click.native="handleToTz(item,index)">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb separator-class="el-icon-arrow-left" class="bread-crumb-right">
      <el-breadcrumb-item />
    </el-breadcrumb>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      breadList: state => state.bread.breadList
    })
  },
  methods: {
    handleToTz(item, index) {
      this.$router.push(item.path)
    },
    handleToHome() {
      var index = this.breadList.length - 2
      if (index >= 0) {
        var path = this.breadList[index].path
        this.$router.push(path)
        return
      }
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.el-breadcrumb__inner {
  color: #666;
  cursor: pointer;
}
.bread-crumb-left .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #333;
}
.bread-crumb-right .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #666;
  cursor: pointer;
}
.bread-crumb{
  display: flex;
  justify-content: space-between;
}
</style>
