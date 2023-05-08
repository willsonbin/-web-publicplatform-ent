<template>
  <div>
    <el-form ref="basicForm" :model="basicForm" label-width="110px" label-position="right">
      <el-form-item label="申请企业：">
        <span> {{ basicForm.name }} </span>
      </el-form-item>
      <el-form-item label="申请状态：">
        <span v-if="basicForm.status == 1">待审核</span>
        <span v-if="basicForm.status == 4">已提交</span>
        <span v-if="basicForm.status == 2">已审核</span>
        <span v-if="basicForm.status == 3">不通过</span>
      </el-form-item>
      <el-form-item label="申请时间：">
        <span> {{ basicForm.createDate }} </span>
      </el-form-item>
      <el-form-item label="审核时间：">
        <span> {{ basicForm.reviewDate }} </span>
      </el-form-item>
      <el-form-item v-if="basicForm.status == 3" label="理由：">
        <span> {{ basicForm.remarks }} </span>
      </el-form-item>
      <span class="line" />
      <el-form-item label="认证机构：" style="margin-top: 5px;">
        <section style="display: flex;align-items: center;">
          <span> {{ basicForm.institutionName }} </span>
          <img src="../../../assets/images/certification.png" style="width:12%; margin-left:10px">
        </section>
      </el-form-item>
      <el-form-item label="证书名称：">
        <span> {{ basicForm.certificationName }} </span>
      </el-form-item>
      <el-form-item label="证书编号：">
        <span> {{ basicForm.certificationNo }} </span>
      </el-form-item>
      <el-form-item ref="diagramRef" label="证书图片：" prop="certificationImages">
        <section class="imgContent">
          <span v-for="item in basicForm.certificationImages" :key="item.id">
            <el-image
              style="width: 60px; height: 60px; margin-right:5px"
              :src="item.url"
              :preview-src-list="basicForm.certificationImages.map(item => item.url)"
            />
          </span>
        </section>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      basicForm: {
        name: '',
        createDate: '',
        reviewDate: '',
        remarks: '',
        institutionId: '',
        certificationName: '',
        certificationNo: '',
        certificationImages: [],
        status: '',
        institutionName: '',
        id: ''
      }
    }
  },
  methods: {
  // 获取详细信息
    getDetailInfo(item) {
      console.log('item', item)
      this.basicForm.certificationName = item.certificationName
      this.basicForm.certificationNo = item.certificationNo
      this.basicForm.certificationImages = item.certificationImages
      this.basicForm.institutionName = item.institutionName
      this.basicForm.name = item.name
      this.basicForm.status = item.status
      this.basicForm.createDate = item.createDate
      this.basicForm.reviewDate = item.reviewDate
      this.basicForm.remarks = item.remarks
      this.basicForm.id = item.id
      if (item.institutionId === null) {
        this.basicForm.institutionId = item.institutionName
      } else {
        this.basicForm.institutionId = item.institutionId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.imgContent{
    display: flex;
    flex-wrap: wrap;
}
.line{
    width: 100%;
    height: 1px;
    background: #dcdfe6;
    display: block;
    }
>>> .el-form-item{
  margin-bottom: 10px;
}
</style>
