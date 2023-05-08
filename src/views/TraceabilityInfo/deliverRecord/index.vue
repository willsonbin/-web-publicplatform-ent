<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="产品类型：" prop="updateDate">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期：" prop="updateDate">
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
          <el-input v-model="searchForm.productName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="产品编码：">
          <el-input v-model="searchForm.productCode" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" class="el-button-form-two" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px">
      <el-button v-if="hasPermission('MENU_DELIVERY_RECORD_BUTTON_ADD')" type="primary" icon="el-icon-plus" @click="handleOptions(1)">新增发货</el-button>
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
        <el-table-column label="经销商" prop="dealerName" show-overflow-tooltip />
        <el-table-column label="发货时间" prop="shippingDate" width="160">
          <template slot-scope="scope">
            {{ scope.row.shippingDate ? scope.row.shippingDate.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.weight || 0 }} g
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip />
        <el-table-column label="状态" prop="statusDesc" width="100" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_DELIVERY_RECORD_BUTTON_DETAILS')" type="text" @click="handleOptions(2, scope.row)">详情</el-button>
            <el-button v-if="hasPermission('MENU_DELIVERY_RECORD_BUTTON_CANCEL') && scope.row.status === 1" type="text" @click="handleOptions(3, scope.row)">取消</el-button>
            <el-button v-if="hasPermission('MENU_DELIVERY_RECORD_BUTTON_DELETE') && scope.row.status === 4" type="text" @click="handleOptions(4, scope.row)">删除</el-button>
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
    <!-- 【新增发货】【详情】【修改发货】 -->
    <ModalForm ref="modalForm" :product-list="productListFilter" :materail-list="materailFilter" :org-name-list="orgNameList" @handleSubmit="getTableData" />
  </div>
</template>

<script>
import ModalForm from './modalForm.vue'
import TableCellRender from '../../common/tableCellRender.vue'
export default {
  name: 'DeliverRecord',
  components: { ModalForm, TableCellRender },
  data() {
    return {
      typeList: [{ label: '原料', value: '0' }, { label: '加工产品', value: '1' }],
      searchForm: {
        query: 0, // 0发货 1收货
        type: '',
        productName: '',
        productCode: '',
        current: 1,
        rows: 15,
        total: 0
      },
      tableData: [],
      productList: [], // 产品名称集合
      materailList: [], // 原料产品集合
      orgNameList: [], // 经销商集合
      productArr: [], // 处理修改发货时产品/原料无数据不回显的问题
      materailArr: []
    }
  },
  computed: {
    productListFilter() {
      return [...this.productList, ...this.productArr]
    },
    materailFilter() {
      return [...this.materailList, ...this.materailArr]
    }
  },
  activated() {
    this.materailArr = []
    this.productArr = []
    this.getTableData()
    this.getProductFuzzy()
    this.getMaterailFuzzy()
    this.getOrgListFuzzy()
  },
  methods: {
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
    handleOptions(type, row) {
      const h = this.$createElement
      let message
      let title
      let url
      let param
      let batchNos
      switch (type) {
        case 1: // 新增发货
          this.$nextTick(() => {
            this.$refs.modalForm.formVisible = true
            this.$refs.modalForm.formType = 1
            this.$refs.modalForm.clearValidate()
          })
          break
        case 2: // 详情
          this.$nextTick(() => {
            this.$backend.request(this.$api.traceabilityInfo.getDeliveryDetail, { id: row.id }).then(res => {
              this.$refs.modalForm.formType = 2
              const basicForm = res.data || []
              const labelsList = [] // 标签信息-码段（后端要）
              let totalWeight = 0 // 已选标签总重量
              let unitWeight = 0 // 每个标签的重量
              basicForm.status = row.status
              basicForm.type = basicForm.productType.toString()
              basicForm.orgName = basicForm.dealerName || ''
              basicForm.deliverTime = basicForm.shippingDate
              basicForm.batchIds = basicForm.batchInfos.map(item => item.id)
              basicForm.batchIds = Array.from(new Set(basicForm.batchIds))
              basicForm.codes = [] // 标签信息-码值
              basicForm.batchInfos.forEach(item => {
                labelsList.push({ start: item.startSegment, end: item.endSegment })
                totalWeight += (item.weight || 0)
                // const minTpid = parseInt(item.startSegment)
                // const maxTpid = parseInt(item.endSegment)
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
              basicForm.totalWeight = totalWeight
              this.$refs.modalForm.labelsList = labelsList
              this.$refs.modalForm.basicForm = basicForm
              this.$refs.modalForm.batchList = basicForm.batchInfos || []
              this.$refs.modalForm.currentProduct = {
                weight: unitWeight
              }
              if (basicForm.type === '0') {
                const index = this.materailList.findIndex(item => item.id === basicForm.productId)
                if (index < 0) {
                  this.materailArr = [{ id: basicForm.productId, name: basicForm.productName, weight: unitWeight, batchList: basicForm.batchInfos }]
                }
              } else {
                const index = this.productList.findIndex(item => item.id === basicForm.productId)
                if (index < 0) {
                  this.productArr = [{ id: basicForm.productId, name: basicForm.productName, weight: unitWeight, batchList: basicForm.batchInfos }]
                }
              }
              //   this.$refs.modalForm.changeProduct(basicForm.productId)
              this.$refs.modalForm.formVisible = true
              this.$refs.modalForm.clearValidate()
            })
          })
          break
        case 3: // 取消
        case 4:
          if (type === 3) {
            title = '取消'
            url = this.$api.traceabilityInfo.changeDeliveryStatus
            param = {
              status: 4,
              id: row.id
            }
          } else {
            title = '删除'
            url = this.$api.traceabilityInfo.deleteDeliveryPage
            param = {
              id: row.id
            }
          }
          batchNos = row.batchNos && row.batchNos.length ? row.batchNos.join('、') : ''
          message = h('p', { style: 'font-size: 14px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, `确认是否${title}？`),
            h('span', null, `正在准备${title}“`),
            h('span', { style: 'color: #3369FF' }, `${row.productName}【${batchNos}】`),
            h('span', null, '”的数据！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, title, {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'error'
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
    // 检索按钮
    handleSearch() {
      this.searchForm.current = 1
      this.getTableData()
    },
    // 获取分页列表
    getTableData() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.traceabilityInfo.getDeliveryPage, param).then(res => {
        this.tableData = res.data.records || []
        this.searchForm.total = res.data.total || 0
      })
    },
    // 选择日期
    changePick(value) {
      this.searchForm.productionStartDate = value ? value[0] : ''
      this.searchForm.productionEndDate = value ? value[1] : ''
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

<style>

</style>
