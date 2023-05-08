<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form>
    </div>
    <div style="margin: 0 0 20px 0px">
      <el-button v-if="hasPermission('MENU_ROLE_PRIVILEGE_BUTTON_ADD')" icon="el-icon-plus" type="primary" @click="handleOptions('', 1)">新增角色</el-button>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_ROLE_AUTHORITY_BUTTON_BATCH_OPEN')" type="primary" plain @click="lotsStart">批量开启</el-button>
      <el-button v-if="hasPermission('MENU_ROLE_AUTHORITY_BUTTON_BATCH_DISABLED')" type="primary" plain @click="lotsStop">批量禁用</el-button>
    </div>
    <div class="table-content">
      <el-table
        ref="multipleTable"
        style="width: 100%;"
        class="fix-pagination-table"
        :data="tableData"
        stripe
        :header-cell-style="{background:'#f7f8fa'}"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column label="角色名称" prop="name">
          <template slot-scope="scope">
            <TableCellRender :cell-data="scope.row" :field="'name'" type="string" />
          </template>
        </el-table-column>
        <el-table-column label="角色描述" prop="remarks">
          <template slot-scope="scope">
            <TableCellRender :cell-data="scope.row" :field="'remarks'" type="string" />
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="creator" />
        <el-table-column label="最后更新" prop="updateDate" sortable :sort-orders="['descending','ascending']" />
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :disabled="scope.row.roleType == 0 || !hasPermission('MENU_ORGANIZATION_USER_BUTTON_EDIT')" :active-value="1" :inactive-value="0" @change="changeSingleStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_ROLE_AUTHORITY_BUTTON_EDIT')" :disabled="scope.row.roleType == 0" type="text" @click="handleOptions(scope.row, 2)">编辑</el-button>
            <el-button v-if="hasPermission('MENU_ROLE_AUTHORITY_BUTTON_DELETE')" :disabled="scope.row.roleType == 0" type="text" @click="handleOptions(scope.row, 4)">删除</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
      <ModalForm v-if="formVisible" ref="modalForm" :role-list="roleList" @handleSubmit="handleSubmitForm" @error="handleError" />
      <div slot="footer" class="dialog-footer">
        <el-button class="el-button-confirm-two" @click="close">取 消</el-button>
        <el-button type="primary" :loading="loading" class="el-button-confirm-two" @click="handleSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ModalForm from './modalForm.vue'
import TableCellRender from '../../common/tableCellRender.vue'
export default {
  components: { ModalForm, TableCellRender },
  data() {
    return {
      searchForm: {
        current: 1,
        rows: 15,
        total: 0,
        name: '',
        type: 1,
        asc: false,
        order: 'updateDate'
      },
      tableData: [],
      formVisible: false,
      loading: false,
      dialogTitle: '添加企业账号',
      roleList: [],
      showBtn: false,
      selectedIds: []
    }
  },
  activated() {
    this.getRoleList()
  },
  methods: {
    handleError() {
      this.loading = false
    },
    handleSelectionChange(val) {
      const arr = []
      val.forEach((item) => {
        arr.push(item.id)
      })
      this.selectedIds = arr
    },
    // 排序
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') {
        this.searchForm.asc = false
      } else {
        this.searchForm.asc = true
      }
      this.getRoleList()
    },
    // 新增/编辑/删除
    handleOptions(row, type) {
      const h = this.$createElement
      if (type === 4) { // 删除
        this.$msgbox({
          title: '确认是否删除？',
          message: h('p', null, [
            h('span', null, '正在准备删除选择'),
            h('b', { style: 'color: #3369FF' }, row.name),
            h('span', null, '的数据，确认提交后，数据不可以恢复。')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$backend.request(this.$api.roleAuthority.deleteRoleInfo, row.id).then((response) => {
            this.$util.TipsUtils.message(response)
            if (response.success) this.getRoleList()
          })
        })
          .catch(() => {})
        return
      }
      this.formVisible = true
      const that = this
      switch (type) {
        case 1:
          that.dialogTitle = '新增角色'
          that.showBtn = false
          that.$nextTick(() => {
            that.$refs['modalForm'].formType = 1
            that.$refs['modalForm'].clear()
          })
          break
        case 2:
          that.dialogTitle = '编辑角色'
          that.showBtn = true
          that.$nextTick(() => {
            that.$refs['modalForm'].formType = 2
            that.$refs['modalForm'].basicForm = that.$util.ObjectUtils.deepCopy(row)
            that.$refs.modalForm.getRoleId(row.id)
            that.$refs['modalForm'].clear()
          })
          break
      }
    },
    changeSingleStatus(row) {
      const param = {
        id: [row.id],
        status: row.status
      }
      this.changeStatus(param)
    },
    changeStatus(data) {
      const param = {
        roleIds: data.id,
        status: data.status
      }
      this.$backend.request(this.$api.roleAuthority.updateRoleStatus, param).then((response) => {
        this.$util.TipsUtils.message(response)
        this.getRoleList()
      })
    },
    // 批量开启
    lotsStart() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: '确认是否开启？',
          message: h('p', null, [
            h('span', null, '正在准备批量开启'),
            h('span', null, '选中的数据')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const param = {
            id: this.selectedIds,
            status: 1
          }
          this.changeStatus(param)
        }).catch(() => {
        })
      }
    },
    // 批量禁用
    lotsStop() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: '确认是否禁用？',
          message: h('p', null, [
            h('span', null, '正在准备批量禁用'),
            h('span', null, '选中数据')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const param = {
            id: this.selectedIds,
            status: 0
          }
          this.changeStatus(param)
        }).catch(() => {
        })
      }
    },
    // 获取所有角色
    getRoleList() {
      this.$backend.request(this.$api.roleAuthority.getRoleList, this.searchForm).then((response) => {
        this.tableData = response.rows || []
        this.searchForm.total = response.total
      })
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getRoleList()
    },
    // 提交成功
    handleSubmitForm() {
      this.loading = false
      this.formVisible = false
      this.getRoleList()
    },
    handleSubmit() {
      this.loading = true
      this.$refs.modalForm.submit()
    },
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getRoleList()
    },
    // 新增
    handleAdd() {
      this.formVisible = true
    },
    // 关闭弹窗
    close() {
      const that = this
      that.$nextTick(() => {
        that.$refs['modalForm'] && that.$refs['modalForm'].close()
        that.formVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
