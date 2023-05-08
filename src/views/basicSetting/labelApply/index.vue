<template>
  <div id="riskDict">
    <el-tabs type="card" @tab-click="handleChangeTab">
      <el-tab-pane v-if="hasPermission('MENU_LABEL_APPLY_RECORD')" label="申请记录">
        <ApplyList />
      </el-tab-pane>
      <el-tab-pane v-if="hasPermission('MENU_TRACE_CODE_LIST')" label="追溯码列表">
        <TraceCode />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TraceCode from './traceCode.vue'
import ApplyList from './applyList.vue'
export default {
  name: 'OperationLog',
  components: { TraceCode, ApplyList },
  data() {
    return {
      searchKey: '',
      tabIndex: 0
    }
  },
  activated() {

  },
  methods: {
    // tab切换
    handleChangeTab(item) {
      this.tabIndex = item.index
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
