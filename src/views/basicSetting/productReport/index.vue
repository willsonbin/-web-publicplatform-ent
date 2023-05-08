<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
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
        <el-form-item label="产品名称：">
          <el-input v-model="searchForm.productName" />
        </el-form-item>
        <el-form-item label="产品编码：">
          <el-input v-model="searchForm.productCode" />
        </el-form-item>
        <el-form-item label="报告编码：">
          <el-input v-model="searchForm.reportNo" />
        </el-form-item>
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-form>

    </div>
    <div class="btnContent" style="margin: 0px 0px 20px 0px;">
      <el-button v-if="hasPermission('MENU_PRODUCT_REVIEW_RECORD_BUTTON_APPLY')" type="primary" icon="el-icon-document-add" @click="testApplication">检测申请</el-button>
      <el-button v-if="hasPermission('MENU_PRODUCT_REVIEW_RECORD_BUTTON_UPLOAD')" type="primary" icon="el-icon-upload2" @click="uploadApplication">上传报告</el-button>
    </div>
    <div class="table-content">
      <el-table style="width: 100%;" :data="tableData" class="fix-pagination-table" stripe :header-cell-style="{background:'#f7f8fa'}">
        <el-table-column label="业务编号" prop="orderNo" width="150" show-overflow-tooltip />
        <el-table-column label="检测产品" prop="productName" min-width="120" show-overflow-tooltip />
        <el-table-column label="生产批次号" prop="batchNo" min-width="170" show-overflow-tooltip />
        <el-table-column label="检测机构" prop="testingFacilityName" min-width="120" show-overflow-tooltip />
        <el-table-column label="报告名称" prop="reportName" min-width="120" show-overflow-tooltip />
        <el-table-column label="报告编号" prop="reportNo" width="120" show-overflow-tooltip />
        <el-table-column label="检测日期" prop="detectDate" width="150" />
        <el-table-column label="报告图片" prop="reportImages" min-width="200">
          <template slot-scope="scope">
            <span v-for="(item) in scope.row.imageList" :key="item.id" class="report-img-list">
              <el-image
                style="width: 100%; height: 100%"
                :src="item.url"
                :preview-src-list="scope.row.imageList.map(item =>item.url)"
              />
            </span>
            <span v-if="!scope.row.imageList || scope.row.imageList.length == 0">暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="150" />
        <el-table-column label="状态" prop="batchNo" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <span>
                <i v-if="scope.row.status === 1" style="color: #F4A721 " class="el-icon-success" />
                <span v-if="scope.row.status === 1">待受理</span>
              </span>
              <span>
                <i v-if="scope.row.status === 2" style="color: #5F90FF" class="el-icon-success" />
                <span v-if="scope.row.status === 2">已受理</span>
              </span>
              <span>
                <i v-if="scope.row.status === 3" style="color: #F4A721" class="el-icon-success" />
                <span v-if="scope.row.status === 3">检测中</span>
              </span>
              <span>
                <i v-if="scope.row.status === 4" style="color: #F53521" class="el-icon-success" />
                <span v-if="scope.row.status === 4">已撤回</span>
              </span>
              <span>
                <i v-if="scope.row.status === 5" style="color: #BBBBBB" class="el-icon-success" />
                <span v-if="scope.row.status === 5">已取消</span>
              </span>
              <span>
                <i v-if="scope.row.status === 6" style="color: #5F90FF" class="el-icon-success" />
                <span v-if="scope.row.status === 6">已检测</span>
              </span>
              <span>
                <i v-if="scope.row.status === 7" style="color: #BBBBBB" class="el-icon-success" />
                <span v-if="scope.row.status === 7">已取消检测</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_PRODUCT_REVIEW_RECORD_BUTTON_DETAILS')" type="text" @click="handleDetialInfo(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status === 1 && hasPermission('MENU_PRODUCT_REVIEW_RECORD_BUTTON_CANCEL')" type="text" @click="handleOptionsCancel(scope.row)">取消</el-button>
            <el-button v-if="scope.row.status === 2 && hasPermission('MENU_PRODUCT_REVIEW_RECORD_BUTTON_WITHDRAW')" type="text" @click="handleOptionsWithdraw(scope.row)">撤回</el-button>
            <el-button v-if="scope.row.status === 4 || scope.row.status === 5 && hasPermission('MENU_PRODUCT_REVIEW_RECORD_BUTTON_DELETE')" type="text" @click="handleDeleteInfo(scope.row)">删除</el-button>
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
      title="检测申请"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <FormMadal ref="formMadalRef" @refreshList="getProductReviewPage" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="hanldeCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="detailVisible"
      width="40%"
    >
      <DetialModal ref="detailRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormMadal from './formMadal.vue'
