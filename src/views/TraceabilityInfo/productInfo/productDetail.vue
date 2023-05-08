<template>
  <div>
    <section class="basicInfo">
      <div class="enterInfo">
        <span class="block">产品分类：{{ categoryNames }}</span>
        <span class="halfBlock">产品名称：{{ detailInfo.name }}</span>
        <span class="halfBlock">产品编码：{{ detailInfo.code }}</span>
        <section class="imgContent">
          <span>产品图片：</span>
          <span v-for="item in detailInfo.productImages" :key="item.id">
            <el-image
              style="width: 60px; height: 60px; margin-right:5px"
              :src="item.url"
              :preview-src-list="detailInfo.productImages.map(item => item.url)"
            />
          </span>
          <!-- <img v-for="item in detailInfo.productImages" :key="item.id" :src="item.url" style="width:60px; height:60px"> -->
        </section>
        <span class="halfBlock">产品规格：{{ detailInfo.unitNumber }} {{ unitDescription }}/{{ outUnitDescription }}</span>
        <span class="halfBlock">净含量：{{ detailInfo.weight }} {{ weightDescription }}</span>
        <span class="halfBlock">产地: {{ countryDescription }} {{ provinceDescription }} {{ cityDescription }}</span>
        <span class="block">加工企业: {{ detailInfo.processingEnterprise }}</span>
        <span class="block">加工地址: {{ detailInfo.processingAddress }}</span>
      </div>
    </section>
    <el-tabs v-model="productIntro" type="card">
      <el-tab-pane label="产品属性" name="second">
        <section class="basicInfo">
          <div class="enterInfo">
            <span class="halfBlock">保质期：{{ detailInfo.shelfLife }}
              <span v-if="detailInfo.shelfLifeType === 2">年</span>
              <span v-if="detailInfo.shelfLifeType === 1">月</span>
              <span v-if="detailInfo.shelfLifeType === 0">日</span>
            </span>
            <span class="halfBlock">贮藏条件: {{ detailInfo.storageConditions }}</span>
            <span class="block">执行标准: {{ detailInfo.implementStandard }}</span>
            <span class="block">原料投料:
              <span v-for="item of detailInfo.materials" :key="item.id" style="margin-right:5px"> {{ item.name }}</span>
            </span>
            <span class="block">营养成分: {{ detailInfo.nutritionFacts }}</span>
          </div>
        </section>
        <section v-for="(item) in productAttr" :key="item.id" class="enterInfo">
          <span v-if="item.arrType==='2'" class="block" style="margin-bottom:10px">{{ item.key }}: {{ item.value2.join(' ') }}</span>
          <span v-if="item.arrType==='3'" class="block" style="margin-bottom:10px">{{ item.key }}: {{ item.value3 }}</span>
          <span v-if="item.arrType==='1'" class="block" style="margin-bottom:10px">{{ item.key }}: {{ item.value1 }}</span>
        </section>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="productIntro" type="card">
      <el-tab-pane label="产品介绍" name="second">
        <section v-if="detailInfo.descriptions">
          <img v-for="item in detailInfo.descriptions" :key="item.id" :src="item.url" style="width:80%; height:80%">
        </section>
        <el-empty v-else description="暂无信息" />
      </el-tab-pane>
    </el-tabs>

    <!-- <div v-if="detailInfo.status===0 ||detailInfo.status===1 ||detailInfo.status ===2" class="btnContent" style="margin-top:20px">
      <el-button class="el-button-confirm-two" @click="jumpToIndex">返回</el-button>
      <el-button class="el-button-confirm-two" @click="editProduct">编辑信息</el-button>
      <el-button type="primary" class="el-button-confirm-two" @click="handleSubmit()">提交审核</el-button>
    </div> -->
    <!-- <div v-if="detailInfo.status===3 || detailInfo.status===4" class="btnContent" style="magin-top:20px">
      <el-button class="el-button-confirm-two" @click="jumpToIndex">返回</el-button>
    </div> -->

    <!-- <div v-if="detailInfo.status===0 ||detailInfo.status===1 ||detailInfo.status ===2" class="btnContent" style="margin-top:20px">
      <el-button v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_EDIT')" class="el-button-confirm-two" @click="editProduct">编辑信息</el-button>
      <el-button v-if="hasPermission('MENU_PRODUCT_INFORMATION_BUTTON_SUBMIT_AUDIT')" type="primary" class="el-button-confirm-two" @click="handleSubmit()">提交审核</el-button>
    </div> -->

  </div>

</template>

<script>
export default {
  name: 'ProductDetail',

  data() {
    return {
      detailInfo: {},
      weightDescription: '',
      outUnitDescription: '',
      unitDescription: '',
      countryDescription: '',
      provinceDescription: '',
      cityDescription: '',
      categoryNames: '',
      productIntro: 'second',
      currentId: '',
      formType: '1',
      productAttr: []
    }
  },
  // activated() {
  //   this.currentId = this.$route.query.id || ''
  //   this.formType = this.$route.query.formType
  //   this.getProductsInfo()
  // },
  // deactivated() {
  //   this.currentId = ''
  // },
  methods: {
    // 返回首页
    jumpToIndex() {
      this.$router.push({ path: '/traceability/materialInfo' })
    },
    // 编辑产品
    editProduct() {
      this.$router.push({ path: '/traceability/productInfo/createOrEdit', query: { formType: '2', id: this.currentId }})
    },
    handleSubmit() {
      const param = { ids: [this.currentId], status: 1 }
      this.$backend.request(this.$api.traceabilityInfo.muchProductSubmit, param).then((response) => {
        this.$util.TipsUtils.message(response)
        this.$router.push({ path: '/traceability/productInfo' })
        this.$emit('refreshList')
      })
    },
    messageTips(tipsTile, oprationType, dataName) {
      const h = this.$createElement
      return this.$msgbox({
        title: tipsTile,
        message: h('p', null, [
          h('span', null, `正在准备${oprationType}选择`),
          h('b', { style: 'color: #3369FF' }, dataName),
          h('span', null, '的数据，确认[提交]后，数据不可以恢复。')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
    },
    getProductsInfo(id) {
      this.currentId = id
      this.$backend.request(this.$api.traceabilityInfo.getProductsInfo, this.currentId).then((response) => {
        if (response.success) {
          this.detailInfo = response.data.product
          this.weightDescription = response.data.weightDescription
          this.outUnitDescription = response.data.outUnitDescription
          this.unitDescription = response.data.unitDescription
          this.countryDescription = response.data.countryDescription
          this.provinceDescription = response.data.provinceDescription
          this.cityDescription = response.data.cityDescription
          this.productAttr = JSON.parse(response.data.product.attr)
          this.categoryNames = response.data.categoryNames.join('>')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basicInfo{
    display: flex;
    flex-direction: row;
    .leftInfo{
    width: 70%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    span{
      padding: 20px 0px;
    }
    }
    .rightInfo{
        margin-left: 50px;
    }
    .enterInfo{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0px 0px;
    .block{
        width: 100%;
        padding: 12px 0px;
    }
    .halfBlock{
        width: 50%;
        padding: 12px 0px;
    }
    .labelTitle {
      width: 32%;
    }
  .imgContent{
    display: flex;
    align-items: center;
    width: 100%;
    img {
      margin: 0px 5px;
      display: inline-block;
    }
  }
    }
}
</style>

