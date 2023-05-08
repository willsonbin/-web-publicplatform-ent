<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm" class="tabForm">
        <el-form-item label="激活日期：">
          <el-date-picker
            v-model="searchForm.updateDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="changePick"
          />
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model="searchForm.productName" placeholder="请输入" clearable style="width:200px" class="gap" />
        </el-form-item>
        <el-form-item label="产品批次：">
          <el-input v-model="searchForm.batchNo" placeholder="请输入" clearable style="width:200px" class="gap" />
        </el-form-item>
        <el-form-item label="追溯码值：">
          <el-input v-model="searchForm.code" placeholder="请输入" clearable style="width:200px" class="gap" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
          <el-button v-if="hasPermission('MENU_BATCH_ACTIVE_BUTTON_BATCH_ACTIVE')" type="primary" icon="el-icon-circle-plus-outline" @click="batchVoid">批量激活</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-if="hasPermission('MENU_BATCH_ACTIVE_BUTTON_LIST')"
      ref="multipleTable"
      :header-cell-style="{background:'#f7f8fa'}"
      :data="tableData"
      tooltip-effect="dark"
      class="fix-pagination-table"
      style="width: 100%; margin-top:20px"
      stripe
    >
      <el-table-column
        label="激活时间"
        width="160"
        prop="invalidDate"
        show-overflow-tooltip
      />
      <el-table-column
        label="激活类型"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.invalidType===0">激活码段</span>
          <span v-if="scope.row.invalidType===1">激活码值</span>
          <span v-if="scope.row.invalidType===2">激活批次</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="batchName"
        label="生产批次号"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="startSegment"
        label="码段起始值"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="endSegment"
        label="码段终止值"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="operator"
        label="操作人"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="progress"
        label="状态"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.progress===0">处理中</span>
          <span v-if="scope.row.progress===1">处理成功</span>
          <span v-if="scope.row.progress===2">处理失败</span>
        </template>

      </el-table-column>
      <el-table-column
        prop="remarks"
        label="理由"
        show-overflow-tooltip
      />
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
    <el-dialog
      title="激活"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <ActiveModal ref="formMadalRef" @refreshList="getLabelStatusPage" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ActiveModal from './activeModal.vue'
export default {
  name: 'Plateform',
  components: { ActiveModal },
  data() {
    return {
      searchForm: {
        startDate: '',
        endDate: '',
        updateDate: '',
        productName: '',
        code: '',
        batchNo: '',
        current: 1,
        rows: 15,
        total: 0,
        order: 'updateDate',
        asc: false,
        type: 2 // 查询类型（1-作废，2-激活）
      },
      tableData: [],
      selectedIds: [],
      dialogVisible: false
    }
  },
  methods: {
    // 条件查询
    searchList() {
      this.searchForm.current = 1
      this.getLabelStatusPage()
    },
    // 批量作废
    batchVoid() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formMadalRef.clear()
      })
    },
    // 取消弹窗
    handleCancel() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$refs.formMadalRef.clear()
      })
    },
    // 确认弹窗
    handleSubmitForm() {
      this.$nextTick(() => {
        this.$refs.formMadalRef.handleSubmit()
      })
    },
    // 获取列表数据
    getLabelStatusPage() {
      this.dialogVisible = false
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.basicSetting.getLabelStatusPage, param).then((response) => {
        if (response.success) {
          this.tableData = response.data.records || []
          this.searchForm.total = response.data.total
        }
      })
    },
    // 时间选择
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getLabelStatusPage()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getLabelStatusPage()
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
>>> .el-table--enable-row-transition .el-table__body td.el-table__cell{
  text-align: center;
}
</style>
