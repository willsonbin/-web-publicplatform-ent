<template>
  <div>
    <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" label-position="top">
      <el-form-item label="作废类型：" prop="invalidType">
        <el-select v-model="basicForm.invalidType" placeholder="请选择" @change="hanleChangeType">
          <el-option label="作废码段" value="0" />
          <el-option label="作废码值" value="1" />
          <el-option label="作废批次" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="currentType==='0'" label="追溯码段：" prop="startSegment">
        <section style="display:flex; flex-direction: row;align-items: center;align-content: center;">
          <el-input v-model="basicForm.startSegment" placeholder="请输入内容" maxlength="16" />
          <span class="line" />
          <el-input v-model="basicForm.endSegment" placeholder="请输入内容" maxlength="16" />
        </section>
      </el-form-item>
      <el-form-item v-if="currentType==='1'" label="追溯码值：" prop="batchCode">
        <el-input v-model="basicForm.batchCode" placeholder="请输入内容" maxlength="16" />
      </el-form-item>
      <el-form-item v-if="currentType==='2'" label="选择产品批次：" prop="batchNo">
        <section style="display:flex; flex-direction: column;">
          <el-select v-model="productId" placeholder="请选择" filterable style="width:60%; margin-bottom:10px" @change="handleChangePro">
            <el-option v-for="item in proBatchList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="basicForm.batchNo" multiple placeholder="请选择" filterable>
            <el-option v-for="(item,index) of batchList" :key="index" :label="item.batchNo" :value="item.batchNo" />
          </el-select>
        </section>
      </el-form-item>
      <el-form-item label="作废理由：" prop="remark">
        <el-input v-model="basicForm.remark" type="textarea" :rows="3" placeholder="请输入理由" maxlength="200" show-word-limit @blur="basicForm.remark = basicForm.remark.trim()" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      basicForm: {
        invalidType: '0',
        endSegment: '',
        remark: '',
        batchCode: '',
        startSegment: '',
        enterpriseName: '',
        batchNo: []
      },
      basicFormRules: {
        invalidType: [{ required: true, message: '请选择作废类型', trigger: 'change' }],
        startSegment: [
          { required: true, message: '请输入起始码段', trigger: 'blur' }
        ],
        endSegment: [
          { required: true, message: '请输入结束码段', trigger: 'blur' }
        ],
        batchNo: [{ required: true, message: '请选择产品批次', trigger: 'change' }],
        batchCode: [{ required: true, message: '请输入追溯码值', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入作废理由', trigger: 'blur' }]
      },
      batchList: [],
      currentType: '0',
      proBatchList: [],
      productId: ''

    }
  },
  methods: {
    // 根据企业选择商品
    handleSelectOrg() {
      this.proBatchList = []
      this.batchList = []
      this.$backend.request(this.$api.basicSetting.getProductBatch).then((response) => {
        this.proBatchList = response.data || []
      })
    },
    // 根据商品选择批次
    handleChangePro(id) {
      const param = {
        id: id,
        justTheName: true
      }
      this.$backend.request(this.$api.basicSetting.getBatchByProduct, param).then((response) => {
        console.log('handleChangePro', response)
        this.batchList = response.data || []
      })
    },
    // 作废类型切换
    hanleChangeType(val) {
      this.basicForm.invalidType = val
      const newStr = val.toString()
      this.currentType = newStr
      this.basicForm.endSegment = ''
      this.basicForm.remark = ''
      this.basicForm.startSegment = ''
      this.basicForm.enterpriseName = ''
      this.basicForm.batchCode = ''
      this.basicForm.orgId = ''
      this.basicForm.batchNo = []
      if (newStr === '2') {
        this.handleSelectOrg()
      }
      this.$nextTick(() => {
        this.$refs.basicForm.clearValidate()
      })
    },
    // 表单提交
    handleSubmit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          const url = this.$api.basicSetting.getLabelStatusInvalid
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          if (this.currentType === '1') {
            param.startSegment = param.batchCode
            param.endSegment = param.batchCode
          }
          delete param.batchCode
          this.$backend.request(url, param).then((response) => {
            if (response.success) {
              this.$util.TipsUtils.message({ success: true, message: '操作成功' })
              this.$emit('refreshList')
              this.clear()
            } else {
              this.$util.TipsUtils.message(response)
            }
          })
        }
      })
    },
    clear() {
      this.$nextTick(() => {
        this.$refs.basicForm.clearValidate()
        this.$refs.basicForm.resetFields()
        this.basicForm.endSegment = ''
        this.basicForm.invalidType = '0'
        this.currentType = '0'
        this.productId = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.line{
    width: 50px;
    height: 1px;
    background: #dcdfe6;
    display: inline-block;
}
::v-deep .el-form-item--medium .el-form-item__label{
    font-weight: normal;
}
::v-deep .el-form-item .el-input--medium .el-input__inner{
    width: 100%;
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
</style>
