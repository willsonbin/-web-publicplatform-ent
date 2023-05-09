<template>
  <el-dialog :title="dialogTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="45%" @close="close">
    <el-form ref="basicForm" class="el-form-nowrap el-form-margin-none" :model="basicForm" label-width="100px" label-position="right">
      <el-form-item label="企业名称：" style="width:100%">
        <span>{{ basicForm.enterpriseName }}</span>
      </el-form-item>
      <el-form-item label="产品名称：" style="width:100%">
        <span>{{ basicForm.productName }}</span>
      </el-form-item>
      <el-form-item label="批次总数：" style="width:30%">
        <span>{{ basicForm.batchQuantity }}</span>
      </el-form-item>
      <el-form-item label="总码量：" style="width:30%">
        <span>{{ basicForm.codeQuantity }}</span>
      </el-form-item>
      <el-form-item label="码段：" style="width:30%">
        <span>{{ basicForm.codeSegmentQuantity }}</span>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      stripe
    >
      <el-table-column
        prop="batchNo"
        label="生产批次号"
      />
      <el-table-column
        prop="quantity"
        label="应赋码量"
      />
      <el-table-column
        prop="startSegment"
        label="码段起始值"
        width="150"
      />
      <el-table-column
        prop="endSegment"
        label="码段终止值"
        width="150"
      />
      <el-table-column
        prop="updateDate"
        label="生成时间"
        width="160"
      />
    </el-table>
    <el-pagination
      background
      :current-page="searchForm.current"
      :page-sizes="[15,30,50]"
      :page-size="searchForm.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogTitle: '详情',
      formVisible: false,
      basicForm: {},
      tableData: [],
      searchForm: {
        productName: '',
        current: 1,
        rows: 15,
        total: 0
      }
    }
  },
  methods: {
    getTableData() {
      this.$backend.request(this.$api.basicSetting.getLabelOrderDetailsList, this.searchForm).then((response) => {
        if (response.data && response.data.records && response.data.records.length > 0) {
          this.basicForm = response.data.records[0]
          this.tableData = response.data.records[0].items || []
          this.searchForm.total = response.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getTableData()
    },
    close() {
      this.basicForm = {}
      this.searchForm.current = 1
      this.searchForm.productName = ''
      this.formVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
 ::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    position: unset;
  }
::v-deep .el-form-item .el-input--medium .el-input__inner{
  width: 100%;
}
.el-form-nowrap {
    display: flex;
    flex-wrap: wrap;
}
</style>
