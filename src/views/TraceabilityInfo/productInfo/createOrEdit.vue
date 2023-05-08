<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="产品分类: " prop="categoryId">
        <el-cascader
          v-model="ruleForm.categoryId"
          :options="productArr"
          filterable
          clearable
          style="width: 60%"
          placeholder="请选择"
          @change="handleChangeCascadar"
        />
      </el-form-item>
      <el-form-item label="产品名称: " prop="name">
        <el-input v-model="ruleForm.name" maxlength="50" clearable style="width:50%" />
      </el-form-item>
      <el-form-item label="产品编码: " prop="code">
        <el-input v-model="ruleForm.code" maxlength="30" placeholder="请输入" clearable style="width:30%" />
        <span class="row-title-tips">可手动输入,为空系统自动分配</span>
      </el-form-item>
      <el-form-item ref="productRef" label="产品图片: " prop="productImages">
        <PicUpload :size="3" accept=".jpg,.png" :file-img-list="ruleForm.productImages || []" :multiple="true" :limit="5" :arr-index="-1" @uploadFile="uploadCerFile" />
        <span class="row-title-tips">（建议尺寸351*300像素或等比例以上，上传限制jpg、png格式，单次上传不允许超过3M，最多可上传五张</span>
      </el-form-item>
      <el-form-item label="产品规格: " prop="unitNumber">
        <el-input v-model.number="ruleForm.unitNumber" maxlength="9" placeholder="请输入" clearable style="width:30%" />
        <el-select v-model="ruleForm.unitType" placeholder="请选择活动区域">
          <el-option v-for="item in unitOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="ruleForm.outUnitType" placeholder="请选择活动区域">
          <el-option v-for="(item,index) in unitOption" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="净含量: " prop="weight">
        <el-input v-model.number="ruleForm.weight" placeholder="请输入" clearable style="width:30%" maxlength="15" />
        <el-select v-model="ruleForm.weightType" placeholder="请选择">
          <el-option label="g" value="1" />
          <el-option label="kg" value="2" />
          <el-option label="ml" value="3" />
          <el-option label="l" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="产地: " prop="countryCode">
        <el-select v-model="ruleForm.countryCode" placeholder="请选择" style="width: 30%" filterable clearable @change="handleChangeCountry">
          <el-option
            v-for="item in onlyCountryArea"
            :key="item.id"
            :label="item.areaName"
            :value="item.areaCode"
          />
        </el-select>
        <el-cascader
          v-model="ruleForm.areaArr"
          :options="countryAreaTreeFilter"
          filterable
          clearable
          style="width: 30%"
          placeholder="请选择"
          :props="{ checkStrictly: true , children: 'child'}"
        />
      </el-form-item>
      <el-form-item label="加工企业: " prop="processingEnterprise">
        <el-autocomplete
          v-model="ruleForm.processingEnterprise"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          style="width: 40%"
          clearable
          @select="handleChangeEnt"
          @clear="handleClearEnt"
        />
      </el-form-item>
      <el-form-item label="工厂地址: " prop="processingAddress">
        <el-input v-model="ruleForm.processingAddress" maxlength="50" clearable style="width:40%" />
      </el-form-item>
      <el-tabs v-model="productItem" type="card">
        <el-tab-pane label="产品属性" name="first">
          <el-form-item label="保质期: " prop="shelfLife">
            <el-input v-model.number="ruleForm.shelfLife" placeholder="请输入" maxlength="2" clearable style="width:20%" />
            <el-select v-model="ruleForm.shelfLifeType" placeholder="请选择" style="width:20%">
              <el-option label="年" value="2" />
              <el-option label="月" value="1" />
              <el-option label="日" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="贮藏条件: " prop="storageConditions">
            <el-input v-model="ruleForm.storageConditions" maxlength="50" clearable style="width:50%" />
          </el-form-item>
          <el-form-item label="执行标准: " prop="implementStandard">
            <el-input v-model="ruleForm.implementStandard" maxlength="50" clearable style="width:50%" />
          </el-form-item>
          <el-form-item label="原料投料: " prop="materials">
            <el-select v-model="ruleForm.materials" placeholder="请输入/选择原料" multiple filterable clearable allow-create style="width:60%">
              <el-option v-for="(item, index) in marerialData" :key="index" :label="item.name" :value="item.name" />
            </el-select>
            <div class="row-title-tips" style="display: block">还没有创建原料信息，点击<span class="blue-text" @click="goMaterial">这里</span></div>
          </el-form-item>
          <el-form-item label="营养成分: " prop="nutritionFacts">
            <el-input v-model="ruleForm.nutritionFacts" type="textArea" maxlength="500" clearable style="width:60%" />
          </el-form-item>
          <div v-if="productAttr.length > 0">
            <el-form-item
              v-for="(item,idx) in productAttr"
              :key="item.id"
              :label="item.name + '：'"
              :prop="'attr.'+[idx] +'.value'+ [item.attr.arrType]"
              :rules="{ required: item.attr.isrequired==='0'? true : false, message: item.attr.arrType=== '3'? '请输入必填项' :'请选择必填项', trigger: ['blur', 'change']}"
            >
              <el-radio-group v-if="item.attr.arrType=== '1'" v-model="ruleForm.attr[idx].value1">
                <el-radio v-for="(radioGroup, index) of item.attr.attrValue" :key="index" :label="radioGroup">{{ radioGroup }}</el-radio>
              </el-radio-group>
              <el-checkbox-group v-if="item.attr.arrType=== '2'" v-model="ruleForm.attr[idx].value2">
                <el-checkbox v-for="(checkboxGroup, index) in item.attr.attrValue" :key="index+2" :label="checkboxGroup" />
              </el-checkbox-group>
              <el-input v-if="item.attr.arrType=== '3'" v-model="ruleForm.attr[idx].value3" placeholder="请输入" maxlength="50" style="width:40%" />
            </el-form-item>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="productIntro" type="card">
        <el-tab-pane label="产品介绍" name="second">
          <div class="pageDesiner">
            <BigUpload :size="10" accept=".jpg,.png" :file-img-list="ruleForm.descriptions || []" :multiple="true" :limit="5" :arr-index="-1" @uploadBigFile="uploadDetailFile" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="bottomContent">
        <section style="margin-left:70%">
          <el-button class="el-button-confirm-two" @click="handeleCancel">取 消</el-button>
          <el-button type="primary" class="el-button-confirm-two" :loading="loadingSum" @click="submitForm(0)">暂存提交</el-button>
          <el-button type="primary" class="el-button-confirm-two" :loading="loading" @click="submitForm(1)">提交审核</el-button>
        </section>
      </div>
    </el-form>
  </div>
