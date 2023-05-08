<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="证书名称：">
          <el-input v-model="searchForm.certificationName" placeholder="请输入证书名称" clearable />
        </el-form-item>
        <el-form-item label="证书编号：">
          <el-input v-model="searchForm.certificationNo" placeholder="请输入证书编号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('MENU_ORG_CERTIFICATION_BUTTON_ADD')" type="primary" icon="el-icon-plus" @click="handleAddCertify">新增认证</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_ORG_CERTIFICATION_BUTTON_BATCH_DELETE')" type="primary" plain @click="handleLotsDelete">批量删除</el-button>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :header-cell-style="{background:'#f7f8fa'}"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="fix-pagination-table"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="60"
        />
        <el-table-column
          prop="institutionName"
          label="认证机构"
          show-overflow-tooltip
        />
        <el-table-column
          prop="certificationName"
          label="证书名称"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="certificationNo"
          label="证书编号"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="certificationImages"
          label="证书图片"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-for="item in scope.row.certificationImages" :key="item.id" class="report-img-list">
              <el-image
                style="width:100%; height:100%; margin-right:2px"
                :src="item.url"
                :preview-src-list="scope.row.certificationImages.map(item => item.url)"
              />
              <!-- <img :src="item.url" style="width:100%; height:100%;">
              <span class="report-img-icon" @click="showImgs(index, scope.row.certificationImages)"><i class="el-icon-search" /></span> -->
            </span>
            <span v-if="scope.row.certificationImages && scope.row.certificationImages.length > 3">...</span>
            <span v-if="!scope.row.certificationImages || scope.row.certificationImages.length == 0">暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>
              <i v-if="scope.row.status === 1" style="color: #F4A721 " class="el-icon-success" />
              <span v-if="scope.row.status === 1">待审核</span>
            </span>
            <span>
              <i v-if="scope.row.status === 3" style="color: #F53521" class="el-icon-success" />
              <span v-if="scope.row.status === 3">不通过</span>
            </span>
            <span>
              <i v-if="scope.row.status === 2" style="color: #1FD279" class="el-icon-success" />
              <span v-if="scope.row.status === 2">已审核</span>
            </span>
            <span>
              <i v-if="scope.row.status === 4" style="color: #5F90FF" class="el-icon-success" />
              <span v-if="scope.row.status === 4">已提交</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="申请时间"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="210" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_ORG_CERTIFICATION_BUTTON_DETAILS')" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="hasPermission('MENU_ORG_CERTIFICATION_BUTTON_EDIT')" type="text" @click="updateReport(scope.row)">更新</el-button>
            <el-button v-if="hasPermission('MENU_ORG_CERTIFICATION_BUTTON_DELETE')" type="text" @click="handleDeleteInfo(scope.row)">删除</el-button>
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
    <!-- 新增编辑弹窗 -->
    <el-dialog
      :title="currentTittle"
      :visible.sync="formMdalVisibel"
      width="40%"
    >
      <FormModal ref="formRef" @refreshList="refreshList" @error="handleError" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="formMdalVisibel = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详情弹窗 -->
    <el-dialog
      title="查看报告"
      :visible.sync="detailVisibel"
      width="40%"
    >
      <DetailModal ref="detailRef" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisibel = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FormModal from './formModal.vue'
import DetailModal from './detailModal.vue'
export default {
  components: { FormModal, DetailModal },
  data() {
    return {
      searchForm: {
        createDate: '',
        startDate: '',
        endDate: '',
        certificationName: '',
        certificationNo: '',
        current: 1,
        rows: 15,
        total: 0,
        order: 'updateDate',
        asc: false
      },
      value: '',
      tableData: [],
      selectedIds: [],
      formMdalVisibel: false,
      currentTittle: '',
      detailVisibel: false,
      formVisible: false,
      currentIndex: 0,
      imgList: [],
      loading: false
    }
  },
  activated() {
    this.getOrgApproveList()
  },
  methods: {
    handleError() {
      this.loading = false
    },
    // 条件查询
    handleSearch() {
      this.searchForm.current = 1
      this.getOrgApproveList()
    },
    // 更新
    updateReport(row) {
      this.currentTittle = '更新证书'
      this.formMdalVisibel = true
      this.$nextTick(() => {
        this.$refs.formRef.formType = '2'
        this.$refs.formRef.clear()
        this.$refs.formRef.selectInstitutionList()
        this.$refs.formRef.getDetailInfo(row)
      })
    },
    // 详情
    handleDetail(row) {
      this.detailVisibel = true
      this.$nextTick(() => {
        this.$refs.detailRef.getDetailInfo(row)
      })
    },
    showImgs(index, imgList) {
      this.currentIndex = index
      this.imgList = imgList
      this.formVisible = true
    },
    // 新增认证
    handleAddCertify() {
      this.formMdalVisibel = true
      this.currentTittle = '新增认证'
      this.$nextTick(() => {
        this.$refs.formRef.formType = '1'
        this.$refs.formRef.clear()
        this.$refs.formRef.selectInstitutionList()
      })
    },
    // 确认提交
    handleConfirm() {
      this.$nextTick(() => {
        this.loading = true
        this.$refs.formRef.handleSubmit()
      })
    },
    // 详情
    handleDeleteInfo(row) {
      const str = row.certificationName
      this.messageTips('确认是否删除', '删除', str, '数据不可恢复', 1).then(() => {
        this.selectedIds = [row.id]
        this.deleteOrgApprove()
      }).catch(() => {})
    },
    // 单个删除
    deleteOrgApprove() {
      const param = {
        ids: this.selectedIds
      }
      this.$backend.request(this.$api.enterprise.deleteOrgApprove, param).then((response) => {
        this.$util.TipsUtils.message(response)
        this.getOrgApproveList()
      })
    },
    // 批量删除
    handleLotsDelete() {
      if (!this.selectedIds || this.selectedIds.length === 0) {
        this.$util.TipsUtils.message({ message: '您还没有选择任何记录', success: false, type: 'warning' })
        return
      }
      this.messageTips('确认是否批量删除？', '批量删除', this.selectedIds.length + '条', '数据不可恢复', 1).then(() => {
        this.deleteOrgApprove()
      }).catch({})
    },
    // 列表查询
    getOrgApproveList() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.createDate
      this.$backend.request(this.$api.enterprise.getOrgApproveList, param).then((response) => {
        this.tableData = response.rows
        this.searchForm.total = response.total
      })
    },
    refreshList() {
      this.loading = false
      this.formMdalVisibel = false
      this.getOrgApproveList()
    },
    handleSelectionChange(val) {
      const arr = []
      val.forEach((item) => {
        arr.push(item.id)
      })
      this.selectedIds = arr
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getOrgApproveList()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getOrgApproveList()
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
    }
  }
}
</script>
<style lang="scss" scoped>
.report-img-list {
    display: inline-block;
    // width: 34px;
    height: 44px;
    position: relative;
    margin-left: 5px;
    >>>.el-image__inner {
      width: auto !important;
    }
}
</style>
