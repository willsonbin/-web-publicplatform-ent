<template>
  <div class="form-content">
    <div class="row-title" style="padding-top: 0px">
      <span>基本信息</span>
      <span class="row-title-tips">（此必填，带<span style="color: red">*</span>为必填）</span>
    </div>
    <div class="flex-form-submit flex-form-submit-two">
      <el-form ref="basicForm" :model="basicForm" label-width="120px" :rules="basicFormRules" :disabled="formType == 3 ? true: false">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="basicForm.goodsName" maxlength="100" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="商品品类" prop="goodsType">
          <el-select v-model="basicForm.goodsType" clearable placeholder="请选择" style="width: 100%" filterable>
            <el-option v-for="(item) of goodsTypeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="basicForm.brand" maxlength="100" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="原产地/地区" prop="counrtyRegion">
          <el-cascader
            v-model="basicForm.counrtyRegion"
            :options="countryAreaTree"
            :props="{label:'name',value: 'id'}"
            filterable
            style="width: 100%"
            placeholder="请选择"
            clearable
          />
        </el-form-item>
        <el-form-item label="生产企业" prop="produceOrg">
          <el-input v-model="basicForm.produceOrg" maxlength="100" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="保质期" prop="shelfLife">
          <el-input v-model="basicForm.shelfLife" maxlength="50" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="规格" prop="standard">
          <el-input v-model="basicForm.standard" maxlength="50" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="净重（kg）" prop="netWeight">
          <el-input v-model="basicForm.netWeight" v-Int="{data: basicForm ,filed:'netWeight',type:'decimal'}" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="进口日期" prop="importDate">
            <el-date-picker
              v-model="basicForm.importDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item> -->
        <el-form-item label="HS编码" prop="hsCode" style="width: 100%">
          <el-select v-model="basicForm.hsCode" clearable placeholder="请输入" style="width: 100%" filterable :remote-method="remoteMethodHscode" remote :loading="selectLoading">
            <el-option v-for="(item) of hsCodeList" :key="item.id" :label="item.hsCode + '（'+ item.name+'）'" :value="item.hsCode" :title="item.hsCode+ '（'+ item.name+'）'" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDesc" style="width:100%">
          <el-input v-model="basicForm.goodsDesc" type="textarea" maxlength="100" placeholder="请输入" clearable />
        </el-form-item>
      </el-form>
    </div>
    <div class="row-title">
      <span>{{ formType==3?'商品图片':'商品图片上传' }}</span>
      <span v-if="formType!=3" class="row-title-tips">（上传限制jpg、png格式，单次上传不允许超过2M，最多可上传三张）</span>
    </div>
    <div class="flex-form-submit">
      <!-- <el-form ref="fileForm" :model="fileForm" :rules="fileFormRules" label-width="120px" >
          <el-form-item label-width="0" prop="goodPic"> -->
      <PicUpload accept=".jpg,.png" :file-img-list="fileForm.goodPic || []" :multiple="true" :limit="3" :arr-index="-1" :disabled="formType === 3 ? true: false" @uploadFile="uploadCerFile" />
      <!-- </el-form-item>
        </el-form> -->
    </div>
  </div>
</template>

<script>
import PicUpload from '../../common/picUpload'
import { mapGetters } from 'vuex'
export default {
  name: 'EnterpriseGoodsDetail',
  components: { PicUpload },
  data() {
    return {
      basicForm: {
        goodsName: '',
        goodsType: '',
        standard: '',
        produceOrg: '',
        counrtyRegion: '',
        netWeight: '',
        shelfLife: '',
        goodsDesc: '',
        hsCode: '',
        brand: '',
        importDate: ''
      },
      basicFormRules: {
        goodsName: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }],
        goodsType: [{ required: true, message: ' ', trigger: 'change' }],
        brand: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }],
        produceOrg: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }],
        counrtyRegion: [{ required: true, message: ' ', trigger: 'change' }],
        shelfLife: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }],
        hsCode: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }]
      },
      fileForm: {
        goodPic: []
      },
      fileFormRules: {},
      formType: 1, // 1新增，2编辑，3查看
      selectLoading: false,
      hsCodeList: [],
      // 1:美妆 2:个护 3:食品 4:保健 5:母婴用品 6:服饰 7:鞋包 8:家居 9:数码 10:其他
      goodsTypeList: [{ name: '美妆', id: 1 }, { name: '个护', id: 2 }, { name: '食品', id: 3 }, { name: '保健', id: 4 }, { name: '母婴用品', id: 5 }, { name: '服饰', id: 6 }, { name: '鞋包', id: 7 }, { name: '家居', id: 8 }, { name: '数码', id: 9 }, { name: '其他', id: 10 }]
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ])
  },
  watch: {
    formType(newVal) {
      if (newVal === 2 || newVal === 3) {
        this.$backend.request(this.$api.enterprise.getGoodsIfoById, { id: this.basicForm.id }).then((response) => {
          if (response.success) {
            this.basicForm = response.data
            this.fileForm.goodPic = response.data.goodPic || []
          }
        })
      }
    }
  },
  methods: {
    // 获取hscode列表
    remoteMethodHscode(query) {
      this.selectLoading = true
      this.$backend.request(this.$api.common.getHScodeList, { keyWords: query }).then((response) => {
        this.selectLoading = false
        if (response.success) {
          this.hsCodeList = response.data || []
        }
      }).catch(() => {
        this.selectLoading = false
      })
    },
    submit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.$confirm('是否确认提交？', '提示', {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            closeOnClickModal: false,
            type: 'warning'
          })
            .then(() => {
              var url
              switch (this.formType) {
                case 1:
                  url = this.$api.enterprise.addGoods
                  break
                case 2:
                  url = this.$api.enterprise.editGoods
                  break
              }
              const param = this.$util.ObjectUtils.deepCopy(this.basicForm)
              for (const item in param) {
                if (this.$util.StringUtils.isArray(param[item])) {
                  param[item] = param[item].pop()
                }
              }
              param.goodPic = this.fileForm.goodPic
              this.$backend.request(url, param).then((response) => {
                this.$util.TipsUtils.message(response)
                if (response.success) {
                  this.$emit('handleSubmit')
                  this.initData()
                  this.clear()
                }
              })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    uploadCerFile(goodPic, file, index) {
      index = parseInt(index)
      var me = this
      if (index === -1) {
        me.fileForm.goodPic = []
        for (const files of goodPic) {
          me.fileForm.goodPic.push({
            id: files.id,
            name: files.fileName,
            path: files.filePath,
            type: files.fileType,
            url: files.furl
          })
        }
      }
    },
    close() {
      if (this.formType !== 1) {
        this.initData()
        this.clear()
        this.$emit('handleCancel')
        return
      }
      // 新增提示确认弹框
      this.$confirm('是否确认取消？', '取消', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          this.initData()
          this.clear()
          this.$emit('handleCancel')
        })
        .catch(() => {})
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
      this.fileForm.goodPic = []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
