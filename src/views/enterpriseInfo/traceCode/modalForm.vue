<template>
  <div>
    <div class="row-title" style="padding-top: 0px">
      <span>码段信息</span>
      <span class="row-title-tips">(此必填，带<span style="color: red">*</span>为必填)</span>
    </div>
    <div class="flex-form-submit flex-form-submit-two">
      <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" label-width="120px" :disabled="formType == 2">
        <el-form-item label="企业名称" prop="orgName">
          <el-input v-model="basicForm.orgName" disabled placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="追溯商品" prop="goodsName">
              <el-input v-model="basicForm.goodsName" maxlength="100" placeholder="请输入追溯商品" clearable/>
            </el-form-item> -->
        <el-form-item label="溯源码数量" prop="applyQuantity">
          <el-input v-model.trim="basicForm.applyQuantity" v-Int="{data:basicForm,filed:'applyQuantity'}" maxlength="10" placeholder="请输入溯源码数量" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remarks" style="width: 100%;">
          <el-input v-model="basicForm.remarks" type="textarea" placeholder="请输入备注" maxlength="100" clearable />
        </el-form-item>
        <el-form-item v-if="formType == 2 && basicForm.status == 2" label="不通过原因" prop="reason" style="width: 100%;">
          <el-input v-model="basicForm.reason" type="textarea" disabled />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      basicForm: {
        orgName: '',
        // goodsName: '',
        applyQuantity: '',
        remarks: ''
      },
      basicFormRules: {
        applyQuantity: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }]
      },
      formType: 1 // 1新增 2查看
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    // 如果是进口商默认显示自己
    this.basicForm.orgName = this.userInfo.orgNameCn || this.userInfo.orgNameEn
  },
  methods: {
    // 提交
    submit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          this.$backend.request(this.$api.traceCode.addCodeOrder, param).then((response) => {
            this.$util.TipsUtils.message(response)
            if (response.success) {
              this.$emit('handleSubmit')
            }
          })
        } else {
          return false
        }
      })
    },
    close() {
      this.initData()
      this.clear()
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['basicForm'] && this.$refs['basicForm'].clearValidate()
      })
    },
    initData() {
      for (const item in this.basicForm) {
        this.basicForm[item] = ''
      }
      // 如果是进口商默认显示自己
      this.basicForm.orgName = this.userInfo.orgNameCn || this.userInfo.orgNameEn
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-input{
  >>> .el-form-item__content{
      border: 1px solid #DCDFE6;
      // box-sizing: border-box;
      height: 44px;
      .el-switch{
          margin-left: 15px;
      }
  }
}
.el-form-item {
  width: 100%;
  .el-form-item__content{
    flex: 1;
  }
}

</style>