import DetialModal from './detialModal.vue'
export default {
  name: 'ProductReport',
  components: { FormMadal, DetialModal },
  data() {
    return {
      searchForm: {
        productName: '',
        updateDate: '',
        endDate: '',
        startDate: '',
        order: 'updateDate',
        asc: false,
        current: 1,
        rows: 15,
        total: 0,
        type: 1,
        reportNo: '',
        productCode: ''
      },
      options: [],
      tableData: [],
      dialogVisible: false,
      detailVisible: false
    }
  },
  activated() {
    this.getProductReviewPage()
  },
  methods: {
    // 取消
    handleOptionsCancel(item) {
      const str = item.productName + `(${item.batchNo})`
      this.messageTips('确定是否取消检测？', '取消', str, '编辑后重新提交').then(() => {
        const param = {
          status: 5,
          id: item.id
        }
        this.$backend.request(this.$api.basicSetting.productRecordOperation, param).then(res => {
          this.$util.TipsUtils.message(res)
          this.getProductReviewPage()
        })
      }).catch({})
    },
    // 撤回
    handleOptionsWithdraw(item) {
      const str = item.productName + `(${item.batchNo})`
      this.messageTips('确定是否撤回提交？', '撤回', str, '数据不可恢复').then(() => {
        const param = {
          status: 4,
          id: item.id
        }
        this.$backend.request(this.$api.basicSetting.productRecordOperation, param).then(res => {
          this.$util.TipsUtils.message(res)
          this.getProductReviewPage()
        })
      })
    },
    // 删除信息
    handleDeleteInfo(row) {
      this.messageTips('确定删除吗？', '删除', row.productName, '数据不可恢复', 1).then(() => {
        this.$backend.request(this.$api.basicSetting.deleleteProductPreport, { id: row.id }).then(res => {
          this.$util.TipsUtils.message(res)
          this.getProductReviewPage()
        })
      })
    },
    // 检索按钮
    searchList() {
      this.searchForm.current = 1
      this.getProductReviewPage()
    },
    // 详情
    handleDetialInfo(row) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detailRef.getProDetailInfo(row.id)
      })
    },
    // 获取分页列表
    getProductReviewPage() {
      this.dialogVisible = false
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.basicSetting.getProductReviewPage, param).then(res => {
        this.tableData = res.rows || []
        this.searchForm.total = res.total
        this.tableData.map((item) => {
          if (item.reportImages) {
            const imags = []
            const pdfs = []
            const vedios = []
            item.reportImages.map((obj) => {
              if (obj) {
                const strName = obj.url.lastIndexOf('.')
                const suffixStr = obj.url.substring(strName + 1, strName.length)
                if (suffixStr === 'jpg' || suffixStr === 'png') {
                  imags.push(obj)
                  item.imageList = imags
                } else if (suffixStr === 'pdf') {
                  pdfs.push(obj)
                  item.pdfList = pdfs
                } else {
                  vedios.push(obj)
                  item.videoList = vedios
                }
              }
            })
          }
        })
      })
    },
    // 检测申请
    testApplication() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formMadalRef.formType = '1'
        this.$refs.formMadalRef.clear()
        this.$refs.formMadalRef.selectInstitutionList()
        this.$refs.formMadalRef.getSelectListByOrgId()
      })
    },
    // 上传报告
    uploadApplication() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formMadalRef.formType = '2'
        this.$refs.formMadalRef.getCurrentMust(true)
        this.$refs.formMadalRef.clear()
        this.$refs.formMadalRef.getSelectListByOrgId()
        this.$refs.formMadalRef.selectInstitutionList()
      })
    },
    // 操作提示
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
    // 取消
    hanldeCancel() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$refs.formMadalRef.clear()
      })
    },
    // 确认提交
    handleSubmit() {
      this.$nextTick(() => {
        this.$refs.formMadalRef.submitForm()
      })
    },
    // 选择日期
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getProductReviewPage()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getProductReviewPage()
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-form-item--medium .el-form-item__label{
    font-weight: normal;
}
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
