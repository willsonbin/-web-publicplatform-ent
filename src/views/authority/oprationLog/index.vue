<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="操作日期：" prop="createDate">
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
        <el-form-item label="操作模块：">
          <el-cascader
            ref="areaArr"
            v-model="searchForm.module"
            :options="opModuleList"
            filterable
            clearable
            style="width: 100%"
            placeholder="请选择"
            @change="handleChangeList"
          />
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="searchForm.operateType" filterable placeholder="请选择" clearable>
            <el-option
              v-for="(item, key) in opTypeList"
              :key="key"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作账号：">
          <el-input v-model="searchForm.username" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="操作设备/IP：">
          <el-input v-model="searchForm.deviceOrIp" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnContent" style="margin-top:0px;margin-bottom: 20px">
      <el-button type="primary" :loading="loading" icon="el-icon-download" @click="handleOptions()">批量导出</el-button>
    </div>
    <el-table
      ref="multipleTable"
      class="fix-pagination-table"
      :header-cell-style="{background:'#f7f8fa'}"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      stripe
    >
      <el-table-column
        label="序"
        type="index"
        width="50"
      />
      <el-table-column
        label="操作时间"
        prop="operationTime"
        width="160"
      />
      <el-table-column
        label="操作账号"
        prop="account"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作模块"
        prop="module"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作类型"
        prop="type"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作设备"
        prop="device"
        show-overflow-tooltip
      />
      <el-table-column
        label="浏览器"
        prop="browser"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作IP"
        prop="ip"
        show-overflow-tooltip
      />
      <el-table-column
        label="URL地址"
        prop="path"
        show-overflow-tooltip
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
</template>
<script>
import { axios } from '@/utils/backend'
import qs from 'qs'
export default {
  data() {
    return {
      searchForm: {
        createDate: '',
        current: 1,
        rows: 15,
        total: 0,
        module: [],
        order: 'operationTime',
        asc: false,
        logType: 1,
        operateType: ''
      },
      opModuleList: [], // 操作模块
      opTypeList: [], // 操作类型
      tableData: [],
      loading: false
    }
  },
  activated() {
    this.getTableData()
    this.getOprationModule()
  },
  methods: {
    // 批量导出
    handleOptions() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.createDate
      this.loading = true
      axios({
        method: 'GET',
        url: window.config.traceUrl + '/log/export',
        params: param,
        responseType: 'blob'
      }).then(res => {
        this.loading = false
        this.$util.DownLoadUtils.jsDownload(res)
      }).catch(err => {
        console.log(err)
      })
    },
    getTableData() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.createDate
      param.module = this.searchForm.module.join('-')
      this.$backend.request(this.$api.roleAuthority.getOprationList, qs.stringify(param)).then((response) => {
        this.tableData = response.data.records || []
        this.searchForm.total = response.data.total || 0
      })
    },
    getOprationModule() {
      this.$backend.request(this.$api.roleAuthority.getOprationModule, { orgType: 1 }).then((response) => {
        this.opModuleList = response.data || []
        this.$util.ObjectUtils.assignOtherValue(
          this.opModuleList,
          'name',
          'name',
          'child'
        )
      })
    },
    getOprationType() {
      const param = {
        orgType: 1,
        module: this.searchForm.module.join('-')
      }
      this.$backend.request(this.$api.roleAuthority.getOprationType, qs.stringify(param)).then((response) => {
        this.opTypeList = response.data || []
      })
    },
    // 操作模块切换
    handleChangeList(val) {
      if (val) {
        this.getOprationType()
        this.searchForm.operateType = ''
      } else {
        this.opTypeList = []
        this.searchForm.operateType = ''
      }
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
      this.searchForm.startOperateDate = value ? value[0] : ''
      this.searchForm.endOperateDate = value ? value[1] : ''
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
