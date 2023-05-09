<template>
  <div>
    <div>
      <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" label-position="right">
        <el-form-item label="产品类型：" prop="type">
          <el-radio-group v-model="basicForm.type" @change="handleChangeType">
            <el-radio label="0">原料</el-radio>
            <el-radio label="1">加工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="currentType==='1'" label="产品名称: " prop="productId">
          <el-select v-model="basicForm.productId">
            <el-option
              v-for="item in prodoctList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentType==='0'" label="原料名称: " prop="productId">
          <el-select v-model="basicForm.productId">
            <el-option
              v-for="item in materailList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期：" prop="productionDate">
          <el-date-picker
            v-model="basicForm.productionDate"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="生产批次号: " prop="batchNo">
          <el-input v-model="basicForm.batchNo" maxlength="20" placeholder="请输入" clearable style="width:60%" />
        </el-form-item>
        <el-form-item label="成品率: " prop="yield">
          <el-input v-model="basicForm.yield" maxlength="6" placeholder="请输入" clearable style="width:60%" />
          <span>%</span>
          <div>请输入数值,小数点保留2位</div>
        </el-form-item>
        <el-form-item v-if="currentType==='1'" label="原料批次: " prop="materialBatchs">
          <section v-if="selectedData.length>0">
            <span v-for="item in selectedData" :key="item.id" style="border: 1px solid #dcdfe6; padding:5px; margin-right:5px">{{ item.batchNo }} </span>
          </section>
          <el-button @click="showMaterailModal">+</el-button>
          <div>已选标签<b class="blue-text">{{ counter }}</b>总使用量<b class="blue-text">{{ useTotalWeight }}</b>克</div>
        </el-form-item>
        <el-form-item v-if="currentType==='1'" label="标签上限: ">
          <span class="blue-text">{{ counter }}</span>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="原料批次"
      :visible.sync="materialVisible"
      width="80%"
      :close-on-click-modal="false"
      append-to-body
    >
      <section>
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="选择原料" />
          <el-step title="配置重量" />
        </el-steps>
        <section v-if="active!=1">
          <div style="padding:20px">
            <el-button type="primary" plain @click="selectedAllLabel">选择全部标签</el-button>
            <el-button plain @click="cancelSelelected">取消全部</el-button>
            <el-input v-model="searchForm.name" placeholder="请输入产品名称" style="width:200px" />
            <el-button type="primary" @click="searchList">查询</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="index" width="50" />
            <el-table-column label="原料原产国" prop="countryName" width="160" show-overflow-tooltip />
            <el-table-column label="企业" prop="orgName" width="220" show-overflow-tooltip />
            <el-table-column label="原料名称" prop="productName" show-overflow-tooltip />
            <el-table-column label="批次" prop="batchNo" width="140" show-overflow-tooltip />
            <el-table-column label="条码" prop="productCode" width="200" show-overflow-tooltip />
            <el-table-column label="标签" prop="quantity" width="140" show-overflow-tooltip />
            <el-table-column label="重量" width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.quantity * scope.row.productWeight }}{{ scope.row.productWeightType===2? 'kg':'g' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余重量" prop="code" width="130" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.surplusweight }}g</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="code" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="setRowMaterail(scope.row)">{{ scope.row.isChange ? '设为原料':'取消原料' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :current-page="searchForm.current"
            :page-sizes="[10]"
            :page-size="searchForm.rows"
            layout="total, prev, next"
            :total="searchForm.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <div class="btnContent">
            <el-badge :value="selectedData.length" class="item">
              <el-button type="primary" :disabled="selectedData.length<=0" @click="nextStep">下一步</el-button>
            </el-badge>
            <el-button style="margin-left:20px" type="plain" @click="cancelStepOne">取消</el-button>
          </div>
        </section>
        <section v-if="active!=0" style="margin-top:20px">
          <el-table
            :data="selectedData"
            tooltip-effect="dark"
            style="width: 100%"
            :visible.sync="materialVisible"
          >
            <el-table-column type="index" width="55" />
            <el-table-column label="原料原产国" prop="countryName" width="160" show-overflow-tooltip />
            <el-table-column label="企业" prop="orgName" width="180" show-overflow-tooltip />
            <el-table-column label="原料名称" prop="productName" show-overflow-tooltip />
            <el-table-column label="批次" prop="batchNo" width="120" show-overflow-tooltip />
            <el-table-column label="条码" prop="productCode" width="200" show-overflow-tooltip />
            <el-table-column label="标签" prop="quantity" width="140" show-overflow-tooltip />
            <el-table-column label="重量" width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.quantity * scope.row.productWeight }}{{ scope.row.productWeightType===2? 'kg':'g' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余重量" prop="surplusweight" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.surplusweight }}g</span>
              </template>
            </el-table-column>
            <el-table-column width="230" label="使用重量" prop="useWeight" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <el-input-number v-model="scope.row.useWeight" controls-position="right" :min="1" :max="scope.row.surplusweight" />g -->
                <el-input v-model="scope.row.useWeight" minlength="1" maxlength="9" :max="scope.row.surplusweight" oninput="value=value.replace(/[^\d]|^[0]/g,'')">
                  <template slot="append">g</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="code" width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteSelected(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="btnContent">
            <el-button type="primary" :disabled="isSubmitBatch" @click="handleSubmitBatchInfo">确定</el-button>
            <el-button plain :disabled="selectedIds.length<=0" @click="preStep">上一步</el-button>
          </div>
        </section>
      </section>
    </el-dialog>
    <!-- <MaterailModal ref="materailModal" /> -->
  </div>

</template>

<script>
import { verifyBatchNo } from '../../../utils/validate'
// import MaterailModal from './materailModal.vue'
export default {
  name: 'CreateOrEdit',
  // components: { MaterailModal },
  data() {
    return {
      searchForm: {
        current: 1,
        rows: 10,
        total: 0,
        categoryId: '',
        updateDate: '',
        name: '',
        code: '',
        endDate: '',
        startDate: '',
        order: 'updateDate',
        asc: false,
        materialBatch: true
      },
      tableData: [],
      visible: false,
      materialVisible: false,
      basicForm: {
        productId: '',
        type: '0',
        productionDate: '',
        batchNo: '',
        yield: '',
        materialBatchs: []
      },
      basicFormRules: {
        type: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
        productId: [{ required: true, message: '请选择产品', trigger: ['blur', 'change'] }],
        productionDate: [{ required: true, message: '请选择生产日期', trigger: ['blur', 'change'] }],
        batchNo: [{ required: true, message: '请输入批次号', trigger: ['blur', 'change'] }],
        yield: [{ required: true, message: '请输入成品率', trigger: ['blur', 'change'] },
          { validator: verifyBatchNo, trigger: ['blur', 'change'] }
        ]
      },
      prodoctList: [],
      materailList: [],
      fileForm: {
        goodPic: [],
        introPic: []
      },
      fileFormRules: {},
      formType: '1', // 1新增，2编辑
      currentId: '',
      selectLoading: false,
      countryAreaTree: [],
      materialArr: [],
      productIntro: 'second',
      selectedIds: [],
      active: 0,
      selectedData: [],
      currentType: '0',
      isSubmitBatch: false,
      counter: 0,
      useTotalWeight: 0,
      reviwSelected: [],
      currentItem: {}
    }
  },
  methods: {
    // 取消
    cancelStepOne() {
      this.visible = false
      this.materialVisible = false
      if (JSON.stringify(this.currentItem) === '{}') {
        this.selectedIds = []
        this.reviwSelected = []
        this.selectedData = []
      } else {
        this.getBatchDetail(this.currentItem)
      }
    },
    // 查询
    searchList() {
      this.searchForm.current = 1
      this.getMaterialPage()
    },
    // 取消全部选中
    cancelSelelected() {
      this.selectedData = []
      this.selectedIds = []
      this.reviwSelected = []
      this.tableData.map((item) => {
        item.isChange = true
      })
    },
    // 全部选中
    selectedAllLabel() {
      this.tableData.map((item) => {
        item.isChange = false
      })
      this.selectedData = this.tableData
      this.selectedIds = this.tableData
      this.reviwSelected = this.tableData
    },
    // 设为原料
    setRowMaterail(row) {
      if (row.isChange) {
        this.selectedIds.push(row)
      } else {
        this.selectedIds = this.selectedIds.filter((item) => item.id !== row.id)
      }
      const map = new Map()
      for (const item of this.selectedIds) {
        if (!map.has(item.id)) {
          map.set(item.id, item)
        }
      }
      this.selectedData = [...map.values()]
      row.isChange = !row.isChange
    },
    // 确定批次信息
    handleSubmitBatchInfo() {
      const newArr = []
      this.useTotalWeight = 0
      this.selectedData.map((item) => {
        this.useTotalWeight += parseInt(item.useWeight)
        newArr.push({ materialBatchId: item.id, useWeight: item.useWeight })
      })
      this.reviwSelected = this.selectedData
      this.selectedIds = this.selectedData
      this.basicForm.materialBatchs = newArr
      this.counter = newArr.length
      this.visible = false
      this.active = 0
      this.materialVisible = false
    },
    // 获取批次详情
    getBatchDetail(item) {
      this.currentItem = item
      this.formType = '2'
      this.$backend.request(this.$api.traceabilityInfo.getBatchDetail, { id: item.id }).then((response) => {
        if (response.success) {
          const type = response.data.type.toString()
          if (type === '0') {
            this.getMaterailFuzzy()
          } else {
            this.getProductFuzzy()
          }

          this.basicForm = response.data
          this.counter = response.data.materialBatchs.length
          this.basicForm.type = type
          this.currentType = type
          const newArr = []
          let weight = 0
          this.reviwSelected = []
          this.selectedData = []
          response.data.materialBatchs.map((newObj) => {
            this.tableData.filter((item) => {
              if (item.id === newObj.materialBatchId) {
                newArr.push(item)
                weight += parseInt(newObj.useWeight)
              }
            })
          })
          this.useTotalWeight = weight
          this.selectedIds = newArr
          this.selectedData = newArr
          this.reviwSelected = newArr
        }
      })
    },
    // 选择原料或产品
    handleChangeType(val) {
      this.currentType = val.toString()
      this.basicForm.productId = ''
      if (val === '1') {
        this.getProductFuzzy()
      } else {
        this.getMaterailFuzzy()
      }
    },
    // 删除
    deleteSelected(row) {
      let arr = []
      arr = this.selectedData
      arr.splice(arr.findIndex(item => item.id === row.id), 1)
      this.selectedData = arr
      row.isChange = !row.isChange
      if (this.selectedData.length > 0) {
        this.isSubmitBatch = false
      } else {
        this.isSubmitBatch = true
      }
    },
    // 上一步
    preStep() {
      this.active--
      this.isSubmitBatch = false
    },
    // 下一步
    nextStep() {
      if (this.active++ > 1) this.active = 0
    },
    // 获取产品信息
    getProductFuzzy() {
      this.$backend.request(this.$api.traceabilityInfo.getProductFuzzy, { name: '' }).then((response) => {
        this.prodoctList = response.data
      })
    },
    // 获取批次信息
    getMaterailFuzzy() {
      this.$backend.request(this.$api.traceabilityInfo.getMaterialFuzzy, { name: '' }).then((response) => {
        this.materailList = response.data
      })
    },
    showMaterailModal() {
      this.materialVisible = true
      this.$nextTick(() => {
        this.tableData = []
        console.log('showMaterailModal', this.reviwSelected)
        this.getMaterialPage()
      })
    },
    handleSubmit() {
      this.$refs['basicForm'].validate(valid => {
        let url = ''
        if (this.formType === '1') {
          url = this.$api.traceabilityInfo.addBatchInfo
        } else {
          url = this.$api.traceabilityInfo.editBatchInfo
        }
        const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
        param.yield = parseFloat(param.yield)
        param.type = parseInt(param.type)
        // for (const item in param) {
        //   if (this.$util.StringUtils.isArray(param[item])) {
        //     param[item] = param[item].pop()
        //   }
        // }
        if (valid) {
          const that = this
          that.$backend.request(url, param).then((response) => {
            that.$util.TipsUtils.message(response)
            that.clear()
            that.$emit('refreshList')
          })
        } else {
          this.$emit('error')
          return false
        }
      })
    },

    clear() {
      this.$nextTick(() => {
        this.currentType = '0'
        this.selectedIds = []
        this.selectedData = []
        this.reviwSelected = []
        this.active = 0
        this.basicForm.type = '0'
        this.counter = 0
        this.useTotalWeight = 0
        this.basicForm.materialBatchs = []
        this.$refs['basicForm'] && this.$refs['basicForm'].clearValidate()
        this.$refs['basicForm'].resetFields()
        this.$forceUpdate()
      })
    },
    getMaterialPage() {
      const param = this.$util.ObjectUtils.deepCopy(this.searchForm)
      delete param.updateDate
      this.$backend.request(this.$api.traceabilityInfo.getBatchPage, param).then((response) => {
        if (response.success) {
          let newArr = []
          newArr = response.data.records || []
          this.searchForm.total = response.data.total
          //  this.tableData = {...newArr, isChange:true}
          newArr.map((item) => {
            item.isChange = true
            if (this.selectedData.length > 0) {
              this.selectedData.map((cur) => {
                if (item.id === cur.id) { // 已经设为原料
                  item.isChange = false // 设置为取消
                }
              })
            }
          })
          this.tableData = newArr
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.rows = val
      this.getMaterialPage()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.getMaterialPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.btnContent{
  margin: 20px;
}
::v-deep .el-form-item--medium .el-form-item__label{
  font-weight: normal;
  padding: 0px;
}
  ::v-deep .el-form-item .el-input--medium .el-input__inner{
    width: 100%
  }
 ::v-deep  .el-input--medium .el-input__inner{
   height: 36px;
   line-height: 36px;
 }
  ::v-deep .el-form-item__error{
  position: unset;
  margin-top: 0px;
}
::v-deep .el-form-item--medium .el-form-item__label{
  margin-right: 10px;
}
::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before{
  position: unset;
}
.row-title-tips{
  font-size: 14px;
  color: #C3C3C3;
  display: inline-block;
}
.el-steps--simple{
  width: 50%;
}
</style>
