<template>
  <div>
    <el-dialog
      :title="currentTitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" label-position="right">
        <el-form-item label="产品类型：" prop="type">
          <el-radio-group v-model="basicForm.type" @change="handleChangeType">
            <el-radio label="0">原料</el-radio>
            <el-radio label="1">加工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="basicForm.type==='0'" label="原料分类：" prop="categoryId">
          <el-cascader
            :key="materialKey"
            v-model="basicForm.categoryId"
            :options="materialArr"
            filterable
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item v-if="basicForm.type==='1'" label="产品分类：" prop="categoryId">
          <el-cascader
            :key="productKey"
            v-model="basicForm.categoryId"
            :options="productArr"
            filterable
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="属性名称： " prop="name">
          <el-input v-model="basicForm.name" maxlength="10" placeholder="请输入" clearable @blur="basicForm.name = basicForm.name.trim()" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="basicForm.sort" maxlength="9" placeholder="请输入" clearable onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" />
        </el-form-item>
        <el-form-item label="属性类型： " prop="arrType">
          <el-select v-model="basicForm.arrType">
            <el-option label="单选" value="1" />
            <el-option label="复选" value="2" />
            <el-option label="单行文本(限制50)" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否必填：" prop="isrequired">
          <el-radio-group v-model="basicForm.isrequired">
            <el-radio label="0">必填</el-radio>
            <el-radio label="1">非必填</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="basicForm.arrType!=='3'" ref="labelsFrom" label="属性值：" prop="attrValue">
          <div class="labels-form-item">
            <el-input v-show="false" :value="basicForm.attrValue && basicForm.attrValue.join('')" />
            <el-input v-model="initAttrValue" placeholder="请输入属性值 一行代表一个值" maxlength="12" clearable @blur="initAttrValue = initAttrValue.trim()" />
            <i class="el-icon-check" @click="addAttrValue" />
            <i class="el-icon-close" @click="clearInput" />
          </div>
        </el-form-item>
        <el-form-item>
          <div v-if="basicForm.attrValue && basicForm.attrValue.length > 0" class="labels-form-all">
            <p v-for="(item, index) in basicForm.attrValue" :key="index">
              <span> {{ item }}</span>
              <i style="cursor:pointer" class="el-icon-close" @click="handleDeleteLabel(index)" />
            </p>
          </div>
          <p>已选{{ basicForm.attrValue.length || 0 }}个属性,最多不超多50个属性</p>
          <p v-if="basicForm.attrValue.length >= 50" class="red-text">最多不超多50个属性</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { onlyNumber } from '../../../utils/validate'
export default {
  data() {
    return {
      currentTitle: '新增属性',
      dialogVisible: false,
      formType: 1,
      basicForm: {
        type: '0', // 0 原料 1 产品
        name: '',
        categoryId: [],
        sort: '',
        arrType: '',
        isrequired: '0',
        attrValue: [],
        attr: {},
        enable: true,
        id: ''
      },
      basicFormRules: {
        type: [{ required: true, message: '请选择产品类型', trigger: ['change', 'blur'] }],
        categoryId: [{ required: true, message: '请选择分类', trigger: ['change', 'blur'] }],
        name: [{ required: true, message: '请输入属性名称', trigger: ['change', 'blur'] }],
        sort: [{ onlyNumber, trigger: 'blur' }],
        arrType: [{ required: true, message: '请选择属性类型', trigger: ['change', 'blur'] }],
        isrequired: [{ required: true, message: '请选择是否必填', trigger: ['change', 'blur'] }],
        attrValue: [{ required: true, message: '请输入属性值', trigger: ['change', 'blur'] }]
      },
      productArr: [],
      materialArr: [],
      initAttrValue: '',
      materialKey: 0,
      loading: false
    }
  },
  computed: {
    productKey() {
      return this.materialKey + 1
    }
  },
  activated() {
    this.materialCategory()
  },
  methods: {
    clearInput() {
      this.initAttrValue = ''
    },
    getAttrInfo(item) {
      this.basicForm.type = item.type.toString()
      this.basicForm.name = item.name
      this.basicForm.categoryId = item.categoryId
      this.basicForm.sort = item.sort.toString()
      this.basicForm.id = item.id
      this.basicForm.arrType = item.attr.arrType
      this.basicForm.isrequired = item.attr.isrequired
      this.basicForm.attrValue = item.attr.attrValue
    },
    // 提交
    handleSubmit() {
      this.$refs['basicForm'].validate(valid => {
        const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
        if (this.$util.StringUtils.isArray(param.categoryId)) {
          param.categoryId = param.categoryId.pop()
        }
        const attr = {
          arrType: param.arrType,
          isrequired: param.isrequired,
          attrValue: param.attrValue
        }
        param.attr = JSON.stringify(attr)
        delete param.arrType
        delete param.isrequired
        delete param.attrValue
        if (valid) {
          let url = ''
          if (this.formType === 1) {
            url = this.$api.basicSetting.addProductAttr
          } else {
            url = this.$api.basicSetting.eidtProductAttr
          }
          this.loading = true
          this.$backend.request(url, param).then((response) => {
            this.loading = false
            if (response.success) {
              this.dialogVisible = false
              this.$emit('refreshList')
              this.clear()
            }
            this.$util.TipsUtils.message(response)
          })
        } else {
          this.loading = false
        }
      })
    },
    addAttrValue() {
      if (this.basicForm.attrValue.length >= 50) {
        this.$refs.labelsFrom.validateMessage = '不能大于2个属性值'
        this.initAttrValue = ''
        return
      } else {
        if (this.initAttrValue === '') return
        this.basicForm.attrValue.push(this.initAttrValue)
        this.initAttrValue = ''
      }
    },
    // 删除索引
    handleDeleteLabel(index) {
      this.basicForm.attrValue.splice(index, 1)
    },
    // 获取产品类别
    productCategory() {
      this.$backend.request(this.$api.traceabilityInfo.productCategory, { type: 0 }).then((response) => {
        if (response.success) {
          this.productArr = response.data
          this.$util.ObjectUtils.assignValue(
            this.productArr,
            'name',
            'id',
            'child'
          )
        }
      })
    },
    // 获取原料类别
    materialCategory() {
      this.$backend.request(this.$api.traceabilityInfo.productCategory, { type: 1 }).then((response) => {
        if (response.success) {
          this.materialArr = response.data
          this.$util.ObjectUtils.assignValue(
            this.materialArr,
            'name',
            'id',
            'child'
          )
        }
      })
    },
    // 选择原料或产品
    handleChangeType(val) {
      this.currentType = val.toString()
      if (val === '0') {
        this.materialCategory()
      } else {
        this.productCategory()
      }
      this.materialKey++
    },
    // 取消
    handleCancel() {
      this.dialogVisible = false
      this.clear()
    },
    clear() {
      this.materialKey = 0
      this.$nextTick(() => {
        this.$refs.basicForm.clearValidate()
        this.$refs.basicForm.resetFields()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.red-text{
    color: red;
    font-size: 14px;
}
 >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    position: unset;
  }
>>> .el-form-item .el-input--medium .el-input__inner{
  width: 100%;
}
</style>
