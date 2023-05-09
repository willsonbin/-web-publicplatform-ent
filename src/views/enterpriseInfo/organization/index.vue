<template>
  <!-- 组织管理 -->
  <div class="wrapper">
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="国家/地区:">
          <el-cascader
            ref="areaArr"
            v-model="searchForm.areaNumber"
            :options="countryAreaTree"
            :props="{ checkStrictly: true, value: 'value' }"
            filterable
            clearable
            style="width: 100%"
            placeholder="请选择国家/地区"
            @change="onChange"
          />
        </el-form-item>
        <el-form-item label="组织类型:">
          <el-select v-model="searchForm.orgType" placeholder="请选择" style="width: 100%" clearable>
            <el-option v-for="(item, key) in orgTypeMap" :key="key" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="组织名称:">
          <el-input v-model="searchForm.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 0 0 20px 0px">
      <el-button v-if="hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_ADD')" icon="el-icon-plus" type="primary" @click="handleOptions(1)">新增组织</el-button>
      <el-button v-if="hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_BATCH_IMPORT')" type="primary" icon="el-icon-download" @click="handleOptions(3)">批量导入</el-button>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_BATCH_OPEN')" type="primary" plain @click="handleOptions(4)">批量开启</el-button>
      <el-button v-if="hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_BATCH_CLOSE')" type="primary" plain @click="handleOptions(5)">批量关闭</el-button>
    </div>
    <div>
      <el-table ref="multipleTable" stripe :header-cell-style="{background:'#f7f8fa'}" style="width: 100%;" class="fix-pagination-table" :data="tableData" @sort-change="tableChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="组织名称" prop="name" show-overflow-tooltip />
        <el-table-column label="国家/地区" prop="areaName" show-overflow-tooltip />
        <el-table-column label="组织类型" prop="orgType" width="120">
          <template slot-scope="scope">
            {{ orgTypeFilter(scope.row.orgType) }}
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contact" show-overflow-tooltip />
        <el-table-column label="联系电话" prop="contactPhone" min-width="120" show-overflow-tooltip />
        <el-table-column label="详细地址" prop="address" min-width="110" show-overflow-tooltip />
        <el-table-column label="最后编辑" prop="updateDate" width="160" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :disabled="!hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_EDIT')" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_EDIT')" type="text" @click="handleOptions(2, scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_AREA') && scope.row.orgType == 3" type="text" @click="handleOptions(6, scope.row)">区域</el-button>
            <el-button v-if="hasPermission('MENU_ORGANIZATION_MANAGEMENT_BUTTON_DELETE')" type="text" @click="handleOptions(7,scope.row)">删除</el-button>
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
    <!-- 【新增组织】【编辑组织】 -->
    <modalForm ref="modalForm" :org-type-map="orgTypeMap" @handleSubmit="getTableData" />
    <!-- 【批量导入】 -->
    <importExcel ref="importExcel" @ok="getTableData" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import modalForm from './modalForm.vue'
import importExcel from './importExcel.vue'
export default {
  name: 'Organization',
  components: { modalForm, importExcel },
  data() {
    return {
      searchForm: {
        name: '',
        current: 1,
        rows: 15,
        total: 0,
        order: 'updateDate',
        asc: false
      },
      orgTypeMap: {
        1: '生产企业',
        2: '加工企业',
        3: '经销商'
      },
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ])
  },
  activated() {
    this.getTableData()
  },
  methods: {
    onChange(val) {
      console.log(val)
    },
    orgTypeFilter(type) {
      return this.orgTypeMap[type] || ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    changeStatus(data) {
      this.changeStatusBatch([data.id], data.status)
    },
    changeStatusBatch(ids, status, batch) {
      const param = {
        ids: ids,
        status: status
      }
      this.$backend.request(this.$api.enterprise.putOrganizationStatus, param).then((response) => {
        this.$util.TipsUtils.message(response)
        this.getTableData()
        if (batch) {
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
        }
      })
    },
    handleOptions(type, row) {
      let basicForm
      const h = this.$createElement
      let message = ''
      let status
      let ids
      switch (type) {
        case 1: // 新增组织
          this.$nextTick(() => {
            this.$refs['modalForm'].dialogTitle = '新增组织'
            this.$refs['modalForm'].formVisible = true
          })
          break
        case 2: // 详情
          this.$nextTick(() => {
            this.$refs['modalForm'].dialogTitle = '编辑组织'
            this.$refs['modalForm'].formVisible = true
            basicForm = this.$util.ObjectUtils.deepCopy(row)
            basicForm.orgType = basicForm.orgType.toString() || ''
            basicForm.areaArray = basicForm.areaNumber ? JSON.parse(basicForm.areaNumber) : []
            basicForm.areaArray = basicForm.areaArray.map(item => {
              return item.number
            }) || []
            if (basicForm.countryCode) basicForm.areaArray.unshift(basicForm.countryCode)
            this.$refs['modalForm'].basicForm = basicForm
          })
          break
        case 3: // 批量导入
          this.$refs.importExcel.showExcelDialog = true
          break
        case 4: // 批量开启
        case 5: // 批量关闭
          if (!this.multipleSelection || this.multipleSelection.length === 0) {
            this.$util.TipsUtils.message({ message: '您还没有选择任何记录', success: false, type: 'warning' })
            return
          }
          status = type === 4 ? 1 : 0
          ids = this.multipleSelection.map(item => item.id)
          this.changeStatusBatch(ids, status, true)
          break
        case 6: // 区域
          this.$router.push({ path: '/enterprise/organization/salearea', query: { id: row.id, name: row.name }})
          break
        case 7: // 删除
          message = h('p', { style: 'font-size: 14px' }, [
            h('h4', { style: 'margin:  10px 0;font-size: 18px' }, '确定是否删除？'),
            h('span', null, `正在准备删除“`),
            h('span', { style: 'color: #3369FF' }, row.name),
            h('span', null, '”的数据！如果确认【提交】后，数据不可恢复。')
          ])
          this.$confirm(message, '删除', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.$backend.request(this.$api.enterprise.deleteOrganization, { id: row.id }).then(res => {
              if (res.success) {
                this.getTableData()
              }
              this.$util.TipsUtils.message(res)
            })
          })
          break
      }
    },
    getTableData() {
      this.formVisible = false
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      if (param.areaNumber && param.areaNumber.length === 1) {
        param.countryCode = param.areaNumber[0]
        param.areaNumber = null
      } else if (param.areaNumber && param.areaNumber.length > 0) {
        param.areaNumber = param.areaNumber.pop()
        param.countryCode = null
      } else {
        delete param.areaNumber
        delete param.countryCode
      }
      this.$backend.request(this.$api.enterprise.getOrganization, param).then((response) => {
        this.tableData = response.rows || []
        this.searchForm.total = response.total || 0
      })
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
    close() {
      this.$refs['modalForm'] && this.$refs['modalForm'].close()
      this.formVisible = false
    },
    handleSubmit() {
      this.$nextTick(() => {
        this.$refs.modalForm.handleSubmitLabel()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
 ::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    position: unset;
  }
</style>
