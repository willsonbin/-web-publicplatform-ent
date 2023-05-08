<template>
  <div id="label-modal">
    <el-form ref="basicForm" :class="{'el-form-margin-none': basicForm.id}" :model="basicForm" label-width="120px" :rules="formType == 1 ?basicFormRules : {}" label-position="right">
      <el-form-item label="申请企业：">
        <span>{{ basicForm.id ? basicForm.enterpriseName : companyInfo.name }}</span>
      </el-form-item>
      <el-form-item v-if="basicForm.id" label="产品名称：">
        <p>{{ basicForm.productInfo.join(',') || '未关联' }}</p>
      </el-form-item>
      <el-form-item v-if="basicForm.id" label="生产批次号：">
        <p>{{ basicForm.batchInfo.join(',') || '未关联' }}</p>
      </el-form-item>
      <el-form-item v-if="basicForm.id" label="申请时间：">
        <p>{{ basicForm.applyTime }}</p>
      </el-form-item>
      <el-form-item v-if="basicForm.id" label="申请账号：">
        <p>{{ basicForm.apply }}</p>
      </el-form-item>
      <el-form-item v-if="basicForm.id" label="申请状态：">
        <p>{{ basicForm.statusDescription }}</p>
      </el-form-item>
      <el-form-item v-if="basicForm.id && basicForm.status !== 1" label="审核时间：">
        <p>{{ basicForm.reviewTime }}</p>
      </el-form-item>
      <el-form-item v-if="basicForm.id && basicForm.status == 5" label="审核备注：">
        <p>{{ basicForm.remarks }}</p>
      </el-form-item>
      <el-form-item label="标签样式：" prop="labelType">
        <p v-if="basicForm.id"> {{ basicForm.labelType }}<span style="color: #0f58ff;cursor: pointer;margin-left: 5px;" @click="imgViewerVisible = true">[{{ basicForm.labelType }}示例]</span></p>
        <el-radio-group v-else v-model="basicForm.labelType">
          <el-radio :label="1">版标</el-radio>
          <el-radio :label="2">卷标</el-radio>
        </el-radio-group>
        <el-image-viewer v-if="imgViewerVisible && (basicForm.labelType == 1 || basicForm.labelType == '版标' || basicForm.labelType == '页标')" :z-index="9999" :url-list="[require('@/assets/images/page-label.jpg')]" :on-close="closeViewer" />
        <el-image-viewer v-if="imgViewerVisible && (basicForm.labelType == 2 || basicForm.labelType == '卷标')" :z-index="9999" :url-list="[require('@/assets/images/scroll-label.jpg')]" :on-close="closeViewer" />
        <p v-if="!basicForm.id" style="color: #0f58ff;cursor: pointer" @click="imgViewerVisible = true">[{{ basicForm.labelType == 1 ? '版标' : '卷标' }}示例]</p>
      </el-form-item>
      <el-form-item label="标签尺寸： " prop="labelSize">
        <p v-if="basicForm.id && basicForm.labelType"> {{ basicForm.labelSize }}<span style="color: #0f58ff;margin-left: 5px;">[尺寸{{ (basicForm.labelSize == 1 || basicForm.labelSize == '小标') ? '30x20mm' : '40x26.6mm' }}]</span></p>
        <el-radio-group v-else v-model="basicForm.labelSize">
          <el-radio :label="1">小标</el-radio>
          <el-radio :label="2">大标</el-radio>
        </el-radio-group>
        <p v-if="basicForm.labelSize && !basicForm.id" style="color: #0f58ff;">[尺寸{{ basicForm.labelSize == 1 ? '30x20mm' : '40x26.6mm' }}]</p>
      </el-form-item>
      <el-form-item v-if="!basicSet" label="产品名称： " prop="batchInfo">
        <el-table
          :header-cell-style="{background:'#f7f8fa'}"
          :data="labels"
        >
          <el-table-column label="产品名称" prop="productName" min-width="120" show-overflow-tooltip />
          <el-table-column label="批次号" prop="batchNo" min-width="220" show-overflow-tooltip />
          <el-table-column label="标签数量" prop="quantity" min-width="350" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- 此span用于tooltip弹框中显示 -->
              <span style="opacity: 0;">{{ scope.row.quantity }}</span>
              <el-input-number v-model="scope.row.quantity" style="width: 150px" controls-position="right" :min="1" :max="1000000" @input.native="changeInput" />
              <!-- <span>页 * （12枚/页）= {{ (scope.row.quantity || 0) * 12 }} 枚</span> -->
              <span style="line-height:32px; margin-left:5px">枚</span>
            </template>
          </el-table-column>
          <el-table-column label="移除" prop="batchNo" width="60" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button v-if="labels && labels.length > 1" type="text" @click="deleteCurrent(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-form-item>
      <el-form-item v-if="basicSet" label="标签数量：" prop="quantity">
        <p v-if="basicForm.id">{{ basicForm.quantity }} 枚</p>
        <!-- <p v-if="basicForm.id">{{ basicForm.quantity }}（{{ Math.ceil(basicForm.quantity/12) }}页×12枚/页）</p> -->
        <span v-else>
          <el-input-number v-model="basicForm.quantity" style="width: 150px" controls-position="right" :min="1" :max="1000000" @input.native="changeInput" />
          <span>枚</span>
          <!-- <span>页 * （12枚/页）= {{ totalQuantity }} 枚</span> -->
          <!-- <p style="color: #C3C3C3;font-size:12px;">请输入数值，小数点保留2位</p> -->
        </span>
      </el-form-item>
      <el-form-item v-if="!basicForm.id" label="选择收货地址: ">
        <el-select v-model="shippingArea" placeholder="请选择收货地址" style="width: 100%" @change="changeAddress">
          <el-option v-for="(item,index) in addressList" :key="index" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="收货地区：" prop="areaArr">
        <p v-if="basicForm.id"> {{ basicForm.shippingArea }}</p>
        <el-cascader
          v-else
          ref="areaArr"
          v-model="basicForm.areaArr"
          :options="countryAreaTreeCH"
          :props="{ value: 'label' }"
          :disabled="!!shippingArea"
          filterable
          clearable
          style="width: 100%"
          placeholder="请选择收货地区"
        />
      </el-form-item>
      <el-form-item label="收货地址：" prop="shippingAddress">
        <p v-if="basicForm.id"> {{ basicForm.shippingAddress }}</p>
        <el-input v-else v-model="basicForm.shippingAddress" :disabled="!!shippingArea" placeholder="请输入收货地址" maxlength="50" clearable style="width:100%" @blur="basicForm.shippingAddress = basicForm.shippingAddress.trim()" />
      </el-form-item>
      <el-form-item label="联系人：" prop="shippingContact">
        <p v-if="basicForm.id"> {{ basicForm.contact }}</p>
        <el-input v-else v-model="basicForm.shippingContact" :disabled="!!shippingArea" placeholder="请输入联系人" maxlength="30" clearable style="width:100%" @blur="basicForm.shippingContact = basicForm.shippingContact.trim()" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="shippingPhone">
        <p v-if="basicForm.id"> {{ basicForm.contactPhone }}</p>
        <el-input v-else v-model="basicForm.shippingPhone" :disabled="!!shippingArea" placeholder="请输入联系电话" maxlength="13" clearable style="width:100%" @blur="basicForm.shippingPhone = basicForm.shippingPhone.trim()" />
      </el-form-item>
      <el-form-item v-if="basicForm.id && (basicForm.status == 3 || basicForm.status == 4 )" label="物流单号：" prop="shippingNo">
        <p> {{ basicForm.shippingNo }}</p>
      </el-form-item>
    </el-form>
    <!-- 【查看版标/卷标示例】 -->
    <!-- <div v-if="imgViewerVisible" class="label-images">
      <img v-if="basicForm.labelType == 1" style="width: 500px" src="../../../assets/images/page-label.jpg">
      <img v-if="basicForm.labelType == 2" style="width: 500px" src="../../../assets/images/scroll-label.jpg">
    </div> -->
  </div>
