<template>
  <div>
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="分类检索：">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable @change="handleChangeType">
            <el-option label="全部" value="" />
            <el-option label="产品" value="1" />
            <el-option label="原料" value="0" />
          </el-select>
          <el-cascader
            v-if="searchForm.type==='0'"
            v-model="searchForm.categoryId"
            :options="materialArr"
            filterable
            clearable
            placeholder="请选择"
          />
          <el-cascader
            v-if="searchForm.type==='1'"
            v-model="searchForm.categoryId"
            :options="productArr"
            filterable
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="属性名称：">
          <el-input v-model="searchForm.name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px">
      <el-button v-if="hasPermission('MENU_PRODUCT_ATTRIBUTE_BUTTON_ADD')" type="primary" icon="el-icon-plus" @click="handleAddProAttr">新增属性</el-button>
    </div>
    <div class="fix-pagination-btn">
      <el-button v-if="hasPermission('MENU_PRODUCT_ATTRIBUTE_BUTTON_BATCH_OPEN')" type="primary" plain @click="handleChangeSatus(1)">批量开启</el-button>
      <el-button v-if="hasPermission('MENU_PRODUCT_ATTRIBUTE_BUTTON_BATCH_DISABLED')" type="primary" plain @click="handleChangeSatus(2)">批量禁用</el-button>
      <el-button v-if="hasPermission('MENU_PRODUCT_ATTRIBUTE_BUTTON_BATCH_DELETE')" type="primary" plain @click="handleBatchDelete">批量删除</el-button>
    </div>
    <div class="table-content">
      <el-table
        v-if="hasPermission('MENU_PRODUCT_ATTRIBUTE_BUTTON_LIST')"
        style="width: 100%;"
        class="fix-pagination-table"
        :data="tableData"
        stripe
        :header-cell-style="{background:'#f7f8fa'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" show-overflow-tooltip />
        <el-table-column label="排序" prop="sort" width="150" show-overflow-tooltip />
        <el-table-column label="属性名称" prop="name" width="150" show-overflow-tooltip />
        <el-table-column label="产品类型" prop="type" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.type===0">原料</span>
            <span v-if="scope.row.type===1">产品</span>
          </template>
        </el-table-column>
        <el-table-column label="归属分类" prop="categoryName" width="150" show-overflow-tooltip />
        <el-table-column label="必填" prop="attr" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.attr.isrequired==='0'">必填</span>
            <span v-if="scope.row.attr.isrequired==='1'">非必填</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="attr" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.attr.arrType==='1'">单选</span>
            <span v-if="scope.row.attr.arrType==='2'">复选</span>
            <span v-if="scope.row.attr.arrType==='3'">单行文本</span>
          </template>
        </el-table-column>
        <el-table-column label="属性值" prop="attr" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.attr.attrValue.toString() }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="180" show-overflow-tooltip />
        <el-table-column label="最后编辑" prop="updateDate" width="180" show-overflow-tooltip />
        <el-table-column label="状态" prop="orderNo" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable" @change="handleChangeSingleStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="orderNo" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="hasPermission('MENU_PRODUCT_ATTRIBUTE_BUTTON_EDIT')" type="text" @click="handleAddAttr(scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('MENU_PRODUCT_ATTRIBUTE_BUTTON_DELETE')" type="text" @click="handleDeleteSingle(scope.row)">删除</el-button>
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
    <FormModal ref="formadalRef" @refreshList="getProductAttrPage" />
  </div>
</template>

<script>
import FormModal from './formModal.vue'
export default {
  components: { FormModal },
  data() {
    return {
      searchForm: {
        type: '',
        name: '',
        categoryId: [],
        order: 'updateDate',
        asc: false,
        current: 1,
        rows: 15,
        total: 0
      },
      tableData: [],
      selectedIds: [],
      productArr: [],
      materialArr: []
    }
  },
  activated() {
    this.getProductAttrPage()
    this.materialCategory()
  },
  methods: {
    // 回去分页列表
    getProductAttrPage() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      if (this.$util.StringUtils.isArray(param.categoryId)) {
        param.categoryId = param.categoryId.pop()
      }
      this.$backend.request(this.$api.basicSetting.getProductAttrPage, param).then((response) => {
        if (response.success) {
          this.tableData = response.data.records || []
          this.tableData.forEach((item) => {
            item.attr = JSON.parse(item.attr)
          })
          this.searchForm.total = response.data.total
        }
      })
    },
    // 点击新增产品属性
    handleAddProAttr() {
      this.$nextTick(() => {
        this.$refs.formadalRef.formType = 1
        this.$refs.formadalRef.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.formadalRef.clear()
        })
      })
    },
    // 编辑产品属性
    handleAddAttr(row) {
      this.$nextTick(() => {
        this.$refs.formadalRef.formType = 2
        this.$refs.formadalRef.currentTitle = '编辑属性'
        this.$refs.formadalRef.dialogVisible = true
        this.$refs.formadalRef.getAttrInfo(row)
      })
    },
    // 批量选择
    handleSelectionChange(val) {
      const arr = []
      val.forEach((item) => {
        arr.push(item.id)
      })
      this.selectedIds = arr
    },
    // 单个删除
    handleDeleteSingle(row) {
      this.messageTips('确定删除吗？', '删除', row.name, '数据不可恢复', 1).then(() => {
        const param = [row.id]
        this.handleDelete(param)
      }).catch({})
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        const param = this.selectedIds
        this.handleDelete(param)
      }
    },
    handleDelete(param) {
      this.messageTips('确定要批量删除吗？', '批量删除', this.selectedIds.length + '条', '数据不可恢复', 1).then(() => {
        this.$backend.request(this.$api.basicSetting.deleteAttrBatch, param).then((response) => {
          this.$util.TipsUtils.message(response)
          this.getProductAttrPage()
        })
      })
    },
    // 单个行开启/禁用
    handleChangeSingleStatus(row) {
      this.$confirm('确定要修改状态吗?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        const param = {
          ids: [row.id],
          status: row.enable
        }
        this.startOrStop(param)
      }).catch(() => {
        this.getProductAttrPage()
      })
    },
    // 批量开启/禁用
    handleChangeSatus(val) {
      if (this.selectedIds.length < 1) {
        this.$message({
          message: '请先选择要执行批量操作的记录',
          type: 'warning'
        })
        return
      } else {
        if (val === 1) {
          const param = {
            ids: this.selectedIds,
            status: true
          }
          this.startOrStop(param)
        } else {
          const param = {
            ids: this.selectedIds,
            status: false
          }
          this.startOrStop(param)
        }
      }
    },
    startOrStop(param) {
      this.$backend.request(this.$api.basicSetting.changeAttrBatchStatus, param).then((response) => {
        this.$util.TipsUtils.message(response)
        this.getProductAttrPage()
      })
    },
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getProductAttrPage()
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getProductAttrPage()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getProductAttrPage()
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
    // 获取原料类别
    materialCategory() {
      this.$backend.request(this.$api.traceabilityInfo.productCategory, { type: 1 }).then((response) => {
        if (response.success) {
          this.materialArr = response.data
          this.$util.ObjectUtils.assignValue(
            this.materialArr,
            'name',
            'id',
            'child'
          )
        }
      })
    },
    // 选择原料或产品
    handleChangeType(val) {
      this.currentType = val.toString()
      if (val === '0') {
        this.materialCategory()
      } else {
        this.productCategory()
      }
    }
  }
}
</script>

<style>

</style>
