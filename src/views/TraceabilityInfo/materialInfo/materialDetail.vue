<template>
  <div>
    <section class="basicInfo" style="border:none">
      <div class="enterInfo">
        <span class="block">原料分类：{{ categoryNames }}</span>
        <span class="block">产品名称：{{ detailInfo.name }}</span>
        <span class="block">产品编码：{{ detailInfo.code }}</span>
        <section class="imgContent">
          <span>产品图片：</span>
          <span v-for="item in detailInfo.materialImages" :key="item.id">
            <el-image
              style="width: 60px; height: 60px; margin-right:5px"
              :src="item.url"
              :preview-src-list="detailInfo.materialImages.map(item => item.url)"
            />
          </span>
          <!-- <img v-for="item in detailInfo.materialImages" :key="item.id" :src="item.url" style="width:60px; height:60px"> -->
        </section>
        <span class="halfBlock">重量：{{ detailInfo.weight }} {{ unit }}</span>
        <span class="halfBlock">产地: {{ countryDescription }} {{ provinceDescription }} {{ cityDescription }}</span>
        <span class="block">生产企业: {{ detailInfo.productEnterprise }}</span>
      </div>
    </section>
    <el-tabs v-model="productIntro" type="card">
      <el-tab-pane label="产品属性" name="second">
        <div v-for="(item) in productAttr" :key="item.id" class="enterInfo">
          <span v-if="item.arrType==='2'" class="block" style="margin-bottom:10px">{{ item.key }}: {{ item.value2.join(' ') }}</span>
          <span v-if="item.arrType==='3'" class="block" style="margin-bottom:10px">{{ item.key }}: {{ item.value3 }}</span>
          <span v-if="item.arrType==='1'" class="block" style="margin-bottom:10px">{{ item.key }}: {{ item.value1 }}</span>
        </div>
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
    <!-- <div v-if="detailInfo.status===0||detailInfo.status===1 ||detailInfo.status ===2" class="btnContent" style="magin-top:20px">
      <el-button v-if="hasPermission('MENU_MATERIAL_INFORMATION_BUTTON_EDIT')" class="el-button-confirm-two" @click="editMaterial">编辑信息</el-button>
      <el-button v-if="hasPermission('MENU_MATERIAL_INFORMATION_BUTTON_SUBMIT_AUDIT')" type="primary" class="el-button-confirm-two" @click="handleSubmit()">提交审核</el-button>
    </div> -->
    <!-- <div v-if="detailInfo.status===3 || detailInfo.status===4" class="btnContent" style="magin-top:20px">
      <el-button class="el-button-confirm-two" @click="jumpToIndex">返回</el-button>
    </div> -->
  </div>

</template>

<script>
export default {
  name: 'MaterialDetail',

  data() {
    return {
      detailInfo: {},
      productIntro: 'second',
      countryDescription: '',
      cityDescription: '',
      provinceDescription: '',
      unit: '',
      currentId: '',
      formType: '1',
      categoryNames: '',
      productAttr: []
    }
  },
  // activated() {
  //   this.currentId = this.$route.query.id || ''
  //   this.formType = this.$route.query.formType
  //   this.getMaterialInfo()
  // },
  // deactivated() {
  //   this.currentId = ''
  //   this.formType = '1'
  // },
  methods: {
    // 返回首页
    jumpToIndex() {
      this.$router.push({ path: '/traceability/materialInfo' })
    },
    // 编辑原料
    editMaterial() {
      this.$router.push({ path: '/traceability/materialInfo/createOrEdit', query: { formType: '2', id: this.currentId }})
    },
    handleSubmit() {
      const param = { ids: [this.currentId], status: 1 }
      this.$backend.request(this.$api.traceabilityInfo.muchSubmit, param).then((response) => {
        this.$router.push({ path: '/traceability/materialInfo' })
        this.$util.TipsUtils.message(response)
        this.$emit('refeshList')
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
    getMaterialInfo(id) {
      this.currentId = id
      this.$backend.request(this.$api.traceabilityInfo.getMaterialInfo, this.currentId).then((response) => {
        if (response.success) {
          this.detailInfo = response.data.material
          this.unit = response.data.weightDescription
          this.countryDescription = response.data.countryDescription
          this.provinceDescription = response.data.provinceDescription
          this.cityDescription = response.data.cityDescription
          this.productAttr = JSON.parse(response.data.material.attr)
          this.categoryNames = response.data.categoryNames.join('>')
          // const arr = response.data.categoryNames
          // if (arr instanceof Array) {
          //   this.categoryNames = arr.join('>')
          // } else {
          //   this.categoryNames = response.data.categoryName
          // }
        }
      })
    }
    // getProductAttr() {
    //   this.$backend.request(this.$api.traceabilityInfo.getProductAttr, this.currentMaterailId).then((response) => {
    //     if (response.success) {
    //       this.productAttr = response.data
    //       this.productAttr.forEach((item) => {
    //         item.attr = JSON.parse(item.attr)
    //       })
    //     }
    //     console.log('getProductAttr', this.productAttr)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.basicInfo{
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #dfe4ed;
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

