<template>
  <div class="wrapper">
    <el-form
      ref="basicForm"
      :model="basicForm"
      :rules="basicFormRules"
      label-width="130px"
      label-position="top"
      style="flex:1"
    >
      <el-form-item label="企业名称：" prop="orgName">
        <el-input v-model="basicForm.orgName" placeholder="请输入" clearable disabled />
      </el-form-item>
      <el-form-item label="用户角色：" prop="roleName">
        <el-input v-model="basicForm.roleName" placeholder="请输入" clearable disabled />
      </el-form-item>
      <el-form-item label="账号：" prop="userName">
        <el-input
          v-model="basicForm.userName"
          maxlength="30"
          placeholder="请输入"
          clearable
          @blur="basicForm.userName = basicForm.userName.trim()"
        />
      </el-form-item>
      <el-form-item label="真实姓名：" prop="contact">
        <el-input
          v-model="basicForm.contact"
          maxlength="50"
          placeholder="请输入"
          clearable
          @blur="basicForm.contact = basicForm.contact.trim()"
        />
      </el-form-item>
      <el-form-item label="联系电话：" prop="telephone">
        <el-input
          v-model="basicForm.telephone"
          maxlength="11"
          placeholder="请输入"
          clearable
          @blur="basicForm.telephone = basicForm.telephone.trim()"
        />
      </el-form-item>
      <el-form-item v-if="basicForm.telephone !== currentPhone" label="短信验证码：" prop="smsCode" class="codeInput">
        <el-input v-model="basicForm.smsCode" clearable maxlength="6" />
        <button class="code-btn" :disabled="!show" @click.prevent="getCode()">
          <span v-show="show">获取验证码</span>
          <span v-show="!show" class="count">{{ count }} s</span>
        </button>
      </el-form-item>
      <el-form-item label="邮箱地址：" prop="email">
        <el-input v-model="basicForm.email" maxlength="30" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item>
        <el-button plain @click="cancelChange">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleChangeInfo">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { verifyAccount, validEmail, phoneNumber } from '../../utils/validate'
export default {
  name: 'ModalForm',
  data() {
    return {
      isShowCode: false,
      show: 'false',
      count: '', // 倒计时
      basicForm: {
        userName: '',
        status: 1,
        contact: '',
        telephone: '',
        email: '',
        orgType: 1,
        orgId: '',
        orgName: '',
        roleName: '',
        roleId: '',
        smsCode: ''
      },
      basicFormInit: {},
      basicFormRules: {
        smsCode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
          // { min: 4, max: 6, message: "验证码长度为4-6个字符", trigger: "blur" }
        ],
        userName: [
          {
            required: true,
            message: '请输入账号',
            trigger: ['blur', 'change']
          },
          { validator: verifyAccount, trigger: ['blur', 'change'] }
        ],
        telephone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: phoneNumber, trigger: 'blur' }
        ],
        contact: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: ['blur', 'change']
          }
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色权限 ',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            required: false,
            validator: validEmail,
            trigger: ['blur', 'change']
          }
        ]
      },
      formType: 1, // 1新增，2编辑
      roleList: [],
      orgList: [],
      pwdInput: '',
      currentId: '',
      loading: false,
      currentPhone: '' // 当前手机号
    }
  },
  watch: {
    formType(newVal) {
      this.formType = newVal
    }
  },
  activated() {
    const id = this.$route.query.id
    this.roterId = id
    this.getuserDetail(id)
    // window.tttt = this
  },
  methods: {
    // 获取短信验证码
    getCode() {
      if (this.basicForm.telephone === '') {
        return this.$message.error('手机号不能为空')
      } else if (this.basicForm.telephone.telephone < 11) {
        return this.$message.error('请输入正确的手机号')
      }
      // 请求发送短信验证码
      const param = this.basicForm.telephone
      this.$backend
        .request(this.$api.password.getValidateCode, param)
        .then(res => {
          console.log(res)
          if (!res.success) {
            return this.$message.error(res.message)
          } else {
            this.sendCodeTimer()
          }
        })
    },
    // 发送验证码倒计时
    sendCodeTimer() {
      if (!this.timer) {
        this.count = 60
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },

    /** ****************************/
    handleChangeInfo() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
          this.loading = true
          this.$backend
            .request(this.$api.enterprise.centerEditUser, param)
            .then(response => {
              this.loading = false
              if (response.success) {
                this.$router.push({ path: '/dashboard' })
              }
              this.$util.TipsUtils.message(response)
            })
        }
      })
    },
    // 获取详情
    getuserDetail(id) {
      this.$backend
        .request(this.$api.enterprise.getuserDetail, id)
        .then(response => {
          console.log('getuserDetail', response)
          if (response.success) {
            this.basicForm = response.data
            this.currentPhone = response.data.telephone
          }
        })
    },
    // 取消修改
    cancelChange() {
      this.$router.push({ path: '/dashboard' })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.codeInput {
  position: relative;
}
.code-btn {
  width: 9%;
  height: 20px;
  position: absolute;
  top: 10px;
  // right: -83px;
  left: 30%;
  z-index: 222;
  //#ef8466橘色
  color: #409eff;
  font-size: 14px;
  border: none;
  border-left: 1px solid #bababa;
  padding-left: 10px;
  background-color: #fff;
  cursor: pointer;
}
.wrapper {
  display: flex;
  justify-content: center;
}
.switch-input {
  ::v-deep .el-form-item__content {
    border: 1px solid #dcdfe6;
    // box-sizing: border-box;
    height: 44px;
    .el-switch {
      margin-left: 15px;
    }
  }
}
::v-deep .el-form-item .el-input--medium .el-input__inner {
  width: 40%;
}
::v-deep .el-form--label-top .el-form-item__label {
  padding-bottom: 10px;
  font-weight: normal;
}
::v-deep .el-form-item {
  margin-bottom: 22px;
}
::v-deep .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  position: unset;
}
</style>
