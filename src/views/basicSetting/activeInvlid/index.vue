<template>
  <div id="riskDict">
    <el-tabs type="card" @tab-click="handleChangeTab">
      <el-tab-pane label="批量作废">
        <Invalid v-if="hasPermission('MENU_BATCH_INVALID')" ref="cancelRef" />
      </el-tab-pane>
      <el-tab-pane label="批量激活">
        <Active v-if="hasPermission('MENU_BATCH_ACTIVE')" ref="activeRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Invalid from './invalid.vue'
import Active from './active.vue'
export default {
  name: 'ActiveInvlid',
  components: { Invalid, Active },
  data() {
    return {
      searchKey: '',
      tabIndex: '0'
    }
  },
  activated() {
    this.$refs.cancelRef.getLabelStatusPage()
  },
  methods: {
    // tab切换
    handleChangeTab(item) {
      this.tabIndex = item.index
      console.log(item.index === '1')
      if (item.index === '1') {
        this.$refs.activeRef.getLabelStatusPage() // 激活
      } else {
        this.$refs.cancelRef.getLabelStatusPage() // 作废
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";

#riskDict {
    background-color: #f4f4f4;
    padding: 0;
    width: 100%;
}
  >>> .el-tabs__header {
  margin: 0px !important;
}
</style>
