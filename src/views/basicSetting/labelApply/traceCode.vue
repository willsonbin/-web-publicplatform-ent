<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm" class="tabForm">
        <el-form-item label="产品名称：">
          <el-input v-model="searchForm.productName" placeholder="请输入" clearable class="gap" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="gap" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnContent" style="margin: 20px 0;">
      <el-button v-if="hasPermission('MENU_TRACE_CODE_LIST_BUTTON_APPLY')" type="primary" icon="el-icon-edit-outline" @click="handleOptions(1)">申请标签</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :header-cell-style="{background:'#f7f8fa'}"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      class="fix-pagination-table"
      stripe
    >
      <el-table-column
        prop="productName"
        label="赋码产品"
        show-overflow-tooltip
      />
      <el-table-column
        prop="batchQuantity"
        label="批次数"
      />
      <el-table-column
        prop="quantity"
        label="总数量"
      />
      <el-table-column
        prop="codeSegmentQuantity"
        label="码段数"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button v-if="hasPermission('MENU_TRACE_CODE_LIST_BUTTON_DETAILS')" type="text" @click="handleOptions(2, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      class="fix-pagination"
      :current-page="searchForm.current"
      :page-sizes="[15,30,50]"
      :page-size="searchForm.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 【申请标签】 -->
    <el-dialog :title="dialogTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" @close="close">
      <ModalForm v-if="formVisible" ref="modalForm" :basic-set="true" @refreshList="getTableData" />
      <div v-if="showBtn" slot="footer" class="dialog-footer">
        <el-button class="el-button-confirm-two" @click="close">取 消</el-button>
        <el-button type="primary" :loading="loading" class="el-button-confirm-two" @click="handleSubmit">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 【详情】 -->
    <TraceCodeModal ref="traceCodeModal" />
  </div>
</template>
<script>
import ModalForm from '../../TraceabilityInfo/batchInfo/labelModal.vue'
import TraceCodeModal from './modal/traceCodeModal.vue'
export default {
  name: 'Plateform',
  components: { ModalForm, TraceCodeModal },
  data() {
    return {
      searchForm: {
        productName: '',
        current: 1,
        rows: 15,
        total: 0
      },
      tableData: [],
      dialogTitle: '',
      showBtn: true,
      formVisible: false,
      loading: false
    }
  },
  activated() {
    this.getTableData()
  },
  methods: {
    handleOptions(type, row) {
      switch (type) { // 申请标签
        case 1:
          this.dialogTitle = '申请标签'
          this.formVisible = true
          this.showBtn = true
          this.$nextTick(() => {
            this.$refs['modalForm'].formType = 1
          })
          break
        case 2: // 详情
          this.$nextTick(() => {
            this.$refs['traceCodeModal'].formVisible = true
            this.$refs['traceCodeModal'].searchForm.productName = row.productName || ''
            this.$refs['traceCodeModal'].getTableData()
          })
          break
      }
    },
    getTableData() {
      this.formVisible = false
      this.$backend.request(this.$api.basicSetting.getLabelOrderList, this.searchForm).then((response) => {
        this.tableData = response.data.records || []
        this.searchForm.total = response.data.total
      })
    },
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getTableData()
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
      this.$refs['modalForm'] && this.$refs['modalForm'].close()
      this.formVisible = false
    },
    handleSubmit() {
      this.$nextTick(() => {
        this.$refs.modalForm.handleSubmitLabel()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.addPaddingDown{
  padding-bottom: 20px;
  border-top: none;
}
.gap {
      margin-right: 12px;
    }
.tabForm {
    border: 1px solid #dfe4ed;
    border-top: none;
    padding: 20px 0px 0px 20px;
}
</style>
