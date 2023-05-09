<template>
  <el-dialog :title="dialogTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">提 交</el-button>
    </div>
    <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" label-width="120px" label-position="right">
      <el-form-item label="组织名称：" prop="name">
        <el-input v-model="basicForm.name" placeholder="请输入" maxlength="30" clearable @blur="basicForm.name = basicForm.name.trim()" />
      </el-form-item>
      <el-form-item label="组织类型：" prop="orgType">
        <el-select v-model="basicForm.orgType" placeholder="请选择" style="width: 100%" clearable @change="basicForm.areaArray = []">
          <el-option v-for="(item, key) in orgTypeMap" :key="key" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人：" prop="contact">
        <el-input v-model="basicForm.contact" placeholder="请输入" maxlength="30" clearable @blur="basicForm.contact = basicForm.contact.trim()" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="contactPhone">
        <el-input v-model="basicForm.contactPhone" maxlength="13" placeholder="请输入" clearable @blur="basicForm.contactPhone = basicForm.contactPhone.trim()" />
      </el-form-item>
      <el-form-item label="国家/地区：" prop="areaArray">
        <el-cascader
          ref="areaArr"
          v-model="basicForm.areaArray"
          :options="basicForm.orgType == 3 ? countryAreaTreeCH : countryAreaTree"
          :props="{ checkStrictly: false, value: 'value' }"
          filterable
          clearable
          style="width: 100%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input v-model="basicForm.address" placeholder="请输入" maxlength="100" clearable type="textarea" :rows="3" @blur="basicForm.address = basicForm.address.trim()" />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch v-model="basicForm.status" :active-value="1" :inactive-value="0" @change="changStatus" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { checkTelphone } from '../../../utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'ModalForm',
  props: {
    orgTypeMap: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogTitle: '新增组织',
      formVisible: false,
      basicForm: {
        status: 1
      },
      basicFormRules: {
        name: [{ required: true, message: '请输入组织名称', trigger: ['blur', 'change'] }
        ],
        contact: [{ required: true, message: '请输入联系人', trigger: ['blur', 'change'] }
        ],
        orgType: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
        areaArray: [{ required: true, message: '请选择国家/地区', trigger: ['blur', 'change'] }],
        contactPhone: [{ required: false, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkTelphone, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ]),
    countryAreaTreeCH() {
      const data = this.countryAreaTree.filter(item => item.areaName.indexOf('中国') > -1)
      if (data && data.length > 0) {
        return data
      } else {
        return []
      }
    }
  },
  mounted() {
  },
  methods: {
    changStatus(status) {
      this.basicForm.status = status
      this.$forceUpdate()
    },
    handleSubmit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.loading = true
          var url = ''
          if (this.basicForm.id) {
            url = this.$api.enterprise.putOrganization
          } else {
            url = this.$api.enterprise.addOrganization
          }
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          param.countryCode = param.areaArray[0]
          param.areaArray.splice(0, 1)
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
      this.basicForm.status = 1
      this.loading = false
      this.$nextTick(() => {
        this.$refs['basicForm'].clearValidate()
      })
      this.formVisible = false
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
