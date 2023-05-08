<template>
  <el-dialog :title="basicForm.id ? '编辑收货地址' : '新增收货地址'" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">提 交</el-button>
    </div>
    <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" label-position="right">
      <el-form-item label="收货地区：" prop="areaArr">
        <el-cascader
          ref="areaArr"
          v-model="basicForm.areaArr"
          :options="countryAreaTreeCH"
          :props="{ value: 'label' }"
          filterable
          clearable
          style="width: 100%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="收货地址：" prop="address">
        <el-input v-model="basicForm.address" placeholder="请输入" type="textarea" maxlength="100" clearable @blur="basicForm.address = basicForm.address.trim()" />
      </el-form-item>
      <el-form-item label="联系人：" prop="contact">
        <el-input v-model="basicForm.contact" placeholder="请输入" maxlength="30" clearable @blur="basicForm.contact = basicForm.contact.trim()" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="contactPhone">
        <el-input v-model="basicForm.contactPhone" placeholder="请输入" maxlength="11" clearable @blur="basicForm.contactPhone = basicForm.contactPhone.trim()" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { phoneNumber } from '../../../utils/validate'
export default {
  name: 'ModalForm',
  data() {
    return {
      formVisible: false,
      basicForm: {},
      basicFormRules: {
        areaArr: [{ required: true, message: '请选择收货地区', trigger: 'change' }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }, { validator: phoneNumber, trigger: 'blur' }],
        address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ]),
    countryAreaTreeCH() {
      return this.countryAreaTree.filter(item => item.areaName.indexOf('中国') > -1)[0].child
    }
  },
  mounted() {
  },
  methods: {
    handleSubmit() {
      console.log(this.basicForm)
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.loading = true
          let url
          if (this.basicForm.id) {
            url = this.$api.basicSetting.editShippingAddress
          } else {
            url = this.$api.basicSetting.addShippingAddress
          }
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          if (param.areaArr && param.areaArr.length > 0) { // 省市区
            param.province = param.areaArr[0] || ''
            param.city = param.areaArr[1] ? param.areaArr[1] : ''
            param.area = param.areaArr[2] ? param.areaArr[2] : ''
          } else {
            param.province = ''
            param.city = ''
            param.area = ''
          }
          // else if (param.areaArr && param.areaArr.length === 2) { // 直辖市
          //   param.province = ''
          //   param.city = param.areaArr[0]
          //   param.area = param.areaArr[1]
          // } else if (param.areaArr && param.areaArr.length === 1) { // 港澳台
          //   param.province = param.areaArr[0]
          //   param.city = ''
          //   param.area = ''
          // }
          delete param.areaArr
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
 >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    position: unset;
  }
>>> .el-form-item .el-input--medium .el-input__inner{
  width: 100%;
}
</style>
