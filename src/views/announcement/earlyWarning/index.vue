<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="发布日期：" prop="createDate">
          <el-date-picker
            v-model="searchForm.createDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="changePick"
          />
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="searchForm.title" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
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
        @cell-click="cellClick"
        @sort-change="tableChange"
      >
        <el-table-column
          label="标题"
          prop="title"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            <span style="cursor: pointer">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateDate"
          label="发布时间"
          sortable="custom"
          width="160"
        />
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
    <!-- 点击标题列【查看公告】 -->
    <ModalForm ref="modalForm" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ModalForm from './modalForm.vue'
export default {
  name: 'EarlyWarning',
  components: { ModalForm },
  data() {
    return {
      searchForm: {
        createDate: '',
        display: 1,
        current: 1,
        rows: 15,
        total: 0,
        type: 2,
        order: 'updateDate',
        asc: false
      },
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  activated() {
    this.getTableData()
  },
  methods: {
    cellClick(row, column) {
      // if (column.label === '标题') {
      //   this.handleOptions(row)
      // }
      this.handleOptions(row)
    },
    handleOptions(row) {
      this.$nextTick(() => {
        this.$refs.modalForm.formVisible = true
        this.$refs.modalForm.detailInfo = this.$util.ObjectUtils.deepCopy(row)
      })
    },
    getTableData() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      param.orgId = this.userInfo.orgId
      delete param.createDate
      this.$backend.request(this.$api.enterprise.getAnnouncement, param).then((response) => {
        this.tableData = response.rows || []
        this.searchForm.total = response.total || 0
      })
    },
    tableChange(column, prop, order) {
      if (column.order) {
        this.searchForm.asc = column.order === 'ascending'
        this.searchForm.order = column.prop
      } else {
        this.searchForm.order = ''
        this.searchForm.asc = ''
      }
      this.getTableData()
    },
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
    // 时间选择
    changePick(value) {
      this.searchForm.startDate = value ? value[0] : ''
      this.searchForm.endDate = value ? value[1] : ''
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
