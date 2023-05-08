<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm" class="tabForm">
        <el-form-item label="申请日期：">
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
        <el-form-item label="状态：">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable class="gap">
            <el-option v-for="(item, key) in statusMap" :key="item" :label="item" :value="key">{{ item }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签类型：">
          <el-select v-model="searchForm.labelType" placeholder="请选择" clearable class="gap">
            <el-option label="版标" :value="1">版标</el-option>
            <el-option label="卷标" :value="2">卷标</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签尺寸：">
          <el-select v-model="searchForm.labelSize" placeholder="请选择" clearable class="gap">
            <el-option label="小标" :value="1">小标</el-option>
            <el-option label="大标" :value="2">大标</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务编号：">
          <el-select v-model="searchForm.orderNo" placeholder="请输入" clearable class="gap" />
        </el-form-item>
        <el-form-item label="收货人：">
          <el-select v-model="searchForm.contact" placeholder="请输入" clearable class="gap" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="gap" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnContent" style="margin: 20px 0;">
      <el-button v-if="hasPermission('MENU_LABEL_APPLY_RECORD_BUTTON_APPLY')" type="primary" icon="el-icon-edit-outline" @click="handleOptions(1)">申请标签</el-button>
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
        label="申请时间"
        width="160"
        prop="applyTime"
      />
      <el-table-column
        prop="orderNo"
        label="业务编号"
        width="150"
      />
      <el-table-column
        prop="quantity"
        label="标签数量"
        width="100"
      />
      <el-table-column
        prop="labelType"
        label="标签类型"
        width="100"
      />
      <el-table-column
        prop="labelSize"
        label="标签尺寸"
        width="100"
      />
      <el-table-column
        prop="contact"
        label="收货人"
        show-overflow-tooltip
      />
      <el-table-column
        prop="contactPhone"
        label="联系电话"
        width="120"
      />
      <el-table-column
        prop="shippingAddress"
        label="收货地址 "
        show-overflow-tooltip
      />
      <el-table-column
        prop="statusDescription"
        label="状态"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <i v-if="scope.row.status === 1 || scope.row.status === 2" style="color: #F4A721" class="el-icon-success" />
            <i v-if="scope.row.status === 3 || scope.row.status === 4" style="color: #1FD279" class="el-icon-success" />
            <i v-if="scope.row.status === 5" style="color: #F53521" class="el-icon-success" />
            <i v-if="scope.row.status === 6" style="color: #BBBBBB" class="el-icon-success" />
            {{ scope.row.statusDescription }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="170"
      >
        <template slot-scope="scope">
          <el-button v-if="hasPermission('MENU_LABEL_APPLY_RECORD_BUTTON_DETAILS')" type="text" @click="handleOptions(2, scope.row)">详情</el-button>
          <el-button v-if="scope.row.status === 1 && hasPermission('MENU_LABEL_APPLY_RECORD_BUTTON_UNDO')" type="text" @click="handleOptions(3, scope.row)">撤销</el-button>
          <el-button v-if="scope.row.status === 3" type="text" @click="handleOptions(4, scope.row)">收货</el-button>
          <el-button v-if="hasPermission('MENU_LABEL_APPLY_RECORD_BUTTON_DELETE') && (scope.row.status === 1 || scope.row.status === 5 || scope.row.status === 6)" type="text" @click="handleOptions(5, scope.row)">删除</el-button>
          <el-button v-if="scope.row.assign && hasPermission('MENU_LABEL_APPLY_RECORD_BUTTON_DATA_FILE')" type="text" @click="handleOptions(6, scope.row)">数据文件</el-button>
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
    <!-- 【申请标签】【详情】 -->
    <el-dialog :title="dialogTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" @close="close">
      <ModalForm v-if="formVisible" ref="modalForm" :basic-set="true" @refreshList="getTableData" />
      <div v-if="showBtn" slot="footer" class="dialog-footer">
        <el-button class="el-button-confirm-two" @click="close">取 消</el-button>
        <el-button type="primary" :loading="loading" class="el-button-confirm-two" @click="handleSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ModalForm from '../../TraceabilityInfo/batchInfo/labelModal.vue'
// import { axios } from '@/utils/backend'
export default {
  name: 'ApplyList',
  components: { ModalForm },
  data() {
    return {
      searchForm: {
        updateDate: '',
        contact: '',
        labelSize: '',
        labelType: '',
        orderNo: '',
        current: 1,
        rows: 15,
        total: 0,
        endDate: '',
        startDate: ''
      },
      tableData: [],
      dialogTitle: '',
      showBtn: true,
      formVisible: false,
      loading: false,
      statusMap: {
        1: '待审批',
        2: '待发货',
        3: '已发货',
        4: '已收货',
        5: '不通过',
        6: '已撤销'
      },
      downloadUrl: window.config.traceUrl + '/label/order/download/'
    }
  },
  activated() {
    this.getTableData()
  },
  methods: {
    handleSubmit() {
      this.$nextTick(() => {
        this.$refs.modalForm.handleSubmitLabel()
      })
    },
    handleOptions(type, row) {
      const h = this.$createElement
      let message = ''
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
          this.$backend.request(this.$api.basicSetting.getLableApplyDetail, { id: row.id }).then(res => {
            if (res.success && res.data) {
              this.dialogTitle = '申请详情'
              this.formVisible = true
              this.showBtn = false
              this.$nextTick(() => {
                res.data.id = row.id
                res.data.productInfo = res.data.productInfo || []
                res.data.batchInfo = res.data.batchInfo || []
                this.$refs['modalForm'].formType = 2
                this.$refs['modalForm'].basicForm = this.$util.ObjectUtils.deepCopy(res.data || {})
              })
            }
          })
          break
        case 3: // 撤销
          message = h('p', { style: 'font-size: 14px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, '确定是否撤回提交？'),
            h('span', null, `正在准备撤回业务编号“`),
            h('span', { style: 'color: #3369FF' }, row.orderNo),
            h('span', null, '”的数据！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, '撤回', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$backend.request(this.$api.basicSetting.repealLableApply, { id: row.id }).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
        case 4: // 收货
          message = h('p', { style: 'font-size: 14px;' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, `确认是否收货？`),
            h('span', null, `正在准备提交“`),
            h('span', { style: 'color: #3369FF' }, row.orderNo),
            h('span', null, '”更改为已收货！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, '收货', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$backend.request(this.$api.basicSetting.shipLableApply, { id: row.id }).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
        case 5: // 删除
          message = h('p', { style: 'font-size: 14px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, '确定是否删除？'),
            h('span', null, `正在准备删除业务编号“`),
            h('span', { style: 'color: #3369FF' }, row.orderNo),
            h('span', null, '”的数据！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, '删除', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.$backend.request(this.$api.basicSetting.deleteLableApplyDetail, { id: row.id }).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
        case 6: // 数据文件
          this.$util.DownLoadUtils.downLoadFile(this.downloadUrl + row.id)
          break
      }
    },
    getTableData() {
      this.formVisible = false
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.basicSetting.getLabelApply, param).then((response) => {
        this.tableData = response.data.records || []
        this.searchForm.total = response.data.total
      })
    },
    close() {
      this.$refs['modalForm'] && this.$refs['modalForm'].close()
      this.formVisible = false
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
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
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
