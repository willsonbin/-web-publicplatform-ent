<template>
  <div>
    <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" :disabled="formType ==='3' ? true: false" label-position="right">
      <el-form-item label="原料分类：" prop="categoryId">
        <el-cascader
          v-model="basicForm.categoryId"
          :options="materialArr"
          filterable
          clearable
          style="width: 60%;"
          placeholder="请选择"
          @change="handleChangeCascadar"
        />
      </el-form-item>
      <el-form-item label="产品名称: " prop="name">
        <el-input v-model="basicForm.name" maxlength="50" placeholder="请输入" clearable style="width:60%" />
      </el-form-item>
      <el-form-item label="产品编码: " prop="code">
        <el-input v-model="basicForm.code" maxlength="50" placeholder="请输入" clearable style="width:30%" />
        <span class="row-title-tips">可手动输入,为空系统自动分配</span>
      </el-form-item>
      <el-form-item ref="productRef" label="产品图片: " prop="materialImages">
        <PicUpload :size="3" accept=".jpg,.png" :file-img-list="basicForm.materialImages || []" :multiple="true" :limit="5" :arr-index="-1" @uploadFile="uploadCerFile" />
        <span class="row-title-tips">（建议尺寸351*300像素或等比例以上，上传限制jpg、png格式，单次上传不允许超过3M，最多可上传五张）</span>
      </el-form-item>
      <el-form-item label="重量: " prop="weight">
        <el-input-number v-model="basicForm.weight" :min="1" :max="83333333" label="请输入" />
        <el-select v-model="basicForm.weightType" placeholder="请选择" style="width:70px">
          <el-option label="kg" value="2" />
          <el-option label="g" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="产地: " prop="countryCode">
        <el-select v-model="basicForm.countryCode" placeholder="请选择" style="width: 30%" filterable clearable @change="handleChangeCountry">
          <el-option
            v-for="item in onlyCountryArea"
            :key="item.id"
            :label="item.areaName"
            :value="item.areaCode"
          />
        </el-select>
        <el-cascader
          v-model="basicForm.areaArr"
          :options="countryAreaTreeFilter"
          filterable
          clearable
          style="width: 30%"
          placeholder="请选择"
          :props="{ checkStrictly: true, children: 'child' }"
        />
      </el-form-item>
      <el-form-item label="生产企业: " prop="productEnterprise">
        <!-- <el-input v-model="basicForm.productEnterprise" maxlength="100" placeholder="请输入" clearable style="width: 60%" /> -->
        <el-autocomplete
          v-model="basicForm.productEnterprise"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          style="width: 40%"
        />
      </el-form-item>
      <el-tabs v-if="productAttr.length > 0" v-model="productIntro" type="card">
        <el-tab-pane label="产品属性" name="second">
          <el-form-item
            v-for="(item,idx) in productAttr"
            :key="item.id"
            :label="item.name + '：'"
            :prop="'attr.'+[idx] +'.value'+ [item.attr.arrType]"
            :rules="{ required: item.attr.isrequired==='0'? true : false, message: item.attr.arrType=== '3'? '请输入必填项' :'请选择必填项', trigger: ['blur', 'change']}"
          >
            <el-radio-group v-if="item.attr.arrType=== '1'" v-model="basicForm.attr[idx].value1">
              <el-radio v-for="(radioGroup, index) of item.attr.attrValue" :key="index" :label="radioGroup">{{ radioGroup }}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="item.attr.arrType=== '2'" v-model="basicForm.attr[idx].value2">
              <el-checkbox v-for="(checkboxGroup, index) in item.attr.attrValue" :key="index+2" :label="checkboxGroup" />
            </el-checkbox-group>
            <el-input v-if="item.attr.arrType=== '3'" v-model="basicForm.attr[idx].value3" placeholder="请输入" maxlength="50" style="width:40%" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="productIntro" type="card">
        <el-tab-pane label="产品介绍" name="second">
          <div class="pageDesiner">
            <BigUpload :size="10" accept=".jpg,.png" :file-img-list="basicForm.descriptions || []" :multiple="true" :limit="5" :arr-index="-1" @uploadBigFile="uploadDetailFile" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="bottomContent">
        <section style="margin-left:70%">
          <el-button class="el-button-confirm-two" @click="handeleCancel">取 消</el-button>
          <el-button type="primary" class="el-button-confirm-two" :loading="loadingSum" @click="handleSubmit(0)">暂存提交</el-button>
          <el-button type="primary" class="el-button-confirm-two" :loading="loading" @click="handleSubmit(1)">提交审核</el-button>
        </section>
      </div>
    </el-form>
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
import { mapGetters } from 'vuex'
import { banCharacter } from '../../../utils/validate'
import PicUpload from '../../common/picUpload'
import BigUpload from '../../common/bigUpload'
export default {
  name: 'CreateOrEdit',
  components: { PicUpload, BigUpload },
  data() {
    return {

      basicForm: {
        categoryId: [],
        name: '',
        code: '',
        materialImages: [],
        weight: 1,
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        productEnterprise: '',
        areaArr: [],
        weightType: '2',
        descriptions: [],
        countryCode: 'CHN',
        attr: [
          {
            value: ''
          }
        ]
      },
      basicFormRules: {
        categoryId: [{ required: true, message: '请选择原料分类', trigger: ['blur', 'change'] }],
        name: [{ required: true, message: '请输入产品名称', trigger: ['blur', 'change'] }
        ],
        code: [{ validator: banCharacter, trigger: 'blur' }],
        materialImages: [{ required: true, message: '请上传图片', trigger: ['blur', 'change'] }],
        weight: [{ required: true, message: '请输入重量', trigger: ['blur', 'change'] }],
        countryCode: [{ required: true, message: '请选择产地', trigger: ['blur', 'change'] }],
        productEnterprise: [{ required: true, message: '请输入生产企业', trigger: ['blur', 'change'] }]
      },
      checkList: [],
      radioList: [],
      fileFormRules: {},
      formType: '1', // 1新增，2编辑，3查看
      currentId: '',
      selectLoading: false,
      materialArr: [],
      productIntro: 'second',
      fileList: [],
      currentMaterailId: [],
      productAttr: [],
      isChange: false,
      currentArr: [],
      orgList: [],
      onlyAreaTree: [],
      loadingSum: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ]),
    onlyCountryArea() {
      const data = this.$util.ObjectUtils.deepCopy(this.countryAreaTree)
      const newArr = data.filter((item) => {
        return delete item.child && delete item.children
      })
      return newArr
    },
    countryAreaTreeFilter() { // 只查到市
      const data = this.$util.ObjectUtils.deepCopy(this.onlyAreaTree)
      // 直辖市的level是1，中国其他省份的level也是1
      const provinceLevel = ['北京市', '天津市', '上海市', '重庆市', '中国台湾', '中国香港', '中国澳门']
      function fn(data) {
        if (data && data.length > 0) {
          data.forEach(item => {
            if (item.level === 1 && provinceLevel.includes(item.areaName)) {
              item.child = null
            }
            if (item.level === 2) {
              item.child = null
            }
            if (!(item.child && item.child.length > 0)) {
              item.child = null
            } else {
              fn(item.child)
            }
          })
        }
      }
      fn(data)
      return data
    }
  },
  activated() {
    this.formType = this.$route.query.formType
    this.productCategory()
    if (this.formType === '2') {
      this.currentId = this.$route.query.id
      this.getMaterialInfo()
    }
    this.getEntOrganizationList()
    this.handleChangeCountry(this.basicForm.countryCode)
  },
  deactivated() {
    this.currentId = ''
  },
  methods: {
    handleChangeCountry(val) {
      const data = this.$util.ObjectUtils.deepCopy(this.countryAreaTree)
      const newArr = data.filter((item) => item.areaCode === val)
      this.onlyAreaTree = newArr[0].child
    },
    // 加工企业查询
    getEntOrganizationList() {
      const param = {
        fuzzyName: '',
        type: 1 // 1 生产 2 加工 3 经销商
      }
      this.$backend.request(this.$api.traceabilityInfo.getEntOrganizationList, param).then((response) => {
        if (response.success) {
          this.orgList = response.data
          this.orgList.forEach((item) => {
            item.value = item.name
          })
        }
      })
    },
    querySearch(queryString, cb) {
      var orgList = this.orgList
      var results = queryString ? orgList.filter(this.createFilter(queryString)) : orgList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (orgList) => {
        return (orgList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleChangeCascadar(val) {
      this.basicForm.categoryId = val
      let newArr = []
      newArr = val
      this.isChange = false
      this.currentMaterailId = newArr.slice(-1).toString()
      this.getProductAttr()
    },
    getProductAttr() {
      this.$backend.request(this.$api.traceabilityInfo.getProductAttr, this.currentMaterailId).then((response) => {
        if (response.success) {
          if (this.isChange) {
            this.basicForm.attr = [...this.currentArr]
            response.data.forEach((item) => {
              item.attr = JSON.parse(item.attr)
            })
            this.productAttr = response.data
            this.$forceUpdate()
            return
          } else {
            this.basicForm.attr = []
          }
          response.data.forEach((item) => {
            item.attr = JSON.parse(item.attr)
            if (item.attr.arrType === '3') {
              this.basicForm.attr.push({
                value3: '',
                id: nanoid(),
                key: item.name,
                arrType: '3'
              })
            } else if (item.attr.arrType === '2') {
              this.basicForm.attr.push({
                value2: [],
                id: nanoid(),
                key: item.name,
                arrType: '2'
              })
            } else {
              this.basicForm.attr.push({
                value1: '',
                id: nanoid(),
                key: item.name,
                arrType: '1'
              })
            }
          })
          this.productAttr = response.data
          this.$forceUpdate()
        }
      })
    },
    // 取消
    handeleCancel() {
      this.$router.push({ path: '/traceability/materialInfo' })
    },
    getMaterialInfo() {
      this.$backend.request(this.$api.traceabilityInfo.getMaterialInfo, this.currentId).then((response) => {
        this.basicForm.attr = []
        if (response.success) {
          this.basicForm = response.data.material
          this.currentMaterailId = response.data.category.slice(-1).toString()
          const obj = {
            provinceCode: response.data.material.provinceCode,
            cityCode: response.data.material.cityCode || '',
            areaCode: response.data.material.areaCode || ''
          }
          let arr = []
          arr = Object.values(obj)
          arr = arr.filter(item => {
            if (item !== '' && item !== null) {
              return item
            }
          })
          this.isChange = true
          this.basicForm.weightType = response.data.material.weightType.toString()
          this.basicForm.areaArr = arr
          this.currentArr = JSON.parse(response.data.material.attr)
          this.basicForm.attr = this.currentArr
          this.getProductAttr()
        }
      })
    },
    // 获取原料类别
    productCategory() {
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
    handleSubmit(ways) {
      console.log('this.basicForm.attr', this.basicForm.attr)
      this.$refs['basicForm'].validate(valid => {
        let url = ''
        if (this.formType === 1 || this.formType === '1') {
          this.loading = true
          url = this.$api.traceabilityInfo.addMaterial
        } else {
          this.loadingSum = true
          url = this.$api.traceabilityInfo.editMaterial
        }
        const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
        if (this.$util.StringUtils.isArray(param.categoryId)) {
          param.categoryId = param.categoryId.pop()
        }
        if (valid) {
          param.provinceCode = this.basicForm.areaArr[0] || ''
          param.cityCode = this.basicForm.areaArr[1] || ''
          param.areaCode = this.basicForm.areaArr[2] || ''
          param.attr = JSON.stringify(this.basicForm.attr)
          delete param.areaArr
          const that = this
          that.$backend.spcialRequest(url, param, '', { saveType: ways }).then((response) => {
            this.loadingSum = false
            this.loading = false
            if (response.data.success) {
              that.$router.push({ path: '/traceability/materialInfo' })
              this.$util.TipsUtils.message({ success: true, message: '操作成功' })
            } else {
              this.$util.TipsUtils.message(response.data)
              return
            }
            that.clear()
          })
        } else {
          this.loading = false
        }
      })
    },
    uploadDetailFile(detaiPic, file, index) {
      index = parseInt(index)
      var me = this
      if (index === -1) {
        me.basicForm.descriptions = []
        for (const files of detaiPic) {
          me.basicForm.descriptions.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
      }
    },
    uploadCerFile(goodPic, file, index) {
      index = parseInt(index)
      var me = this
      if (index === -1) {
        me.basicForm.materialImages = []
        for (const files of goodPic) {
          me.basicForm.materialImages.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
        if (this.basicForm.materialImages.length > 0) {
          this.$nextTick(() => {
            this.$refs.productRef.validateMessage = ''
          })
        }
      }
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['basicForm'] && this.$refs['basicForm'].clearValidate()
        if (this.$refs['basicForm'] !== undefined) {
          this.$refs['basicForm'].resetFields()
        }
        this.basicForm.descriptions = []
        this.basicForm.attr = []
      })
    },
    initData() {
      for (const item in this.basicForm) {
        this.basicForm[item] = ''
      }
      this.fileForm.goodPic = []
    }
  }
}
</script>

<style lang="scss" scoped>
.bottomContent{
    background: #fff;
    box-shadow: 0 -4px 8px -1px #E2E2E2;
    width: 85%;
    height: 60px;
    line-height: 60px;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 99;
}
.pageDesiner{
  width: 600px;
  max-height: 600px;
  margin-bottom: 44px;
  overflow: auto;
}
>>> .el-form-item--medium .el-form-item__label{
  font-weight: normal;
  padding: 0px;
}
  >>> .el-form-item .el-input--medium .el-input__inner{
    width: 100%
  }
  >>> .el-form-item__error{
  position: unset;
  margin-top: 0px;
}
>>> .el-form-item--medium .el-form-item__label{
  margin-right: 10px;
}
>>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before{
  position: unset;
}
.row-title-tips{
  font-size: 14px;
  color: #C3C3C3;
  display: inline-block;
}
.el-input-number--medium {
  line-height: 30px;
}
</style>
