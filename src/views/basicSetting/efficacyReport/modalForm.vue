<template>
  <el-dialog title="功效宣称检测申请" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">提 交</el-button>
    </div>
    <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" label-position="right">
      <el-form-item label="选择检测机构：" prop="testingFacilityId">
        <el-select v-model="basicForm.testingFacilityId" placeholder="请选择" style="width: 100%" clearable>
          <el-option v-for="(item, key) in organTestList" :key="key" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="检测产品：" prop="productId">
        <el-select v-model="basicForm.productId" placeholder="请选择" style="width: 100%" clearable>
          <el-option v-for="(item, key) in productTestList" :key="key" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="功效宣称：" prop="effectId">
        <el-select v-model="basicForm.effectId" placeholder="请选择" style="width: 100%" clearable>
          <el-option v-for="(item, key) in effctDictList" :key="key" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-input v-model="basicForm.remarks" type="textarea" placeholder="请输入" maxlength="200" show-word-limit clearable />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalForm',
  props: {
    effctDictList: {
      type: Array,
      default: () => []
    },
    organTestList: {
      type: Array,
      default: () => []
    },
    productTestList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formVisible: false,
      basicForm: {},
      basicFormRules: {
        testingFacilityId: [{ required: true, message: '请选择检测机构', trigger: 'change' }],
        productId: [{ required: true, message: '请选择检测产品', trigger: 'change' }],
        effectId: [{ required: true, message: '请选择功效宣称', trigger: 'change' }]
      },
      loading: false
    }
  },
  mounted() {
  },
  methods: {
    handleSubmit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const url = this.$api.basicSetting.addEffectReview
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          param.status = 1
          this.$backend.request(url, param).then((response) => {
            this.$util.TipsUtils.message(response)
            this.loading = false
            if (response.success) {
              this.$emit('handleSubmit')
              this.close()
            }
          })
        }
      })
    },
    close() {
      this.basicForm = {}
      this.formVisible = false
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
</style>
