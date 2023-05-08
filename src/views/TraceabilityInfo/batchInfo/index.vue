<template>
  <div>
    <!-- class="flex-space-between-form" label-width="84px"-->
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="更新日期：">
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
        <el-form-item label="产品分类：">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="全部" value="" />
            <el-option label="原料" :value="0" />
            <el-option label="产品" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-select v-model="searchForm.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="产品编码：">
          <el-select v-model="searchForm.code" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px">
      <el-button v-if="hasPermission('MENU_BATCH_INFORMATION_BUTTON_ADD')" type="primary" icon="el-icon-plus" @click="addBatchInfo">创建批次</el-button>
      <el-button v-if="hasPermission('MENU_BATCH_INFORMATION_BUTTON_BATCH_IMPORT')" type="primary" icon="el-icon-download" @click="importFile">批量导入</el-button>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_BATCH_INFORMATION_BUTTON_APPLY')" type="primary" plain @click="addLabel">申请标签</el-button>
    </div>
    <div class="table-content">
      <el-table style="width: 100%;" class="fix-pagination-table" :data="tableData" stripe :header-cell-style="{background:'#f7f8fa'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="生产批次号" prop="batchNo" min-width="190" show-overflow-tooltip />
        <el-table-column label="生产日期" prop="productDate" width="160" show-overflow-tooltip />
        <el-table-column label="产品名称" prop="productName" width="120" show-overflow-tooltip />
        <el-table-column label="产品编码" prop="productCode" width="180" show-overflow-tooltip />
        <el-table-column label="标签量" prop="quantity" />
        <el-table-column label="小标" prop="smallQuantity" width="120" show-overflow-tooltip />
        <el-table-column label="大标" prop="bigQuantity" width="120" show-overflow-tooltip />
        <el-table-column label="填报账号" prop="createUser" width="150" />
        <el-table-column label="创建时间" prop="createDate" width="180" />
        <el-table-column label="状态" width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">正常</span>
            <span v-else>作废</span>
            <!-- <span v-if="scope.row.status === 0">待提交</span>
            <span v-if="scope.row.status === 1">待审核</span>
            <span v-if="scope.row.status === 2">审核不通过</span>
            <span v-if="scope.row.status === 3">审核通过</span>
            <span v-if="scope.row.status === 4">已下线</span> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_BATCH_INFORMATION_BUTTON_EDIT')" type="text" @click="editBatchInfo(scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('MENU_BATCH_INFORMATION_BUTTON_LABEL')" type="text" @click="handleLabelData(scope.row)">标签数据</el-button>
            <el-button v-if="hasPermission('MENU_BATCH_INFORMATION_BUTTON_LIST')" type="text" @click="deleteBatchInfo(scope.row)">删除</el-button>
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
    </div>
    <el-dialog
      :title="dialogTittle"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="handleCancelForm"
    >
      <FormModal ref="formModal" @refreshList="getBatchPage" @error="handleError" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelForm">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleEditOrCreate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="标签申请"
      :visible.sync="labelVisible"
      width="45%"
      :close-on-click-modal="false"
      @close="handleCancelLabel"
    >
      <LabelModal ref="labelModal" :labels="selectedBatch" @refreshList="getBatchPage" @error="handleError" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelLabel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleLabelCreate">确 定</el-button>
      </span>
    </el-dialog>
    <LabelBatchExcel ref="excelImport" :importapi="batchImportUrl" @ok="getBatchPage" />
    <LabelDataVisiable ref="labelDataRef" :importapi="labelDataUrl" />
  </div>
</template>

