<template>
  <el-dialog :title="formType == 2 ? '详情' : formType == 1 ? receiveFlag ? '发货' : '新增发货' : '修改发货'" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
    <div slot="footer" class="dialog-footer">
      <el-button v-if="formType !== 2" @click="close">取 消</el-button>
      <el-button v-if="formType !== 2" type="primary" :loading="loading" @click="handleSubmit">提 交</el-button>
      <el-button v-if="hasPermission('MENU_DELIVERY_RECORD_BUTTON_EDIT') && !receiveFlag && formType === 2 && basicForm.status === 1" type="primary" @click="formType = 3">修 改</el-button>
    </div>
    <el-form ref="basicForm" :model="basicForm" :class="{'el-form-margin-none':formType === 2}" label-width="120px" :rules="formType === 2 ? {} : basicFormRules" label-position="right">
      <el-form-item v-if="!receiveFlag" label="产品类型：" prop="type">
        <p v-if="formType === 2">{{ basicForm.productTypeDesc }}</p>
        <el-radio-group v-else v-model="basicForm.type" @change="changeType">
          <el-radio label="0">原料</el-radio>
          <el-radio label="1">加工</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="formType === 2 || receiveFlag" label="产品名称：">
        <p>{{ basicForm.productName }}</p>
      </el-form-item>

      <el-form-item v-if="basicForm.type == 1 && formType !== 2 && !receiveFlag" ref="productRef" label="产品名称：" prop="productId">
        <!-- 加工 -->
        <el-select v-model="basicForm.productId" filterable placeholder="请选择" style="width: 100%" clearable @change="changeProduct">
          <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="basicForm.type == 0 && formType !== 2 && !receiveFlag" ref="materailRef" label="产品名称：" prop="productId">
        <!-- 原料 -->
        <el-select v-model="basicForm.productId" filterable placeholder="请选择" style="width: 100%" clearable @change="changeProduct">
          <el-option v-for="item in materailList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="formType !== 2" ref="batchIdsRef" label="选择批次：" prop="batchIds">
        <el-select v-model="basicForm.batchIds" multiple :disabled="receiveFlag" placeholder="请选择" style="width: 100%" clearable @change="getOrgBodyCode">
          <el-option v-for="item in batchListFilter" :key="item.id" :label="item.batchNo" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="formType === 2 ? (receiveFlag ? '发货方：' : '经销商：' ): '选择经销商：'" prop="orgName">
        <p v-if="formType === 2">{{ receiveFlag ? basicForm.shipping : basicForm.dealerName }}</p>
        <el-select
          v-else
          ref="inputSelect"
          v-model="basicForm.orgName"
          filterable
          placeholder="请输入"
          style="width: 100%"
          clearable
          @change="changeOrgName"
          @blur="blurOrgName"
        >
          <el-option v-for="item in orgNameList" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号：" prop="shippingNo">
        <p v-if="formType === 2">{{ basicForm.shippingNo }}</p>
        <el-input v-else v-model="basicForm.shippingNo" placeholder="请输入" maxlength="20" clearable @blur="basicForm.shippingNo = basicForm.shippingNo.trim()" />
      </el-form-item>
      <el-form-item label="发货时间：" prop="deliverTime">
        <p v-if="formType === 2">{{ basicForm.shippingDate ? basicForm.shippingDate.split(' ')[0] : '' }}</p>
        <el-date-picker
          v-else
          v-model="basicForm.deliverTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间"
        />
      </el-form-item>
      <el-form-item v-if="receiveFlag && formType === 2 && basicForm.status == 2" label="收货时间：" prop="receiptTime">
        <p>{{ basicForm.receiptTime }}</p>
      </el-form-item>
      <el-form-item v-if="receiveFlag && formType === 2" label="操作人：" prop="receipt">
        <p>{{ basicForm.receipt }}</p>
      </el-form-item>
      <el-form-item v-if="receiveFlag && formType === 2" label="状态：">
        <p>{{ basicForm.statusDesc }}</p>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <p v-if="formType === 2">{{ basicForm.remark }}</p>
        <el-input v-else v-model="basicForm.remark" type="textarea" placeholder="请输入" maxlength="200" clearable @blur="basicForm.remark = basicForm.remark.trim()" />
      </el-form-item>
      <el-form-item v-if="formType !== 2" ref="labelsFrom" label="标签信息：" prop="codes">
        <div class="labels-form-item">
          <el-input v-show="false" :value="basicForm.codes && basicForm.codes.join('')" />
          <el-input v-model="labels.minTpid" placeholder="请输入起始值" style="width: 180px" maxlength="16" clearable @blur="blurMinTpid" @input="inputTpid" />
          <span>~</span>
          <el-input v-model="labels.maxTpid" placeholder="请输入终止值" style="width: 180px" maxlength="16" clearable @blur="blurMaxTpid" @input="inputTpid" />
          <i class="el-icon-check" @click="saveTpid" />
          <i class="el-icon-close" @click="clearTpid" />
        </div>
      </el-form-item>
      <el-form-item v-if="formType !== 2">
        <div v-if="basicForm.codes && basicForm.codes.length > 0" class="labels-form-all">
          <p v-for="(item, index) in basicForm.codes" :key="index">
            <span> {{ item.code }}</span>
            <span style="margin: 0 10px;"> {{ (currentProduct.weight || 0) }}g </span>
            <i style="cursor:pointer" class="el-icon-close" @click="handleDeleteLabel(index)" />
          </p>
        </div>
        <p>已选{{ basicForm.codes.length || 0 }}个标签，总重量：{{ (currentProduct.weight || 0) * basicForm.codes.length }}g</p>
        <p v-if="receiveFlag">剩余/总重量：{{ basicForm.totalWeight - (currentProduct.weight || 0) * basicForm.codes.length }}g/{{ basicForm.totalWeight || 0 }}g</p>
      </el-form-item>
    </el-form>
    <div v-if="formType === 2" style="overflow:hidden;max-height: 500px;overflow-y:auto;">
      <div class="labels-form-all">
        <p>
          <span style="display:inline-block;width: 35%"> 批次号 </span>
          <span style="display:inline-block;width: 35%"> 标签追溯码值 </span>
          <span style="display:inline-block;width: 25%;"> 重量 </span>
        </p>
        <p v-for="(item, index) in basicForm.codes" :key="index">
          <span style="display:inline-block;width: 35%"> {{ item.batchNo }}</span>
          <span style="display:inline-block;width: 35%"> {{ item.code }}</span>
          <span style="display:inline-block;width: 25%;"> {{ (item.weight || 0) }}g </span>
        </p>
      </div>
      <p style="margin: 10px 0;">已选{{ basicForm.codes.length || 0 }}个标签，总重量：{{ basicForm.totalWeight }}g</p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalForm',
  props: {
    productList: { // 产品名称集合
      type: Array,
      default: () => []
    },
    materailList: { // 原料产品名称集合
      type: Array,
      default: () => []
    },
    orgNameList: { // 经销商集合
      type: Array,
      default: () => []
    },
    receiveFlag: { // true收货列表的弹框, false发货列表的弹框
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formVisible: false,
      basicForm: {
        type: '0',
        codes: []
      },
      basicFormRules: {
        type: [{ required: true, message: '请选择产品类型', trigger: ['change', 'blur'] }],
        productId: [{ required: true, validator: this.validatorProductId, trigger: ['change', 'blur'] }],
        batchIds: [{ required: true, message: '请选择批次', trigger: ['change', 'blur'] }],
        orgName: [{ required: true, message: '请输入经销商', trigger: ['change', 'blur'] }],
        shippingNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
        deliverTime: [{ required: true, message: '请选择发货时间', trigger: ['change', 'blur'] }],
        codes: [{ required: true, validator: this.validatorLabels, trigger: ['change', 'blur'] }]
      },
      loading: false,
      labels: {
        minTpid: '',
        maxTpid: ''
      },
      labelsList: [],
      currentProduct: {},
      batchList: [], // 批次号集合
      submitValidate: false,
      formType: 1, // 1新增 2详情 3修改
      orgBodyCodes: [] // 主体码（转发货单主体码可能会存在不一样的）
    }
  },
  computed: {
    batchListFilter() { // 过滤下重复批次
      const arr = []
      this.batchList.forEach(item => {
        const index = arr.findIndex(ele => ele.id === item.id)
        if (index < 0) {
          arr.push(item)
        }
      })
      return arr
    }
  },
  mounted() {
  },
  methods: {
    getOrgBodyCode() {
      this.orgBodyCodes = []
      const data = this.batchList.filter(item => {
        return this.basicForm.batchIds.includes(item.id)
      })
      data.forEach(item => {
        const code = item.startSegment.slice(0, 6)
        if (!this.orgBodyCodes.includes(code)) {
          this.orgBodyCodes.push(code)
        }
      })
    },
    handleDeleteLabel(index) {
      this.basicForm.codes.splice(index, 1)
      this.inputTpid()
    },
    validatorProductId(rule, value, callback) {
      if (this.basicForm.productId) {
        return callback()
      } else {
        return callback(new Error('请选择产品名称'))
      }
    },
    validatorLabels(rule, value, callback) {
      if (this.submitValidate) { // 提交时的校验
        if (this.basicForm.codes && this.basicForm.codes.length > 0) {
          return callback()
        }
      }
      if (!this.orgBodyCodes || this.orgBodyCodes.length === 0) {
        this.$refs.basicForm.validateField(['productId', 'batchIds'], (errorMsg) => {
          if (errorMsg) {
            return new Error('')
          }
        })
      }
      if (!this.labels.minTpid) {
        return callback(
          new Error('请输入起始值')
        )
      }
      if (!this.labels.maxTpid) {
        return callback(
          new Error('请输入终止值')
        )
      }
      if (this.labels.minTpid.length !== 16 || this.labels.maxTpid.length !== 16) {
        return callback(
          new Error('请输入16位码值')
        )
      }
      const minTpidCode = this.labels.minTpid.slice(0, 6)
      const maxTpidcode = this.labels.maxTpid.slice(0, 6)
      if (minTpidCode !== maxTpidcode || !this.orgBodyCodes.includes(minTpidCode) || !this.orgBodyCodes.includes(maxTpidcode)) {
        return callback(
          new Error('请输入正确的追溯码值')
        )
      }
      const minTpid = parseInt(this.labels.minTpid.slice(6, 16))
      const maxTpid = parseInt(this.labels.maxTpid.slice(6, 16))
      if (((maxTpid - minTpid) > 1000)) {
        return callback(
          new Error('最多输入1000个码值')
        )
      } else if (maxTpid < minTpid) {
        return callback(
          new Error('终止值不能小于起始值')
        )
      } else {
        return callback()
      }
    },
    blurMinTpid() {
      const str = this.labels.minTpid.match(/\d+(.\d+)?/g)
      this.labels.minTpid = str ? str.join('') : ''
    },
    blurMaxTpid() {
      const str = this.labels.maxTpid.match(/\d+(.\d+)?/g)
      this.labels.maxTpid = str ? str.join('') : ''
    },
    validTpid(callBack) {
      this.$refs.basicForm.validateField('codes', (errorMsg) => {
        if (errorMsg) {
          callBack(false)
        } else {
          callBack(true)
        }
      })
    },
    inputTpid() {
      this.$nextTick(() => {
        this.$refs.labelsFrom.validateMessage = ''
        this.$refs.labelsFrom.clearValidate()
      })
    },
    saveTpid() {
      this.validTpid((flag) => {
        if (flag) {
          const minTpidCode = this.labels.minTpid.slice(0, 6)
          // const maxTpidcode = this.labels.maxTpid.slice(0, 6)
          const minTpid = parseInt(this.labels.minTpid.slice(6, 16))
          const maxTpid = parseInt(this.labels.maxTpid.slice(6, 16))
          let tmpFlag = true
          for (let tpid = minTpid; tpid <= maxTpid; tpid++) {
            let max = this.$util.ObjectUtils.prefixInteger(tpid, 10)
            max = minTpidCode + max
            const batchId = this.getBatchIdByCode(max)
            if (!batchId) {
              tmpFlag = false
            }
          }
          if (!tmpFlag) { // 码值不属于选择的批次
            this.$util.TipsUtils.message({ type: 'warning', message: '录入标签不在选中批次中' })
            return
          }
          for (let tpid = minTpid; tpid <= maxTpid; tpid++) {
            let max = this.$util.ObjectUtils.prefixInteger(tpid, 10)
            max = minTpidCode + max
            const batchId = this.getBatchIdByCode(max)
            const codeIndex = this.basicForm.codes.findIndex(item => item.code === max)
            if (codeIndex < 0 && batchId) {
              if (this.basicForm.codes.length >= 10000) {
                this.$util.TipsUtils.message({ type: 'warning', message: '最多允许添加10000个标签' })
                return
              } else {
                this.basicForm.codes.push({
                  batchId: batchId,
                  code: max
                })
              }
            }
          }
          // this.labelsList.push({
          //   start: this.$util.ObjectUtils.prefixInteger(minTpid, 16),
          //   end: this.$util.ObjectUtils.prefixInteger(maxTpid, 16)
          // })
          this.clearTpid()
        }
      })
    },
    clearTpid() {
      this.labels.minTpid = ''
      this.labels.maxTpid = ''
      this.$nextTick(() => {
        this.$refs.labelsFrom.clearValidate()
      })
    },
    // 根据码值获取码值所属的批次Id
    getBatchIdByCode(code) {
      const codeTagBody = code.slice(0, 6)
      const codeTag = parseInt(code.slice(6, 16))
      // 已选择的批次
      const selectBatchList = this.batchList.filter(item => this.basicForm.batchIds.includes(item.id))
      const data = selectBatchList.find(item => {
        const startSegment = parseInt(item.startSegment.slice(6, 16))
        const endSegment = parseInt(item.endSegment.slice(6, 16))
        const startBody = item.startSegment.slice(0, 6)
        // const endBody = item.endSegment.slice(0, 6)
        return codeTag >= startSegment && codeTag <= endSegment && codeTagBody === startBody
      })
      return data ? data.id : false
    },
    changeType(val) {
      this.basicForm.productId = ''
      this.basicForm.batchIds = []
      this.basicForm.codes = []
      this.$nextTick(() => {
        this.$refs.basicForm.clearValidate()
      })
    },
    changeProduct(val) {
      this.currentProduct = {}
      this.basicForm.batchIds = []
      this.basicForm.codes = []
      if (this.basicForm.type === '0') {
        this.currentProduct = this.materailList.find(item => item.id === val) || {}
      } else {
        this.currentProduct = this.productList.find(item => item.id === val) || {}
      }
      if (!val) {
        this.batchList = []
        return
      }
      if (this.currentProduct && this.currentProduct.batchList) {
        this.batchList = this.currentProduct.batchList
        return
      }
      this.$backend.request(this.$api.traceabilityInfo.getBatchByProduct, { id: val }).then((response) => {
        if (response.success) {
          this.batchList = response.data || []
        }
      })
    },
    changeOrgName(val) {
      this.$set(this.basicForm, 'orgName', val)
    },
    blurOrgName(e) {
      if (e.target.value) {
        const name = e.target.value.trim()
        this.$set(this.basicForm, 'orgName', name || '')
      }
    },
    handleSubmit() {
      this.submitValidate = true
      this.$refs['basicForm'].validate(valid => {
        this.submitValidate = false
        if (this.basicForm.codes && this.basicForm.codes.length > 0) {
          this.inputTpid()
        } else {
          this.$util.TipsUtils.message({ type: 'warning', message: '请添加标签信息' })
          return
        }
        if (valid) {
          this.loading = true
          let url
          const codes = this.basicForm.codes.map(item => {
            return {
              batchId: item.batchId,
              code: item.code
            }
          })
          const param = {
            type: this.basicForm.type,
            productId: this.basicForm.productId,
            batchIds: this.basicForm.batchIds,
            orgName: this.basicForm.orgName,
            shippingNo: this.basicForm.shippingNo,
            deliverTime: this.basicForm.deliverTime,
            remark: this.basicForm.remark,
            // labels: this.labelsList,
            codes: codes
          }
          if (this.formType === 1) { // 发货列表-新增发货
            url = this.$api.traceabilityInfo.addDeliveryPage
            if (this.receiveFlag) { // 收货列表-操作列的发货
              param.receiptOrderId = this.basicForm.id
            }
          } else { // 发货列表-修改发货
            url = this.$api.traceabilityInfo.editDeliveryPage
            param.id = this.basicForm.id
          }
          this.$backend.request(url, param).then((response) => {
            this.$util.TipsUtils.message(response)
            this.loading = false
            if (response.success) {
              this.$emit('handleSubmit')
              this.close()
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs['basicForm'].clearValidate()
      })
    },
    close() {
      for (const key in this.basicForm) {
        this.basicForm[key] = ''
      }
      this.basicForm.type = '0'
      this.basicForm.codes = []
      this.loading = false
      this.formVisible = false
      this.submitValidate = false
      this.formType = 1
      this.labelsList = []
      this.orgBodyCodes = []
      this.$nextTick(() => {
        this.$refs['basicForm'].clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 ::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    position: unset;
  }
::v-deep .el-form-item .el-input--medium .el-input__inner{
  width: 100%;
}
.labels-form-item {
    display: flex;
    align-items: center;
    .el-icon-check {
      font-size: 20px;
      margin: 0 10px;
      cursor: pointer;
      color: #00DE1A;
    }
    .el-icon-close {
      font-size: 20px;
      cursor: pointer;
    }
}
.labels-form-all {
    border: 1px solid #D9D9D9;
    padding: 10px 15px;
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
    p{
        line-height: 30px;
    }
}
</style>
