<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="联系人：">
          <el-input v-model="searchForm.contact" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="btnContent" style="margin: 0px 0px 20px 0px;">
      <el-button v-if="hasPermission('MENU_SHIPPING_ADDRESS_BUTTON_ADD')" type="primary" icon="el-icon-plus" @click="handleOptions(1)">新增地址</el-button>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_SHIPPING_ADDRESS_BUTTON_BATCH_DELETE')" type="primary" plain @click="handleBatchDelete">批量删除</el-button>
    </div>
    <div class="table-content">
      <el-table ref="multipleTable" style="width: 100%;" class="fix-pagination-table" :data="tableData" stripe :header-cell-style="{background:'#f7f8fa'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="联系人" prop="contact" min-width="100" show-overflow-tooltip />
        <el-table-column label="联系电话" prop="contactPhone" width="120" />
        <el-table-column label="详细地址" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="150" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_SHIPPING_ADDRESS_BUTTON_EDIT')" type="text" @click="handleOptions(2, scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('MENU_SHIPPING_ADDRESS_BUTTON_DELETE')" type="text" @click="handleOptions(3, scope.row)">删除</el-button>
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
    <!-- 【新增地址】 -->
    <ModalForm ref="modalForm" @handleSubmit="getTableData" />

  </div>
</template>

<script>
import ModalForm from './modalForm.vue'
export default {
  name: 'ReceiveManage',
  components: { ModalForm },
  data() {
    return {
      searchForm: {
        contact: '',
        current: 1,
        rows: 15,
        total: 0
      },
      tableData: [],
      multipleSelection: []
    }
  },
  activated() {
    this.getTableData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除
    handleBatchDelete() {
      if (!this.multipleSelection || this.multipleSelection.length === 0) {
        this.$util.TipsUtils.message({ message: '您还没有选择任何记录', success: false, type: 'warning' })
        return
      }
      const ids = this.multipleSelection.map(item => item.id)
      const h = this.$createElement
      const message = h('p', { style: 'font-size: 14px' }, [
        h('h4', { style: 'margin:  10px 0;font-size: 18px' }, '确认是否删除？'),
        h('span', null, `正在准备提交“`),
        h('span', { style: 'color: #3369FF' }, `${this.multipleSelection.length}`),
        h('span', null, '”条数据！如果确认【提交】后，数据不可恢复。')
      ])
      this.$confirm(message, '批量删除', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$backend.request(this.$api.basicSetting.deleteBatchShippingAddress, ids).then(res => {
          if (res.success) {
            this.multipleSelection = []
            this.$refs.multipleTable.clearSelection()
            this.getTableData()
          }
          this.$util.TipsUtils.message(res)
        })
      })
    },
    /**
     * type 1删除 2取消 3撤回
     */
    handleOptions(type, row) {
      const h = this.$createElement
      let message
      let basicForm
      switch (type) {
        case 1: // 新增地址
        case 2: // 编辑地址
          this.$nextTick(() => {
            this.$refs.modalForm.formVisible = true
            if (type === 2) {
              basicForm = this.$util.ObjectUtils.deepCopy(row)
              basicForm.areaArr = []
              if (row.area) {
                basicForm.areaArr.unshift(row.area)
              }
              if (row.city) {
                basicForm.areaArr.unshift(row.city)
              }
              if (row.province) {
                basicForm.areaArr.unshift(row.province)
              }
              this.$refs.modalForm.basicForm = basicForm
            }
          })
          break
        case 3: // 删除
          message = h('p', { style: 'font-size: 14px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, '确认是否删除？'),
            h('span', null, `正在准备删除“`),
            h('span', { style: 'color: #3369FF' }, `${row.contact}`),
            h('span', null, '”的数据！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, '删除', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.$backend.request(this.$api.basicSetting.deleteShippingAddress, { id: row.id }).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
      }
    },
    // 检索按钮
    searchList() {
      this.searchForm.current = 1
      this.getTableData()
    },
    // 获取分页列表
    getTableData() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.basicSetting.getShippingAddress, param).then(res => {
        this.tableData = res.data.records || []
        this.searchForm.total = res.data.total || 0
      })
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
