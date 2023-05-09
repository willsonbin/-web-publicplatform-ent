<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="状态：">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="(item, key) in statusMap"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检测日期：">
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
        <el-form-item label="报告编号：">
          <el-input v-model="searchForm.reportNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="btnContent" style="margin: 0px 0px 20px 0px;">
      <el-button v-if="hasPermission('MENU_EFFECT_REVIEW_RECORD_BUTTON_APPLY')" type="primary" icon="el-icon-document-add" @click="testApplication">检测申请</el-button>
    </div>
    <div class="table-content">
      <el-table style="width: 100%;" :data="tableData" class="fix-pagination-table" stripe :header-cell-style="{background:'#f7f8fa'}">
        <el-table-column label="业务编号" prop="orderNo" width="150" />
        <el-table-column label="检测产品" prop="productName" min-width="120" show-overflow-tooltip />
        <el-table-column label="检测机构" prop="testingFacilityName" min-width="120" show-overflow-tooltip />
        <el-table-column label="报告名称" prop="reportName" min-width="120" show-overflow-tooltip />
        <el-table-column label="报告编号" prop="reportNo" width="120" show-overflow-tooltip />
        <el-table-column label="检测日期" prop="detectDate" width="150" />
        <el-table-column label="报告图片" prop="reportImages" min-width="180">
          <template slot-scope="scope">
            <span v-for="item in scope.row.reportImages" :key="item.id" class="report-img-list">
              <el-image
                style="width: 100%; height: 100%"
                :src="item.url"
                :preview-src-list="scope.row.reportImages.map(item => item.url)"
              />
              <!-- <span class="report-img-icon"><i class="el-icon-search" /></span> -->
            </span>
            <!-- <span v-if="scope.row.reportImages && scope.row.reportImages.length > 3">...</span> -->
            <span v-if="!scope.row.reportImages || scope.row.reportImages.length == 0">暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="150" />
        <el-table-column label="状态" width="120" show-overflow-tooltip>
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
                <i v-if="scope.row.status === 4" style="color: #1FD279" class="el-icon-success" />
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
                <span v-if="scope.row.status === 7">取消检测</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_EFFECT_REVIEW_RECORD_BUTTON_DETAILS')" type="text" @click="handleDetialInfo(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status === 1 && hasPermission('MENU_EFFECT_REVIEW_RECORD_BUTTON_CANCEL')" type="text" @click="handleOptions(2, scope.row)">取消</el-button>
            <el-button v-if="scope.row.status === 2 && hasPermission('MENU_EFFECT_REVIEW_RECORD_BUTTON_WITHDRAW')" type="text" @click="handleOptions(3, scope.row)">撤回</el-button>
            <el-button v-if="(scope.row.status === 4 || scope.row.status === 5 ) && hasPermission('MENU_EFFECT_REVIEW_RECORD_BUTTON_DELETE')" type="text" @click="handleOptions(1, scope.row)">删除</el-button>
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
    <!-- 【检测申请】 -->
    <ModalForm ref="modalForm" :effct-dict-list="effctDictList" :organ-test-list="organTestList" :product-test-list="productTestList" @handleSubmit="getTableData" />

    <!-- 【详情】 -->
    <ModalDetail ref="modalDetail" />

  </div>
</template>

<script>
import ModalForm from './modalForm.vue'
import ModalDetail from './modalDetail.vue'
export default {
  name: 'EfficacyReport',
  components: { ModalForm, ModalDetail },
  data() {
    return {
      searchForm: {
        effectName: '',
        updateDate: '',
        order: 'createDate',
        asc: false,
        current: 1,
        rows: 15,
        total: 0,
        reportNo: '',
        productCode: '',
        status: '',
        type: 1 // 传type根据企业orgId查询,管理端不传查询全部
      },
      tableData: [],
      statusMap: {
        1: '待受理',
        2: '已受理',
        3: '检测中',
        4: '已撤回',
        5: '已取消',
        6: '已检测',
        7: '取消检测'
      },
      effctDictList: [], // 功效宣称字典列表
      organTestList: [], // 检测机构列表
      productTestList: [] // 检测产品列表
    }
  },
  activated() {
    this.getTableData()
    this.getEffectDictList()
    this.getProductTestList()
    this.getOrganTestList()
  },
  methods: {
    /**
     * type 1删除 2取消 3撤回
     */
    handleOptions(type, row) {
      const h = this.$createElement
      let title
      let msg
      let url
      let param
      if (type === 1) {
        title = '确定是否删除？'
        msg = '删除'
        url = this.$api.basicSetting.deleleteEffectReview
        param = { id: row.id }
      } else if (type === 2) {
        title = '确定是否取消检测？'
        msg = '取消'
        url = this.$api.basicSetting.editEffectReviewStatus
        param = { id: row.id, status: 5 }
      } else {
        title = '确定是否撤回提交？'
        msg = '撤回'
        url = this.$api.basicSetting.editEffectReviewStatus
        param = { id: row.id, status: 4 }
      }
      const message = h('p', { style: 'font-size: 14px' }, [
        h('h4', { style: 'margin:  10px 0;font-size: 18px' }, title),
        h('span', null, `正在准备${msg}“`),
        h('span', { style: 'color: #3369FF' }, `${row.productName}【${row.orderNo}】`),
        h('span', null, '”的数据！如果确认【提交】后，数据不可恢复。')
      ])
      this.$confirm(message, msg, {
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
    },
    // 检索按钮
    searchList() {
      this.searchForm.current = 1
      this.getTableData()
    },
    // 详情
    handleDetialInfo(row) {
      this.$backend.request(this.$api.basicSetting.getEffectReviewDetail, { id: row.id }).then(res => {
        if (res.success) {
          this.$nextTick(() => {
            this.$refs.modalDetail.formVisible = true
            this.$refs.modalDetail.form = res.data
          })
        }
      })
    },
    // 查询检测机构列表
    getOrganTestList() {
      this.$backend.request(this.$api.basicSetting.getOrganTestList, { type: 2 }).then(res => {
        this.organTestList = res.data || []
      })
    },
    // 查询检测产品列表
    getProductTestList() {
      this.$backend.request(this.$api.basicSetting.getSelectListByOrgId).then(res => {
        this.productTestList = res.data || []
      })
    },
    // 功效宣称字典列表
    getEffectDictList() {
      this.$backend.request(this.$api.basicSetting.getEffectDictList).then(res => {
        this.effctDictList = res.data || []
      })
    },
    // 获取分页列表
    getTableData() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.basicSetting.getEffectReview, param).then(res => {
        this.tableData = res.rows || []
        this.searchForm.total = res.total
      })
    },
    // 检测申请
    testApplication() {
      this.$nextTick(() => {
        this.$refs.modalForm.formVisible = true
      })
    },
    // 选择日期
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
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
.report-img-list {
    display: inline-block;
    // width: 34px;
    height: 44px;
    position: relative;
    margin-left: 5px;
    cursor: pointer;
    .report-img-icon {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 14px;
        background: rgba(0,0,0,0.3);
        display: inline-block;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 3px;
        visibility: hidden;
        .el-icon-search {
            font-size: 6px;
            color:#fff;
        }
    }
    ::v-deep.el-image__inner {
      width: auto !important;
    }
}
.report-img-list:hover {
  .report-img-icon {
      visibility: visible;
  }
}
.img-dialog .el-carousel__item {
    display: flex;
    justify-content: center;
}
</style>
