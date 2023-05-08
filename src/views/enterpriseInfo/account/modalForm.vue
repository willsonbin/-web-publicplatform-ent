<template>
  <div style="margin:0 10px">
    <el-form ref="userForm" :model="basicForm" :rules="basicFormRules" label-width="110px" label-position="top">
      <el-form-item label="账号：" prop="userName">
        <el-input v-model="basicForm.userName" maxlength="30" placeholder="请输入" clearable :disabled="formType===2" @blur="basicForm.userName = basicForm.userName.trim()" />
      </el-form-item>
      <el-form-item label="真实姓名：" prop="contact">
        <el-input v-model="basicForm.contact" maxlength="50" placeholder="请输入" clearable @blur="basicForm.contact = basicForm.contact.trim()" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="telephone">
        <el-input v-model="basicForm.telephone" maxlength="13" placeholder="请输入" clearable @blur="basicForm.telephone = basicForm.telephone.trim()" />
      </el-form-item>
      <el-form-item label="邮箱地址：" prop="email">
        <el-input v-model="basicForm.email" maxlength="30" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="用户角色权限：" prop="roleId">
        <el-select v-model="basicForm.roleId" placeholder="请选择" style="width: 100%" filterable clearable>
          <el-option v-for="item of roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch v-model="basicForm.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { onlyLetterOrNum, validEmail, checkTelphone } from '../../../utils/validate'
export default {
  name: 'ModalForm',
  data() {
    return {
      basicForm: {
        userName: '',
        status: 1,
        contact: '',
        telephone: '',
        roleId: '',
        email: '',
        orgType: 1
      },
      basicFormInit: {},
      basicFormRules: {
        userName: [{ required: true, message: '请输入账号', trigger: ['blur', 'change'] },
          { validator: onlyLetterOrNum, trigger: ['blur', 'change'] }
        ],
        telephone: [{ required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkTelphone, trigger: 'blur' }
        ],
        contact: [{ required: true, message: '请输入真实姓名', trigger: ['blur', 'change'] }],
        roleId: [{ required: true, message: '请选择角色权限 ', trigger: ['blur', 'change'] }],
        email: [{ required: false, validator: validEmail, trigger: ['blur', 'change'] }]
      },
      formType: 1, // 1新增，2编辑
      roleList: [],
      orgList: [],
      pwdInput: '',
      currentId: ''
    }
  },
  watch: {
    formType(newVal) {
      this.formType = newVal
    }
  },
  mounted() {
    this.getRoleByorgType()
  },
  methods: {
    // 查询企业角色
    getRoleByorgType() {
      this.$backend.request(this.$api.enterprise.selectRoleByOrgId).then((response) => {
        this.roleList = response.data || []
      })
    },
    close() {
      this.initData()
      this.clear()
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['userForm'] && this.$refs['userForm'].clearValidate()
      })
    },
    initData() {
      for (const item in this.basicForm) {
        this.basicForm[item] = ''
      }
    },
    submit() {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          var url = ''
          // 新增
          if (this.formType === 1) {
            url = this.$api.enterprise.addUser
          } else {
            url = this.$api.enterprise.editUser
          }
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          this.$backend.request(url, param).then((response) => {
            if (response.success) {
              this.$emit('handleUserSubmit')
              this.close()
            } else {
              this.$emit('error')
            }
            this.$util.TipsUtils.message(response)
          })
        } else {
          this.$emit('error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-input{
  >>>.el-form-item__content{
      border: 1px solid #DCDFE6;
      // box-sizing: border-box;
      height: 44px;
      .el-switch{
          margin-left: 15px;
      }
  }
}
>>> .el-form-item .el-input--medium .el-input__inner{
  width: 100%;
}
>>> .el-form--label-top .el-form-item__label{
  padding: 0px;
  font-weight: normal;
}
>>> .el-form-item{
  margin-bottom: 5px;
}
>>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  position: unset;
}
</style>
