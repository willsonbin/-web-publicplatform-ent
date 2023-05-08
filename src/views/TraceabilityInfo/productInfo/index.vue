<template>
  <div v-if="$route.meta.showSecondPage">
    <!-- class="flex-space-between-form" label-width="84px"-->
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="更新日期：" prop="updateDate">
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
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类：">
          <el-cascader
            v-model="searchForm.categoryId"
            :options="productArr"
            filterable
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="产地：">
          <el-cascader
            v-model="searchForm.productionPlace"
            :options="countryAreaTree"
            filterable
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model="searchForm.productName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="产品编码：">
          <el-input v-model="searchForm.productCode" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px">
      <el-button v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_ADD')" type="primary" icon="el-icon-plus" @click="addProduct">新增产品</el-button>
      <el-button v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_BATCH_IMPORT')" type="primary" icon="el-icon-download" @click="importFile">批量导入</el-button>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_BATCH_SUBMIT')" type="primary" plain @click="handleMuchSubmit">批量提交</el-button>
    </div>
    <div class="table-content">
      <el-table style="width: 100%;" class="fix-pagination-table" :data="tableData" stripe :header-cell-style="{background:'#f7f8fa'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column label="产品名称" prop="name" width="100" show-overflow-tooltip />
        <el-table-column label="产品编码" prop="code" width="120" show-overflow-tooltip />
        <el-table-column label="净含量" prop="weight" width="100" show-overflow-tooltip />
        <el-table-column label="产品规格" prop="unit" width="110" show-overflow-tooltip />
        <el-table-column label="产地" prop="counrtyRegionName">
          <template slot-scope="scope">
            {{ scope.row.country }} {{ scope.row.province }}
          </template>
        </el-table-column>
        <el-table-column label="加工企业" prop="processingEnterprise" width="180" show-overflow-tooltip />
        <el-table-column label="填报账号" prop="operator" width="130" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createDate" width="140" show-overflow-tooltip />
        <el-table-column label="最后更新" prop="lastUpdate" width="140" show-overflow-tooltip />
        <el-table-column label="状态" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">待提交</span>
            <span v-if="scope.row.status === 1" style="color: #F4A721">待审核</span>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.remarks"
            >
              <span v-show="scope.row.status === 2" slot="reference" style="color: #F53521"><i class="el-icon-warning" style="color:#E71F19" /> 审核不通过</span>
            </el-popover>
            <span v-if="scope.row.status === 3" style="color: #1FD279">审核通过</span>
            <span v-if="scope.row.status === 4" style="color: #c0c4cc">已下线</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_DETAILS')" class="blue-text" style="margin-right: 16px" @click="detailProduct(scope.row)">详情</span>
            <span v-if="scope.row.status === 1 && hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_WITHDRAW')" class="blue-text" @click="changeStatus(scope.row,3)">撤回</span>
            <span v-if="scope.row.status === 3 && hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_OFFLINE')" class="blue-text" @click="changeStatus(scope.row,2)">下线</span>
            <span v-if="scope.row.status === 4 && hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_ONLINE')" class="blue-text" @click="changeStatus(scope.row,1)">上线</span>
            <span v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_DELETE') && scope.row.status === 0" class="blue-text" @click="handleOptions(scope.row)">删除</span>
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
      title="产品详情"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <ProductDetail ref="modelRef" @refreshList="getProductPage" />
      <span slot="footer" class="dialog-footer">
        <div v-if="curStatus===0 || curStatus ===2" class="btnContent" style="margin-top:20px">
          <el-button v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_EDIT')" @click="editInfo">编辑信息</el-button>
          <el-button v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_SUBMIT_AUDIT')" type="primary" @click="submitInfo">提交审核</el-button>
        </div>
        <div v-if="curStatus===3 || curStatus===4 || curStatus===1" class="btnContent" style="magin-top:20px">
          <el-button class="el-button-confirm-two" @click="dialogVisible=false">取消</el-button>
        </div>
      </span>
    </el-dialog>
    <ImportExcel ref="excelImport" :importapi="batchImportUrl" :type="2" @ok="getProductPage" />
  </div>
  <router-view v-else />
</template>