</template>
<script>
import { nanoid } from 'nanoid'
import { mapGetters } from 'vuex'
import { specialChar, banCharacter } from '../../../utils/validate'
import PicUpload from '../../common/picUpload'
import BigUpload from '../../common/bigUpload'
export default {
  name: 'CreateOrEdit',
  components: { PicUpload, BigUpload },
  data() {
    return {
      productItem: 'first',
      productIntro: 'second',
      ruleForm: {
        categoryId: '',
        name: '',
        code: '',
        areaArr: [],
        productImages: [],
        unitType: '1',
        unitNumber: '',
        outUnitType: '2',
        weight: '',
        weightType: '1',
        processingEnterprise: '',
        processingAddress: '',
        shelfLife: '',
        shelfLifeType: '1',
        storageConditions: '',
        implementStandard: '',
        materials: [],
        nutritionFacts: '',
        countryCode: 'CHN',
        descriptions: [],
        attr: [
          {
            value: ''
          }
        ]
      },
      rules: {
        categoryId: [{ required: true, message: '请选择产品分类', trigger: ['blur', 'change'] }],
        name: [{ required: true, message: '请输入产品名称', trigger: ['blur', 'change'] }
        ],
        code: [{ validator: banCharacter, trigger: 'blur' }],
        productImages: [{ required: true, message: '请上传图片', trigger: ['blur', 'change'] }],
        weight: [{ required: true, message: '请输入净含量', trigger: ['blur', 'change'] },
          { type: 'number', message: '净含量必须是数字', trigger: 'blur' }],
        countryCode: [{ required: true, message: '请选择产地', trigger: ['blur', 'change'] }],
        unitNumber: [{ required: true, message: '请输入产品规格', trigger: ['blur', 'change'] },
          { type: 'number', message: '产品规格必须是数字', trigger: 'blur' }],
        processingEnterprise: [{ required: true, message: '请输入加工企业', trigger: ['blur', 'change'] },
          { validator: specialChar, trigger: 'blur' }],
        processingAddress: [{ required: true, message: '请输入工厂地址', trigger: ['blur', 'change'] },
          { validator: specialChar, trigger: 'blur' }],
        shelfLife: [{ required: true, message: '请输入保质期', trigger: ['blur', 'change'] },
          { type: 'number', message: '保质期必须是数字', trigger: 'blur' }],
        storageConditions: [{ required: true, message: '请输入贮藏条件', trigger: ['blur', 'change'] }],
        implementStandard: [{ required: true, message: '请输入执行标准', trigger: ['blur', 'change'] }],
        materials: [{ required: true, message: '请输入/选择原料', trigger: ['blur', 'change'] }]
      },
      formType: 1,
      marerialData: [],
      productArr: [],
      unitOption: [{ label: '个', value: '1' }, { label: '瓶', value: '2' }, { label: '盒', value: '3' },
        { label: '袋', value: '4' }, { label: '片', value: '5' }, { label: '支', value: '6' }, { label: '块', value: '7' },
        { label: '罐', value: '8' }, { label: '包', value: '9' }, { label: '碗', value: '10' }, { label: '箱', value: '11' },
        { label: '盏', value: '12' }],
      currentMaterailId: [],
      productAttr: [],
      isChange: false,
      currentArr: [],
      orgList: [],
      reviewList: [],
      loadingSum: false,
      loading: false,
      onlyAreaTree: []
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
    this.clear()
    this.formType = this.$route.query.formType
    this.getMaterialFuzzy()
    this.productCategory()
    if (this.formType === '2') {
      this.currentId = this.$route.query.id || ''
      this.getProductInfo()
    }
    this.getEntOrganizationList()
    this.handleChangeCountry(this.ruleForm.countryCode)
  },
  deactivated() {
    this.currentId = ''
    this.formType = '1'
    this.clear()
  },
  methods: {
    handleChangeCountry(val) {
      const data = this.$util.ObjectUtils.deepCopy(this.countryAreaTree)
      const newArr = data.filter((item) => item.areaCode === val)
      this.onlyAreaTree = newArr[0].child
    },
    handleChangeEnt(item) {
      this.ruleForm.processingAddress = item.address
    },
    handleClearEnt() {
      this.orgList = this.reviewList
      this.ruleForm.processingAddress = ''
    },
    // 加工企业查询
    getEntOrganizationList() {
      const param = {
        fuzzyName: '',
        type: 2 // 1 生产 2 加工 3 经销商
      }
      this.$backend.request(this.$api.traceabilityInfo.getEntOrganizationList, param).then((response) => {
        if (response.success) {
          this.orgList = response.data
          this.reviewList = response.data
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
    getProductInfo() {
      this.$backend.request(this.$api.traceabilityInfo.getProductsInfo, this.currentId).then((response) => {
        if (response.success) {
          let newArr = []
          this.ruleForm = response.data.product
          this.ruleForm.categoryId = response.data.category
          this.ruleForm.unitType = response.data.product.unitType.toString()
          this.ruleForm.outUnitType = response.data.product.outUnitType.toString()
          this.ruleForm.shelfLifeType = response.data.product.shelfLifeType.toString()
          newArr = response.data.product.materials.map((item) => {
            return item.name
          })
          this.ruleForm.materials = newArr
          this.currentMaterailId = response.data.category.slice(-1).toString()
          const obj = {
            provinceCode: response.data.product.provinceCode,
            cityCode: response.data.product.cityCode || '',
            areaCode: response.data.product.areaCode || ''
          }
          let arr = []
          arr = Object.values(obj)
          arr = arr.filter(item => { if (item !== '' && item !== null) { return item } })
          this.isChange = true
          this.ruleForm.weightType = response.data.product.weightType.toString()
          this.ruleForm.areaArr = arr
          this.currentArr = JSON.parse(response.data.product.attr)
          this.ruleForm.attr = this.currentArr
          this.getProductAttr()
        }
      })
    },
    handleChangeCascadar(val) {
      this.ruleForm.categoryId = val
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
            this.ruleForm.attr = [...this.currentArr]
            response.data.forEach((item) => {
              item.attr = JSON.parse(item.attr)
            })
            this.productAttr = response.data
            this.$forceUpdate()
            return
          } else {
            this.ruleForm.attr = []
          }
          response.data.forEach((item) => {
            item.attr = JSON.parse(item.attr)
            if (item.attr.arrType === '3') {
              this.ruleForm.attr.push({
                value3: '',
                id: nanoid(),
                key: item.name,
                arrType: '3'
              })
            } else if (item.attr.arrType === '2') {
              this.ruleForm.attr.push({
                value2: [],
                id: nanoid(),
                key: item.name,
                arrType: '2'
              })
            } else {
              this.ruleForm.attr.push({
                value1: '',
                id: nanoid(),
                key: item.name,
                arrType: '1'
              })
            }
          })
          this.$forceUpdate()
          this.productAttr = response.data
        }
      })
    },
    // 获取原料列表
    getMaterialFuzzy() {
      const param = {
        name: ''
      }
      this.$backend.request(this.$api.traceabilityInfo.getMaterialFuzzy, param).then((response) => {
        if (response.success) {
          this.marerialData = response.data || []
        }
      })
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
    submitForm(ways) {
      this.$refs['ruleForm'].validate((valid) => {
        let url = ''
        if (this.formType === 1 || this.formType === '1') {
          this.loading = true
          url = this.$api.traceabilityInfo.addProducts
        } else {
          this.loadingSum = true
          url = this.$api.traceabilityInfo.editProducts
        }
        const param = this.$util.ObjectUtils.deepCopy(this.ruleForm)
        if (this.$util.StringUtils.isArray(param.categoryId)) {
          param.categoryId = param.categoryId.pop()
        }
        param.materials = this.ruleForm.materials.map(item => ({
          name: item
        }))
        if (valid) {
          param.provinceCode = this.ruleForm.areaArr[0] || ''
          param.cityCode = this.ruleForm.areaArr[1] || ''
          param.areaCode = this.ruleForm.areaArr[2] || ''
          param.attr = JSON.stringify(this.ruleForm.attr)
          delete param.areaArr
          const that = this
          that.$backend.spcialRequest(url, param, '', { saveType: ways }).then((response) => {
            this.loadingSum = false
            this.loading = false
            if (response.data.success) {
              that.$router.push({ path: '/traceability/productInfo' })
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
    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'] && this.$refs['ruleForm'].clearValidate()
        if (this.$refs['ruleForm'] !== undefined) {
          this.$refs['ruleForm'].resetFields()
        }
        this.ruleForm.descriptions = []
        this.basicForm.attr = []
      })
    },
    // 取消增加
    handeleCancel() {
      this.$router.push({ path: '/traceability/productInfo' })
    },
    // 跳转到原料信息
    goMaterial() {
      this.$router.push({ path: '/traceability/materialInfo/createOrEdit', query: { formType: 1 }})
    },
    uploadDetailFile(detaiPic, file, index) {
      index = parseInt(index)
      var me = this
      if (index === -1) {
        me.ruleForm.descriptions = []
        for (const files of detaiPic) {
          me.ruleForm.descriptions.push({
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
        me.ruleForm.productImages = []
        for (const files of goodPic) {
          me.ruleForm.productImages.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.url
          })
        }
        if (this.ruleForm.productImages.length > 0) {
          this.$nextTick(() => {
            this.$refs.productRef.validateMessage = ''
          })
        }
      }
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
  margin-bottom: 44px;
  overflow: auto;
}
.row-title-tips{
  font-size: 14px;
  color: #C3C3C3;
  display: inline-block;
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
</style>
