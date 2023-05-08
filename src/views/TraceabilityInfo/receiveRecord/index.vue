<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="发货日期：">
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
        <el-form-item label="产品类型：">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称：" prop="productName">
          <el-input v-model="searchForm.productName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="产品编码：" prop="productCode">
          <el-input v-model="searchForm.productCode" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="物流单号：" prop="shippingNo">
          <el-input v-model="searchForm.shippingNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="追溯码值：" prop="code">
          <el-input v-model="searchForm.code" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="发货人：" prop="shipping">
          <el-input v-model="searchForm.shipping" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" style="width: 100%" clearable>
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货日期：" prop="updateDate">
          <el-date-picker
            v-model="searchForm.receiptDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="changePickReceipt"
          />
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" class="el-button-form-two" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <el-table style="width: 100%;" :data="tableData" stripe class="fix-pagination-table" :header-cell-style="{background:'#f7f8fa'}">
        <!-- <el-table-column type="selection" /> -->
        <el-table-column label="物流单号" prop="shippingNo" show-overflow-tooltip />
        <el-table-column label="产品名称" prop="productName" show-overflow-tooltip />
        <el-table-column label="批次号" prop="batchNos" show-overflow-tooltip>
          <template slot-scope="scope">
            <TableCellRender :cell-data="scope.row" :field="'batchNos'" :type="'arrays'" />
          </template>
        </el-table-column>
        <el-table-column label="发货人" prop="shipping" show-overflow-tooltip />
        <el-table-column label="发货时间" prop="shippingDate" width="160">
          <template slot-scope="scope">
            {{ scope.row.shippingDate ? scope.row.shippingDate.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="重量" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.weight || 0 }} g
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip />
        <el-table-column label="收货时间" prop="timeOfReceipt" width="160">
          <template slot-scope="scope">
            {{ (scope.row.status == 2 || scope.row.status == 3) ? scope.row.timeOfReceipt : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusDesc" width="100" />
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_MENU_RECEIVING_RECORD_BUTTON_DETAILS')" type="text" @click="handleOptions(1, scope.row)">详情</el-button>
            <el-button v-if="hasPermission('MENU_MENU_RECEIVING_RECORD_BUTTON_RECEIVING') && scope.row.status === 1" type="text" @click="handleOptions(2, scope.row)">收货</el-button>
            <el-button v-if="hasPermission('MENU_MENU_RECEIVING_RECORD_BUTTON_DELIVERY') && scope.row.status === 2 && !scope.row.shippingLock" type="text" @click="handleOptions(3, scope.row)">发货</el-button>
            <el-button v-if="hasPermission('MENU_MENU_RECEIVING_RECORD_BUTTON_SET_MATERIAL') && scope.row.status === 2 && !scope.row.materialLock" type="text" @click="handleOptions(4, scope.row)">设为原料</el-button>
            <el-button v-if="hasPermission('MENU_MENU_RECEIVING_RECORD_BUTTON_RETURN') && scope.row.status === 2 && !scope.row.returnLock" type="text" @click="handleOptions(5, scope.row)">退货</el-button>
            <el-button v-if="hasPermission('MENU_MENU_RECEIVING_RECORD_BUTTON_RESTORE') && scope.row.status === 3 && !scope.row.restoreLock" type="text" @click="handleOptions(6, scope.row)">恢复</el-button>
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
    <!-- 【详情】【发货】 -->
    <ModalForm ref="modalForm" :receive-flag="true" :product-list="productList" :materail-list="materailList" :org-name-list="orgNameList" @handleSubmit="getTableData" />
  </div>
</template>

<script>
import TableCellRender from '../../common/tableCellRender.vue'
import ModalForm from '../deliverRecord/modalForm.vue'
export default {
  name: 'ReceiveRecord',
  components: { TableCellRender, ModalForm },
  data() {
    return {
      typeList: [{ label: '原料', value: '0' }, { label: '加工产品', value: '1' }],
      statusList: [{ label: '待收货', value: 1 }, { label: '已收货', value: 2 }, { label: '已退货', value: 3 }, { label: '已取消', value: 4 }],
      searchForm: {
        query: 1, // 0发货 1收货
        type: '',
        name: '',
        code: '',
        current: 1,
        rows: 15,
        total: 0
      },
      tableData: [],
      productList: [], // 产品名称集合
      materailList: [], // 原料产品集合
      orgNameList: [] // 经销商集合
    }
  },
  activated() {
    this.getTableData()
    this.getProductFuzzy()
    this.getMaterailFuzzy()
    this.getOrgListFuzzy()
  },
  methods: {
    handleOptions(type, row) {
      const h = this.$createElement
      let message
      let title
      let url
      let param
      const batchNos = row && row.batchNos && row.batchNos.length ? row.batchNos.join('、') : ''
      switch (type) {
        case 1: // 详情
        case 3: // 发货
          this.$nextTick(() => {
            this.$backend.request(this.$api.traceabilityInfo.getDeliveryDetail, { id: row.id }).then(res => {
              this.$refs.modalForm.formType = type === 1 ? 2 : 1
              const basicForm = res.data || []
              const labelsList = [] // 标签信息-码段（后端要）
              let totalWeight = 0 // 已选标签总重量
              let unitWeight = 0 // 每个标签的重量
              basicForm.status = row.status
              basicForm.statusDesc = row.statusDesc
              basicForm.type = basicForm.productType.toString()
              basicForm.batchIds = basicForm.batchInfos.map(item => item.id)
              basicForm.batchIds = Array.from(new Set(basicForm.batchIds))
              basicForm.codes = []
              basicForm.batchInfos.forEach(item => {
                labelsList.push({ start: item.startSegment, end: item.endSegment })
                totalWeight += (item.weight || 0)
                const tpidCode = item.startSegment.slice(0, 6)
                const minTpid = parseInt(item.startSegment.slice(6, 16))
                const maxTpid = parseInt(item.endSegment.slice(6, 16))
                const tpidLength = maxTpid - minTpid + 1
                const weight = item.weight / tpidLength
                unitWeight = weight
                for (let tpid = minTpid; tpid <= maxTpid; tpid++) {
                  let max = this.$util.ObjectUtils.prefixInteger(tpid, 10)
                  max = tpidCode + max
                  const codeIndex = basicForm.codes.findIndex(item => item.code === max)
                  if (codeIndex < 0) {
                    basicForm.codes.push({
                      batchNo: item.batchNo,
                      batchId: item.id,
                      code: max,
                      weight: weight
                    })
                  }
                }
              })
              this.$refs.modalForm.formVisible = true
              this.$refs.modalForm.labelsList = labelsList
              if (type === 1) {
                basicForm.orgName = basicForm.dealerName || ''
                basicForm.deliverTime = basicForm.shippingDate
              } else {
                basicForm.shippingNo = ''
                basicForm.remark = ''
                this.$refs.modalForm.batchList = basicForm.batchInfos || []
                this.$refs.modalForm.currentProduct = {
                  weight: unitWeight
                }
              }
              basicForm.totalWeight = totalWeight
              this.$refs.modalForm.basicForm = basicForm
              this.$refs.modalForm.clearValidate()
            })
          })
          break
        case 2: // 收货
          url = this.$api.traceabilityInfo.changeDeliveryStatus
          param = {
            status: 2,
            id: row.id
          }
          message = h('p', { style: 'font-size: 14px;' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, `确认是否收货？`),
            h('span', null, `正在准备提交“`),
            h('span', { style: 'color: #3369FF' }, `${row.productName}【${batchNos}】`),
            h('span', null, '”更改为已收货！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, '收货', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$backend.request(url, param).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
        case 4: // 设为原料
          url = this.$api.traceabilityInfo.setDeliveryMaterial
          param = {
            id: row.id
          }
          message = h('p', { style: 'font-size: 14px;padding:0 15px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, `确认是否设为原料？`),
            h('span', null, `正在准备将“`),
            h('span', { style: 'color: #3369FF' }, `${row.productName}【${batchNos}】`),
            h('span', null, '”设为原料产品数据！如果确认【提交】后，可在“'),
            h('span', { style: 'color: #ffba00' }, '追溯信息备案-原料信息'),
            h('span', null, '”查看。')
          ])
          this.$confirm(message, '设为原料', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$backend.request(url, param).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
        case 5: // 退货
          url = this.$api.traceabilityInfo.changeDeliveryStatus
          param = {
            status: 3,
            id: row.id
          }
          message = h('p', { style: 'font-size: 14px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, `确认是否退货？`),
            h('span', null, `正在准备提交“`),
            h('span', { style: 'color: #3369FF' }, `${row.productName}【${batchNos}】`),
            h('span', null, '”更改为退货！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, '退货', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.$backend.request(url, param).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
        case 6: // 恢复
          title = '恢复'
          url = this.$api.traceabilityInfo.dliveryRecover
          param = {
            status: 2,
            id: row.id
          }
          message = h('p', { style: 'font-size: 14px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, `确认是否${title}？`),
            h('span', null, `正在准备${title}“`),
            h('span', { style: 'color: #3369FF' }, `${row.productName}【${batchNos}】`),
            h('span', null, '”的数据！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, title, {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$backend.request(url, param).then(res => {
              if (res.success) {
                if (this.tableData.length === 1 && this.searchForm.current > 1) {
                  this.searchForm.current = this.searchForm.current - 1
                }
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
      }
    },
    //  获取经销商集合
    getOrgListFuzzy() {
      this.$backend.request(this.$api.traceabilityInfo.getOrganizationList, { type: 3 }).then((response) => {
        this.orgNameLoading = false
        if (response.success) {
          this.orgNameList = response.data || []
        }
      })
    },
    // 获取产品信息
    getProductFuzzy() {
      this.$backend.request(this.$api.traceabilityInfo.getProductList, { type: 1 }).then((response) => {
        this.productList = response.data || []
      })
    },
    // 获取原料信息
    getMaterailFuzzy() {
      this.$backend.request(this.$api.traceabilityInfo.getProductList, { type: 0 }).then((response) => {
        this.materailList = response.data || []
      })
    },
    // 检索按钮
    handleSearch() {
      this.searchForm.current = 1
      this.getTableData()
    },
    // 获取分页列表
    getTableData() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      delete param.receiptDate
      this.$backend.request(this.$api.traceabilityInfo.getDeliveryPage, param).then(res => {
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
    },
    // 选择日期
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
    },
    changePickReceipt(value) {
      this.searchForm.receiptStartDate = value ? value[0] : ''
      this.searchForm.receiptEndDate = value ? value[1] : ''
    }
  }
}
</script>

<style>

</style>