<script>
import { mapGetters } from 'vuex'
import ProductDetail from './productDetail.vue'
import ImportExcel from '../../common/importExcel.vue'
export default {
  components: { ImportExcel, ProductDetail },
  data() {
    return {
      options: [],
      batchImportUrl: this.$api.traceabilityInfo.productImport,
      searchForm: {
        current: 1,
        rows: 15,
        total: 0,
        categoryId: '',
        updateDate: '',
        status: '',
        productionPlace: '',
        productName: '',
        productCode: '',
        endDate: '',
        startDate: ''
      },
      tableData: [],
      statusOption: [{ label: '全部', value: '' }, { label: '待提交', value: '0' }, { label: '待审核', value: '1' },
        { label: '审核不通过', value: '2' }, { label: '审核通过', value: '3' }, { label: '已下线', value: '4' }],
      selectedIds: [],
      productArr: [],
      dialogVisible: false,
      curStatus: 0
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ])
  },
  activated() {
    console.log('产品activated')
    this.getProductPage()
    this.productCategory()
  },
  mounted() {
    console.log('chanpingmounted')
  },
  methods: {
    // 编辑信息
    editInfo() {
      this.$nextTick(() => {
        this.$refs.modelRef.editProduct()
      })
      this.dialogVisible = false
    },
    // 提交审核
    submitInfo() {
      this.$nextTick(() => {
        this.$refs.modelRef.handleSubmit()
      })
      this.dialogVisible = false
    },
    // 产品详情
    detailProduct(row) {
      this.dialogVisible = true
      this.curStatus = row.status
      this.$nextTick(() => {
        this.$refs.modelRef.getProductsInfo(row.id)
        this.$refs.modelRef.formType = '3'
      })
      // this.$router.push({ path: '/traceability/productInfo/productDetail', query: { formType: '3', id: row.id }})
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
    // 批量提交
    handleMuchSubmit() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        const params = { ids: this.selectedIds }
        const str = this.selectedIds.length
        this.messageTips('确认是否提交审核?', '批量提交', str + '条', '数据不可恢复').then(() => this.handleSubmit(params))
      }
    },
    handleSubmit(param) {
      this.$backend.request(this.$api.traceabilityInfo.muchProductSubmit, param).then((response) => {
        this.$util.TipsUtils.message(response)
        this.getProductPage()
      })
    },
    // 获取产品类别
    productCategory() {
      this.$backend.request(this.$api.traceabilityInfo.productCategory, { type: 0 }).then((response) => {
        if (response.success) {
          this.productArr = response.data
          this.$util.ObjectUtils.assignValue(
            this.productArr,
            'name',
            'id',
            'child'
          )
        }
      })
    },
    // 新增产品
    addProduct() {
      this.$router.push({ path: '/traceability/productInfo/createOrEdit', query: { formType: 1 }})
    },
    importFile() {
      this.$refs.excelImport.showExcelDialog = true
    },
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getProductPage()
    },
    // 状态修改
    changeStatus(row, type) {
      const STR = row.name + `(${row.code})`
      if (type === 3) {
        this.messageTips('确认是否撤回?', '撤回', STR, '数据不可恢复').then(() => this.changeStatusType(row, type))
      } else if (type === 2) {
        this.messageTips('确认是否下线?', '下线', STR, '数据不可恢复').then(() => this.changeStatusType(row, type))
      } else if (type === 1) {
        this.messageTips('确认是否上线?', '上线', STR, '数据不可恢复').then(() => this.changeStatusType(row, type))
      }
    },
    changeStatusType(row, types) {
      const id = row.id
      const params = {
        specialLine: id,
        type: types
      }
      this.$backend.spcialRequest(this.$api.traceabilityInfo.changeProductStatus, '', '', params).then((response) => {
        this.getProductPage()
      })
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
    // 新增/查看/编辑/删除
    handleOptions(row) {
      const STR = row.name + `(${row.code})`
      return this.messageTips('确认是否删除?', '删除', STR, '数据不可恢复', 1).then(() => {
        this.$backend.request(this.$api.traceabilityInfo.deleteProducts, { id: row.id }).then((response) => {
          if (response.success) this.getProductPage()
          this.$util.TipsUtils.message(response)
        })
      })
        .catch(() => {})
    },
    // 获取商品列表
    getProductPage() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      for (const item in param) {
        if (this.$util.StringUtils.isArray(param[item])) {
          param[item] = param[item].pop()
        }
      }
      delete param.updateDate
      this.$backend.request(this.$api.traceabilityInfo.getProductPage, param).then((response) => {
        if (response.success) {
          this.tableData = response.data.records || []
          this.searchForm.total = response.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getProductPage()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getProductPage()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
