<template>
  <el-dialog title="详情" :visible.sync="formVisible" :close-on-click-modal="false" width="40%" class="custom-dialog" @close="close">
    <div class="single-moudle">
      <h3>检测进度：</h3>
      <div>
        <el-steps v-if="active" class="single-steps" :active="active" simple>
          <el-step title="填写" />
          <el-step v-if="form.status == 4" title="已撤回" />
          <el-step v-if="form.status == 5" title="已取消" />
          <el-step v-if="form.status == 7" title="取消检测" />
          <el-step v-if="form.status !== 4 && form.status !== 5 && form.status !== 7" title="受理" />
          <el-step v-if="form.status !== 4 && form.status !== 5 && form.status !== 7" title="检测" />
          <el-step v-if="form.status !== 4 && form.status !== 5 && form.status !== 7" title="结果" />
        </el-steps>
      </div>
    </div>
    <div class="single-moudle">
      <h3>检测信息：</h3>
      <div>
        <ul>
          <li><span class="title">检测机构：</span><span>{{ form.testingFacilityName }}</span></li>
          <li><span class="title">检测产品：</span><span>{{ form.productName }}</span></li>
          <li><span class="title">功效宣称：</span><span>{{ form.effectName }}</span></li>
          <li><span class="title">备注：</span><span>{{ form.remarks || '无' }}</span></li>
        </ul>
      </div>
    </div>
    <div v-if="form.status === 6" class="single-moudle">
      <h3>报告信息：</h3>
      <div>
        <ul>
          <li><span class="title">报告名称：</span><span>{{ form.reportName }}</span></li>
          <li><span class="title">报告编号：</span><span>{{ form.reportNo }}</span></li>
          <li><span class="title">报告图片：</span>
            <span v-if="form.reportImages && form.reportImages.length > 0" style="text-decoration:underline;color:#0f58ff;cursor:pointer" @click="showImgs">下载</span>
            <span v-else>暂无</span>
          </li>
          <li><span class="title">依据标准：</span><span>{{ form.standard }}</span></li>
          <li><span class="title">功效宣称评价结论：</span><span>{{ form.conclusion }}</span></li>
        </ul>
      </div>
    </div>
    <!-- 点击【图片】查看大图 -->
    <el-dialog title="查看" append-to-body :visible.sync="imgVisible" :close-on-click-modal="false" width="45%" class="img-dialog" @close="imgVisible = false;currentIndex=0">
      <el-carousel trigger="click" height="600px" :initial-index="currentIndex" :autoplay="false">
        <el-carousel-item v-for="item in form.reportImages" :key="item.id">
          <img style="max-width: 100%;max-height: 100%" :src="item.url">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { axios } from '@/utils/backend'
export default {
  name: 'ModalForm',
  data() {
    return {
      formVisible: false,
      form: {},
      currentIndex: 0,
      imgVisible: false
    }
  },
  computed: {
    active() {
      let value = ''
      switch (this.form.status) {
        // 1: '待受理',2: '已受理',3: '检测中',4: '已撤回',5: '已取消',6: '已检测',7: '取消检测'
        case 1:
        case 4:
        case 5:
        case 7:
          value = 2
          break
        case 2:
        case 3:
          value = 3
          break
        case 6:
          value = 4
          break
      }
      return value
    }
  },
  mounted() {
  },
  methods: {
    showImgs() {
      const imgUrls = this.form.reportImages.map(item => item.url)
      const param = {
        imgUrls: imgUrls
      }
      axios({
        method: 'POST',
        url: window.config.traceUrl + '/effectReview/downloadPics',
        data: param,
        responseType: 'blob'
      }).then(res => {
        this.loading = false
        this.$util.DownLoadUtils.jsDownload(res)
      }).catch(err => {
        console.log(err)
      })
    },
    close() {
      this.form = {}
      this.formVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.single-moudle {
    margin-bottom: 20px;
    h3 {
      font-size: 14px;
      color: #000;
      margin: 15px 0;
    }
    >div {
        padding: 0 20px;
        ul > li {
            line-height: 24px;
            color: #666;
            display: flex;
            margin: 5px 0;
            .title {
                color: #000;
                width: 86px;
                flex-shrink: 0;
                text-align: right;
                white-space: pre-wrap;
                margin-right: 10px;
            }
        }
    }
    ::v-deep .el-step .el-step__head {
      display: none;
    }
}
.img-dialog .el-carousel__item {
    display: flex;
    justify-content: center;
}
</style>
