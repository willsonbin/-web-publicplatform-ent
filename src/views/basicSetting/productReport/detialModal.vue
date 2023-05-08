<template>
  <div class="basicInfo">
    <div class="enterInfo">
      <span class="title">检测进度</span>
      <section v-if="detailInfo.status === 1 || detailInfo.status === 2 || detailInfo.status === 3 || detailInfo.status === 6" class="resultContent">
        <span>填写</span>
        <i class="el-icon-arrow-right" />
        <span :class="{'highLight':detailInfo.status===1}">受理</span>
        <i class="el-icon-arrow-right" />
        <span :class="{'highLight':detailInfo.status===2 || detailInfo.status===3}">检测</span>
        <i class="el-icon-arrow-right" />
        <span :class="{'highLight':detailInfo.status===6}">结果</span>
      </section>
      <section v-else class="resultContent">
        <span>填写</span>
        <section v-if="detailInfo.status===4">
          <i class="el-icon-arrow-right" />
          <span class="highLight">已撤回</span>
        </section>
        <section v-if="detailInfo.status===5">
          <i class="el-icon-arrow-right" />
          <span class="highLight">已撤回</span>
        </section>
        <section v-if="detailInfo.status===7">
          <i class="el-icon-arrow-right" />
          <span class="highLight">已取消检测</span>
        </section>
      </section>
    </div>
    <span class="line" />
    <div class="enterInfo">
      <span class="title">检测信息</span>
      <span class="block">检测机构: {{ detailInfo.testingFacilityName }}</span>
      <span class="block">检测产品: {{ detailInfo.productName }}</span>
      <span class="block">检测批次: {{ detailInfo.batchNo }}</span>
      <span class="block">备注: {{ detailInfo.remarks }}</span>
    </div>
    <span v-if="detailInfo.status===6" class="line" />
    <div v-if="detailInfo.status===6" class="enterInfo">
      <span class="title">报告信息</span>
      <span class="block">报告名称: {{ detailInfo.reportName }}</span>
      <span class="block">报告编号: {{ detailInfo.reportNo }}</span>
      <span class="block">上传报告:
        <el-button v-if="detailInfo.reportImages && detailInfo.reportImages.length > 0" type="text" @click="downLoadImgs">下载</el-button>
        <span v-else>暂无</span>
      </span>
      <span class="block">依据标准: {{ detailInfo.standard }}</span>
      <span class="block">标准说明: {{ detailInfo.standardNotes }}</span>
      <span class="block">检测视频：</span>
      <span v-for="(item) of detailInfo.vedioList" :key="item.id" style="margin-top:10px">
        <video
          preload="auto"
          width="100%"
          height="100%"
          controls="true"
        >
          <source :src="item.url" type="video/mp4">
          <source :src="item.url" type="video/flv">
        </video>
      </span>
    </div>
  </div>
</template>

<script>
import { axios } from '@/utils/backend'
export default {
  data() {
    return {
      detailInfo: {},
      currentStatus: ''
    }
  },
  methods: {
    downLoadImgs() {
      const imgUrls = this.detailInfo.imagList.map(item => item.url)
      const param = {
        imgUrls: imgUrls
      }
      axios({
        method: 'POST',
        url: window.config.traceUrl + '/productReview/downloadPics',
        data: param,
        responseType: 'blob'
      }).then(res => {
        this.loading = false
        this.$util.DownLoadUtils.jsDownload(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 详情
    getProDetailInfo(id) {
      this.$backend.request(this.$api.basicSetting.getProDetailInfo, { id }).then(res => {
        if (res.success) {
          const imagList = []
          const vedioList = []
          this.detailInfo = res.data
          if (res.data.reportImages && res.data.reportImages.length > 0) {
            res.data.reportImages.map((item) => {
              if (item) {
                const strName = item.url.lastIndexOf('.')
                const suffixStr = item.url.substring(strName + 1, strName.length)
                if (suffixStr === 'jpg' || suffixStr === 'png' || suffixStr === 'pdf') {
                  imagList.push(item)
                  this.detailInfo.imagList = imagList
                } else {
                  vedioList.push(item)
                  this.detailInfo.vedioList = vedioList
                }
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basicInfo{
    display: flex;
    flex-direction: column;
    margin-top: -20px;
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
        padding: 20px 0px;
    .block{
        width: 100%;
       padding: 20px 0px 0px 20px;
    }
    .halfBlock{
        width: 50%;
       padding: 20px 0px 0px 20px;
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
  .line{
    width: 100%;
    height: 1px;
    background: #F0F2F2;
  }
  .title{
    font-weight: bold;
    display: block;
  }
  .resultContent{
    display: flex;
    font-size: 16px;
    width: 100%;
    margin-top: 20px;
      span{
        padding: 0px 10px;
      }
      .highLight{
        color: #0F58FF;
      }
  }
}
</style>