<script>
import LabelBatchExcel from './labelBatchExcel.vue'
import LabelDataVisiable from './labelDataVisiable.vue'
import FormModal from './formModal.vue'
import LabelModal from './labelModal.vue'
export default {
  components: { LabelBatchExcel, FormModal, LabelModal, LabelDataVisiable },
  data() {
    return {
      labelVisible: false,
      dialogTittle: '创建批次',
      dialogVisible: false,
      options: [],
      batchImportUrl: '', // 批量导入
      labelDataUrl: this.$api.traceabilityInfo.importLabelUrl, // 标签数据导入
      searchForm: {
        current: 1,
        rows: 15,
        total: 0,
        type: '',
        updateDate: '',
        name: '',
        code: '',
        endDate: '',
        startDate: '',
        order: 'updateDate',
        asc: false
      },
      tableData: [],
      treeData: [],
      selectedIds: [],
      selectedBatch: [],
      loading: false
    }
  },
  activated() {
    this.getBatchPage()
  },
  methods: {
    handleError() {
      this.loading = false
    },
    // 标签数据
    handleLabelData(row) {
      this.$refs.labelDataRef.labelDataVisiable = true
      this.$nextTick(() => {
        this.$refs.labelDataRef.clear()
        this.$refs.labelDataRef.getLabelDetail(row)
        this.$refs.labelDataRef.isFormVisible = false
      })
    },
    handleCancelForm() {
      this.dialogVisible = false
      this.$refs.formModal.clear()
    },
    handleCancelLabel() {
      this.labelVisible = false
      this.$refs.labelModal.close()
    },
    addLabel() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要申请标签的批次',
          type: 'warning'
        })
        return
      } else {
        this.labelVisible = true
        const arr = []
        this.selectedIds.forEach((item) => {
          this.tableData.forEach((obj) => {
            if (obj.id === item) {
              arr.push(obj)
            }
          })
        })
        this.selectedBatch = arr
        this.$nextTick(() => {
          // this.$refs.labelModal.getAreaInfo()
          this.$refs.labelModal.labels = this.selectedBatch
          this.$refs.labelModal.getAddressList()
        })
      }
    },
    // 标签申请
    handleLabelCreate() {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.labelModal.handleSubmitLabel()
      })
    },
    // 创建或编辑
    handleEditOrCreate() {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.formModal.handleSubmit()
      })
    },
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
    },
    handleSelectionChange(val) {
      const arr = []
      val.forEach((item) => {
        arr.push(item.id)
      })
      this.selectedIds = arr
    },
    // 新增批次
    addBatchInfo() {
      this.dialogVisible = true
      this.dialogTittle = '创建批次'
      this.$nextTick(() => {
        this.$refs.formModal.clear()
        this.$refs.formModal.formType = '1'
        this.$refs.formModal.getMaterailFuzzy()
      })
    },
    // 编辑批次
    editBatchInfo(row) {
      this.dialogVisible = true
      this.dialogTittle = '编辑批次'
      this.$nextTick(() => {
        this.$refs.formModal.getMaterialPage()
        this.$refs.formModal.formType = '2'
        setTimeout(() => {
          this.$refs.formModal.getBatchDetail(row)
        }, 500)
      })
    },
    // 删除批次
    deleteBatchInfo(item) {
      const STR = `${item.productName}(${item.batchNo})`
      this.messageTips('确认是否删除', '删除', STR, '数据不可恢复', 1).then(() => {
        this.$backend.request(this.$api.traceabilityInfo.deleteBatchInfo, { id: item.id }).then((response) => {
          if (response.success) {
            this.getBatchPage()
          }
          this.$util.TipsUtils.message(response)
        })
      })
    },
    importFile() {
      this.$refs.excelImport.showExcelDialog = true
    },
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getBatchPage()
    },
    messageTips(tipsTile, oprationType, dataName, lastTips, curType) {
      const h = this.$createElement
      let message = ''
      message = h('p', { style: 'font-size: 14px' }, [
        h('h4', { style: 'margin:  10px 0;font-size: 18px' }, tipsTile),
        h('span', null, `正在准备${oprationType}选择的" `),
        h('span', { style: 'color: #3369FF' }, dataName),
        h('span', null, ` "数据，确认[提交]后，${lastTips}`,)
      ])
      return this.$confirm(message, oprationType, {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: curType === 1 ? 'error' : 'warning'
      })
    },
    // 获取批次列表
    getBatchPage() {
      this.dialogVisible = false
      this.labelVisible = false
      this.loading = false
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      if (this.$util.StringUtils.isArray(param.categoryId)) {
        param.categoryId = param.categoryId.pop()
      }
      this.$backend.request(this.$api.traceabilityInfo.getBatchPage, param).then((response) => {
        if (response.success) {
          this.tableData = response.data.records || []
          this.searchForm.total = response.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getBatchPage()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getBatchPage()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
