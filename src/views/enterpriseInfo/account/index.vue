<template>
  <div class="wrapper">
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="注册日期:">
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
        <el-form-item label="管理员:">
          <el-select v-model="searchForm.isAdmin" placeholder="请选择" style="width: 100%" clearable>
            <el-option label="全部" value="" />
            <el-option label="是" value="0" />
            <el-option label="否" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchForm.status" placeholder="请选择" style="width: 100%" clearable>
            <el-option label="全部" value="" />
            <el-option label="开启" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号:">
          <el-select v-model="searchForm.userName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="searchForm.roleName" placeholder="请输入" clearable />
        </el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form>
    </div>
    <div style="margin: 0 0 20px 0px">
      <el-button v-if="hasPermission('MENU_USER_MANAGEMENT_BUTTON_ADD')" type="primary" icon="el-icon-plus" @click="handleOptions('',1)">添加用户</el-button>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_USER_MANAGEMENT_BUTTON_BATCH_OPEN')" type="primary" plain @click="batchStart">批量开启</el-button>
      <el-button v-if="hasPermission('MENU_USER_MANAGEMENT_BUTTON_BATCH_DISABLED')" type="primary" plain @click="batchStop">批量禁止</el-button>
      <el-button v-if="hasPermission('MENU_USER_MANAGEMENT_BUTTON_BATCH_RESET_PASSWORD')" type="primary" plain @click="batchRsetPassword">批量重置密码</el-button>
    </div>
    <div class="table-content">
      <el-table stripe style="width: 100%;" class="fix-pagination-table" :data="tableData" :header-cell-style="{background:'#f7f8fa'}" @sort-change="tableChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="selectEnable" />
        <el-table-column label="账号" prop="userName" width="110" show-overflow-tooltip />
        <el-table-column label="用户角色" prop="roleName">
          <template slot-scope="scope">
            <TableCellRender :cell-data="scope.row" :field="'roleName'" type="string" />
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" prop="contact" />
        <el-table-column label="联系电话" prop="telephone" />
        <el-table-column label="邮箱地址" prop="email" />
        <el-table-column label="管理员" prop="isAdmin">
          <template slot-scope="scope">
            <div>{{ scope.row.isAdmin == 0 ? '是':'否' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createDate" />
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :disabled="scope.row.isAdmin===0 || !hasPermission('MENU_USER_MANAGEMENT_BUTTON_EDIT')" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="最后更新" prop="updateDate" sortable="custom" width="160" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_USER_MANAGEMENT_BUTTON_EDIT')" type="text" :disabled="scope.row.isAdmin===0" @click="handleOptions(scope.row,2)">编辑</el-button>
            <el-button v-if="hasPermission('MENU_USER_MANAGEMENT_BUTTON_PASSWORD')" type="text" :disabled="scope.row.isAdmin===0" @click="handleChangePassword(scope.row)">密码</el-button>
            <el-button v-if="hasPermission('MENU_USER_MANAGEMENT_BUTTON_DELETE')" type="text" :disabled="scope.row.status===1 && scope.row.isAdmin===0" @click="handleOptions(scope.row,4)">删除</el-button>
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
      <ModalForm v-if="formVisible" ref="modalForm" @handleUserSubmit="handleSubmitForm" @error="handleError" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleModalSubmit">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="passwordVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
      <PasswordForm v-if="passwordVisible" ref="passwordForm" @handleSubmit="handleSubmitForm" @error="handleError" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="confirmSubmitPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ModalForm from './modalForm.vue'
import PasswordForm from './passwordForm.vue'
import TableCellRender from '../../common/tableCellRender.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'EnterpriseInfoUser',
  components: { ModalForm, TableCellRender, PasswordForm },
  data() {
    return {
      searchForm: {
        updateDate: '',
        startDate: '',
        endDate: '',
        current: 1,
        rows: 15,
        total: 0,
        orgName: '',
        userName: '',
        roleName: '',
        isAdmin: '',
        status: '',
        order: 'updateDate',
        asc: false,
        orgType: 1,
        enterpriseType: 1
      },
      tableData: [],
      formVisible: false,
      dialogTitle: '添加用户',
      loading: false,
      selectedIds: [],
      passwordVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  activated() {
    this.getUserList()
  },
  methods: {
    handleError() {
      this.loading = false
    },
    selectEnable(row, rowIndex) {
      // 管理员禁止操作
      if (row.isAdmin === 1) {
        return true
      }
    },
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
    },
    handleChangePassword(row) {
      this.passwordVisible = true
      this.$nextTick(() => {
        this.$refs.passwordForm.basicForm.userId = row.id
      })
    },
    // 修改密码
    confirmSubmitPwd() {
      this.loading = true
      this.$refs.passwordForm.submit()
    },
    // 批量选择
    handleSelectionChange(val) {
      const arr = []
      val.forEach((item) => {
        arr.push(item.id)
      })
      this.selectedIds = arr
    },
    // 批量重置密码
    batchRsetPassword() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        this.passwordVisible = true
        this.$nextTick(() => {
          this.$refs.passwordForm.basicForm.userIds = this.selectedIds
        })
      }
    },
    // 批量禁用
    batchStop() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        const params = {
          orgType: 0,
          status: 0,
          userIds: this.selectedIds
        }
        this.messageTips('确认是否批量禁用?', '批量禁用', this.selectedIds.length + '条', '账号不允许登录系统.').then(() => this.startOrStop(params))
      }
    },
    // 批量开启
    batchStart() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        const params = {
          orgType: 0,
          status: 1,
          userIds: this.selectedIds
        }
        this.messageTips('确认是否批量开启?', '批量开启', this.selectedIds.length + '条', '账号恢复登录系统.').then(() => this.startOrStop(params))
      }
    },
    // 开启或禁用
    startOrStop(params) {
      this.$backend.request(this.$api.enterprise.updateUserStatus, params).then((response) => {
        this.$util.TipsUtils.message(response)
        this.getUserList()
      })
    },
    // 账号不允许登录系统
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
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getUserList()
    },
    getUserList() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.enterprise.getUserList, param).then((response) => {
        this.tableData = response.rows || []
        this.searchForm.total = response.total
      })
    },
    changeStatus(data) {
      const params = {
        orgType: 0,
        status: data.status,
        userIds: [data.id]
      }
      this.$confirm('确定要修改状态吗?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.startOrStop(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
        this.getUserList()
        return false
      })
    },
    // 新增/查看/编辑/删除
    handleOptions(row, type) {
      if (type === 4) { // 删除
        this.messageTips('确定删除吗？', '删除', row.userName, '数据不可恢复', 1).then(() => {
          this.$backend.request(this.$api.enterprise.deleteUser, { id: row.id }).then((response) => {
            this.$util.TipsUtils.message(response)
            if (response.success) {
              this.getUserList()
            }
          })
        })
        return
      }
      this.formVisible = true
      const that = this
      switch (type) {
        case 1:
          that.dialogTitle = '新增用户'
          that.$nextTick(() => {
            that.$refs['modalForm'].formType = 1
            that.$refs['modalForm'].clear()
          })
          break
        case 2:
          that.dialogTitle = '编辑用户'
          that.$nextTick(() => {
            this.$refs['modalForm'].currentId = row.orgId
            that.$refs['modalForm'].formType = 2
            that.$refs['modalForm'].basicForm = that.$util.ObjectUtils.deepCopy(row)
            that.$refs['modalForm'].basicFormInit = that.$util.ObjectUtils.deepCopy(row)
            that.$refs['modalForm'].clear()
          })
          break
      }
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getUserList()
    },
    close() {
      const that = this
      that.$nextTick(() => {
        that.$refs['modalForm'] && this.$refs['modalForm'].close()
        that.formVisible = false
      })
    },
    // 提交成功
    handleSubmitForm() {
      this.loading = false
      this.formVisible = false
      this.passwordVisible = false
      this.getUserList()
    },
    handleModalSubmit() {
      this.loading = true
      this.$refs.modalForm.submit()
    },
    tableChange(column, prop, order) {
      if (column.order) {
        this.searchForm.asc = column.order === 'ascending'
        this.searchForm.order = column.prop
      } else {
        this.searchForm.order = ''
        this.searchForm.asc = ''
      }
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
