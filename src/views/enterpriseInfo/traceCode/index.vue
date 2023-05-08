<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="申请时间：" prop="createDate">
          <el-date-picker
            v-model="searchForm.createDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="changePick"
          />
        </el-form-item>
        <el-form-item label="分配状态：" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" style="width: 100%" clearable @change="handleSearch">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="flex-shrink:0;">
        <el-button v-if="hasPermission('MENU_TRACE_CODE_APPLY_BUTTON_APPLY')" type="primary" @click="handleOptions('',1)">申请溯源码</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table style="width: 100%;" :data="tableData" stripe @sort-change="handleSortChange">
        <el-table-column label="序" type="index" />
        <el-table-column label="企业名称" prop="orgName">
          <template slot-scope="scope">
            <TableCellRender type="string" :cell-data="scope.row" :field="'orgName'" />
          </template>
        </el-table-column>
        <el-table-column label="申请数量" prop="applyQuantity" />
        <el-table-column label="申请时间" prop="createDate" sortable :sort-orders="['descending','ascending']" />
        <el-table-column label="企业备注" prop="remarks">
          <template slot-scope="scope">
            <TableCellRender type="string" :cell-data="scope.row" :field="'remarks'" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="码段起始值" prop="mintpid"/>
            <el-table-column label="码段终止值" prop="maxtpid"/> -->
        <el-table-column label="分配状态" prop="status">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0" class="status-background status-background-yellow">待审核</div>
            <div v-if="scope.row.status == 1" class="status-background status-background-green">已通过</div>
            <div v-if="scope.row.status == 2" class="status-background status-background-blue">不通过</div>
            <!-- <div class="status-background status-background-yellow" v-if="scope.row.status == 3">已生成</div> -->
          </template>
        </el-table-column>
        <el-table-column label="不通过原因" prop="reason">
          <template slot-scope="scope">
            <TableCellRender type="string" :cell-data="scope.row" :field="'reason'" />
          </template>
        </el-table-column>
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
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="45%" class="custom-dialog" @close="close">
      <ModalForm v-if="formVisible" ref="modalForm" @handleSubmit="handleSubmitForm" />
      <div slot="footer" class="dialog-footer">
        <el-button class="el-button-confirm-two" @click="close">取 消</el-button>
        <el-button v-if="showBtn" type="primary" :loading="loading" class="el-button-confirm-two" @click="handleSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ModalForm from './modalForm.vue'
import TableCellRender from '../../common/tableCellRender.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'EnterpriseTraceCode',
  components: { ModalForm, TableCellRender },
  data() {
    return {
      searchForm: {
        current: 1,
        rows: 15,
        total: 0,
        createDate: '',
        status: '',
        asc: false,
        order: 'createDate'
      },
      tableData: [],
      formVisible: false,
      loading: false,
      dialogTitle: '申请溯源码',
      showBtn: true,
      statusList: [{ name: '待审核', id: 0 }, { name: '已通过', id: 1 }, { name: '不通过', id: 2 }]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  activated() {
    this.getTraceCodeList()
  },
  methods: {
    handleOptions(row, type) { // 1新增 2查看
      this.formVisible = true
      const that = this
      that.showBtn = true
      switch (type) {
        case 1:
          that.dialogTitle = '申请溯源码'
          that.$nextTick(() => {
            that.$refs['modalForm'].formType = 1
            that.$refs['modalForm'].clear()
          })
          break
      }
    },
    // 排序
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') {
        this.searchForm.asc = false
      } else {
        this.searchForm.asc = true
      }
      this.getTraceCodeList()
    },
    changePick(value) {
      this.searchForm.startSearchDate = value ? value[0] : ''
      this.searchForm.endSearchDate = value ? value[1] : ''
      this.handleSearch()
    },
    // 提交成功
    handleSubmitForm() {
      this.formVisible = false
      this.getTraceCodeList()
    },
    handleSubmit() {
      this.$refs.modalForm.submit()
    },
    // 获取用户列表
    getTraceCodeList() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      param.orgId = this.userInfo.orgId
      delete param.createDate
      this.$backend.request(this.$api.traceCode.getCodeOrder, param).then((response) => {
        this.tableData = response.rows || []
        this.searchForm.total = response.total
      })
    },
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getTraceCodeList()
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getTraceCodeList()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getTraceCodeList()
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