</template>
<script>
import { checkTelphone } from '../../../utils/validate'
import { mapGetters } from 'vuex'
import elImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: { elImageViewer },
  props: {
    basicSet: { // true基础模块-标签申请, false批次信息-标签申请
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        current: 1,
        rows: 15,
        total: 0,
        categoryId: [],
        updateDate: '',
        status: '',
        productionPlace: [],
        productName: '',
        productCode: '',
        endDate: '',
        startDate: '',
        filter: true
      },
      basicForm: {
        batchInfo: ['1'],
        labelSize: 1,
        labelType: 1,
        quantity: 1,
        shippingAddress: '',
        shippingContact: '',
        shippingPhone: '',
        areaArr: []
      },
      basicFormRules: {
        labelSize: [{ required: true, message: '', trigger: 'change' }],
        labelType: [{ required: true, message: '', trigger: 'change' }],
        batchInfo: [{ required: true, message: '', trigger: 'change' }],
        quantity: [{ required: true, message: '请输入标签数量', trigger: ['blur', 'change'] }],
        areaArr: [{ required: true, message: '请选择收货地区', trigger: ['blur', 'change'] }],
        shippingAddress: [{ required: true, message: '请输入收货地址', trigger: ['blur', 'change'] }],
        shippingContact: [{ required: true, message: '请输入联系人', trigger: ['blur', 'change'] }],
        shippingPhone: [{ required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
          { validator: checkTelphone, trigger: 'blur' }]
      },
      shippingArea: '',
      addressList: [],
      labels: [],
      formType: 1, // 1标签申请， 2申请详情
      imgViewerVisible: false // 查看卷标版标图片示例弹框
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree', 'companyInfo'
    ]),
    countryAreaTreeCH() {
      const data = this.countryAreaTree.filter(item => item.areaName.indexOf('中国') > -1)
      if (data && data.length > 0) {
        return data[0].child
      } else {
        return []
      }
    },
    totalQuantity() {
      const value = ((this.basicForm.quantity || 0)).toString()
      // const value = ((this.basicForm.quantity || 0) * 12).toString()
      return value.indexOf('.') >= 0 ? value.substring(0, value.indexOf('.') + 3) : value
    }
  },
  mounted() {
    this.getAddressList()
  },
  methods: {
    showPicture() {
      this.imgViewerVisible = true
    },
    closeViewer() {
      document.body.style.overflow = ''
      this.imgViewerVisible = false
    },
    changeAddress(val) {
      if (val) {
        const data = this.addressList.find(item => item.id === val)
        const areaArr = []
        if (data.area) {
          areaArr.unshift(data.area)
        }
        if (data.city) {
          areaArr.unshift(data.city)
        }
        if (data.province) {
          areaArr.unshift(data.province)
        }
        this.basicForm.areaArr = []
        this.basicForm.areaArr = areaArr
        this.basicForm.shippingAddress = data.address
        this.basicForm.shippingContact = data.contact
        this.basicForm.shippingPhone = data.contactPhone
      }
    },
    getAddressList() {
      this.$backend.request(this.$api.basicSetting.getShippingAddressAll).then((res) => {
        const data = res.data || []
        data.forEach(item => {
          item.label = (item.province || '') + (item.city || '') + (item.area || '') + (item.address || '')
        })
        data.unshift({ label: '新增收货地址', id: '' })
        this.addressList = data
      })
    },
    changeInput(e) {
      if ((e.target.value.indexOf('.') >= 0)) {
        e.target.value = e.target.value === '.' ? '' : Math.ceil(e.target.value)
        // e.target.value = e.target.value.substring(0, e.target.value.indexOf('.') + 3) // 这里采用截取 既可以限制第三位小数输入 也解决了数字输入框默认四舍五入问题
      }
    },
    // 提交
    handleSubmitLabel() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          const basicForm = this.$util.ObjectUtils.deepCopy(this.basicForm) || {}
          basicForm.shippingArea = basicForm.areaArr.join('')
          delete basicForm.areaArr
          if (!this.basicSet) {
            const arr = []
            this.labels.forEach((item) => {
              arr.push({ id: item.id, quantity: item.quantity })
            })
            basicForm.batchInfo = arr
          } else {
            basicForm.quantity = this.totalQuantity
            delete basicForm.batchInfo
          }
          this.$backend.request(this.$api.traceabilityInfo.addLableApply, basicForm).then((res) => {
            if (res.success) {
              this.$emit('refreshList')
              // 如选择的新增收货地址，添加到收货地址列表里面
              if (this.shippingArea) {
                return
              }
              const param = {
                areaArr: this.basicForm.areaArr,
                address: this.basicForm.shippingAddress,
                contact: this.basicForm.shippingContact,
                contactPhone: this.basicForm.shippingPhone
              }
              if (param.areaArr && param.areaArr.length > 0) { // 省市区
                param.province = param.areaArr[0] || ''
                param.city = param.areaArr[1] ? param.areaArr[1] : ''
                param.area = param.areaArr[2] ? param.areaArr[2] : ''
              } else {
                param.province = ''
                param.city = ''
                param.area = ''
              }
              delete param.areaArr
              this.$backend.request(this.$api.basicSetting.addShippingAddress, param).then((response) => {
              })
              this.close()
            } else {
              this.$emit('error')
            }
            this.$util.TipsUtils.message(res)
          })
        } else {
          this.$emit('error')
        }
      })
    },
    // 删除已选批次
    deleteCurrent(row) {
      this.labels = this.labels.filter(item => item.id !== row.id)
    },
    close() {
      for (const key in this.basicForm) {
        this.basicForm[key] = ''
      }
      this.basicForm.batchInfo = ['1']
      this.basicForm.labelSize = 1
      this.basicForm.labelType = 1
      this.basicForm.quantity = 1
      this.basicForm.areaArr = []
      this.shippingArea = ''
      this.shippingAddress = ''
      this.shippingContact = ''
      this.shippingPhone = ''
      this.$refs['basicForm'].clearValidate()
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
>>> .el-form-item__error {
  position: unset;
  margin-top: 0px;
}
#label-modal {
  padding: 0 20px;
}
.label-images {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: .5;
    background: #000;
}
</style>>

