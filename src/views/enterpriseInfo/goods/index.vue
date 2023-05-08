<template>
  <div>
    <!-- class="flex-space-between-form" label-width="84px"-->
    <div class="flex-form-search">
      <el-form ref="searchForm" :model="searchForm">
        <el-form-item label="更新日期：">
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
        <el-form-item label="商品名称：">
          <el-select v-model="searchForm.goodsName" placeholder="请输入" clearable @change="handleSearch" />
        </el-form-item>
        <el-form-item label="品牌：">
          <!-- <el-input v-model="searchForm.brand" placeholder="请输入" clearable/> -->
          <el-select v-model="searchForm.brand" placeholder="请输入" clearable @change="handleSearch" />
        </el-form-item>
        <el-form-item label="规格：">
          <!-- <el-input v-model="searchForm.standard" placeholder="请输入" clearable/> -->
          <el-select v-model="searchForm.standard" placeholder="请输入" clearable @change="handleSearch" />
        </el-form-item>
        <!-- <el-form-item  label-width="0">
            <el-button type="primary" @click="handleSearch" class="el-button-form-two">查询</el-button>
          </el-form-item>           -->
      </el-form>
      <div style="flex-shrink:0;">
        <el-button v-if="hasPermission('MENU_ORG_GOODS_BUTTON_ADD')" type="primary" class="el-button-form-two" @click="handleOptions('',1)">添加</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table style="width: 100%;" :data="tableData" stripe>
        <el-table-column label="序" type="index" />
        <!-- <el-table-column label="商品编号" prop="goodsNumber"/> -->
        <el-table-column label="商品名称" prop="goodsName">
          <template slot-scope="scope">
            <TableCellRender type="string" :cell-data="scope.row" :field="'goodsName'" />
          </template>
        </el-table-column>
        <el-table-column label="HS编码" prop="hsCode" />
        <el-table-column label="生产企业" prop="produceOrg">
          <template slot-scope="scope">
            <TableCellRender type="string" :cell-data="scope.row" :field="'produceOrg'" />
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand" />
        <el-table-column label="规格" prop="standard" />
        <el-table-column label="原产国/地区" prop="counrtyRegionName">
          <template slot-scope="scope">
            <TableCellRender type="string" :cell-data="scope.row" :field="'counrtyRegionName'" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="进口日期" prop="importDate"  width="150"/> -->
        <el-table-column label="最后更新" prop="updateDate" width="150" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <span v-if="hasPermission('MENU_ORG_GOODS_BUTTON_DETAILS')" class="blue-text" style="margin-right: 16px" @click="handleOptions(scope.row,3)">查看</span>
            <span v-if="hasPermission('MENU_ORG_GOODS_BUTTON_EDIT')" class="blue-text" style="margin-right: 16px" @click="handleOptions(scope.row,2)">编辑</span>
            <span v-if="hasPermission('MENU_ORG_GOODS_BUTTON_DELETE')" class="blue-text" @click="handleOptions(scope.row,4)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="searchForm.current"
        :page-sizes="[15,30,50]"
        :page-size="searchForm.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchForm.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="60%" class="custom-dialog">
      <ModalForm v-if="formVisible" ref="modalForm" @handleSubmit="handleSubmitForm" @handleCancel="handleCancelForm" />
      <div slot="footer" class="dialog-footer">
        <el-button class="el-button-confirm-two" @click="close">取 消</el-button>
        <el-button v-if="showBtn" type="primary" :loading="loading" class="el-button-confirm-two" @click="handleSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ModalForm from './modalForm.vue'
import TableCellRender from '../../common/tableCellRender.vue'
import { mapGetters } from 'vuex'
export default {
  components: { ModalForm, TableCellRender },
  data() {
    return {
      searchForm: {
        current: 1,
        rows: 15,
        total: 0,
        updateDate: '',
        goodsName: '',
        brand: '',
        standard: '',
        order: 'updateDate',
        asc: false
      },
      tableData: [],
      formVisible: false,
      dialogTitle: '添加商品',
      loading: false,
      showBtn: true
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  activated() {
    this.getGoodsList()
  },
  methods: {
    // 搜索
    handleSearch() {
      this.searchForm.current = 1
      this.getGoodsList()
    },
    changePick(value) {
      this.searchForm.startSearchDate = value ? value[0] : ''
      this.searchForm.endSearchDate = value ? value[1] : ''
      this.handleSearch()
    },
    // 新增/查看/编辑/删除
    handleOptions(row, type) {
      if (type === 4) { // 删除
        this.$confirm('是否确认删除当前项？', '删除', {
          confirmButtonText: '删 除',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        })
          .then(() => {
            this.$backend.request(this.$api.enterprise.deleteGoods, { id: row.id }).then((response) => {
              this.$util.TipsUtils.message(response)
              if (response.success) this.getGoodsList()
            })
          })
          .catch(() => {})
        return
      }
      this.formVisible = true
      this.showBtn = true
      const that = this
      switch (type) {
        case 1:
          that.dialogTitle = '添加商品'
          that.$nextTick(() => {
            that.$refs['modalForm'].formType = 1
            that.$refs['modalForm'].clear()
          })
          break
        case 2:
          that.dialogTitle = '编辑商品'
          that.$nextTick(() => {
            that.$refs['modalForm'].formType = 2
            that.$refs['modalForm'].basicForm = that.$util.ObjectUtils.deepCopy(row)
            that.$refs['modalForm'].clear()
          })
          break
        case 3:
          that.dialogTitle = '查看商品'
          that.showBtn = false
          that.$nextTick(() => {
            that.$refs['modalForm'].formType = 3
            that.$refs['modalForm'].basicForm = that.$util.ObjectUtils.deepCopy(row)
          })
          break
      }
    },
    // 获取商品列表
    getGoodsList() {
      this.searchForm.orgId = this.userInfo.orgId
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.enterprise.getGoodsList, param).then((response) => {
        this.tableData = response.rows || []
        this.searchForm.total = response.total
      })
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getGoodsList()
    },
    close() {
      const that = this
      that.$nextTick(() => {
        that.$refs['modalForm'] && that.$refs['modalForm'].close()
        // that.formVisible = false
      })
    },
    handleCancelForm() {
      this.formVisible = false
    },
    // 提交成功
    handleSubmitForm() {
      this.formVisible = false
      this.getGoodsList()
    },
    handleSubmit() {
      this.$refs.modalForm.submit()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
