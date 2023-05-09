<template>
  <div id="pic-upload"><!--:style="{borderColor: requiredFlag==-1?'#ff4949':''}"-->
    <el-upload
      :disabled="(authenStatus == 1 || formType == 3) ? true:false "
      :size="size"
      :multiple="multiple"
      action="/"
      :auto-upload="false"
      list-type="picture-card"
      :on-change="uploadFile"
      :accept="accept"
    >
      <div class="description">
        <ul>
          <li
            v-for="(item,index) in fileList"
            :key="index"
            @mouseover="handleover(item)"
            @mouseleave="handleleave()"
            @click="handleClick(item)"
          >
            <div v-if="formType != 3" class="delete-btn">
              <i class="el-icon-close" @click="handleDelPic(index,item)" />
            </div>
            <el-image
              v-if="item.fileType==='image/png' || item.fileType==='image/jpeg'"
              style="width: 100%; height: 100%"
              :src="item.url"
              :preview-src-list="imageList.map(item => item.url)"
            />
            <img v-else src="../../../assets/images/pdf.jpg">
            <el-dialog title="预览" :visible.sync="viewVisible" center width="60%" append-to-body @close="closePreview">
              <el-row :gutter="20">
                <span>共{{ pageCount }}页， 当前第 {{ pdfPage }} 页 </span>
                <el-button type="text" size="mini" @click.stop="previousPage">上一页</el-button>
                <el-button type="text" size="mini" @click.stop="nextPage">下一页</el-button>
              </el-row>
              <pdf
                v-for="(i, idx) in pdfList"
                :key="idx"
                :src="i.url"
                :page="pdfPage"
                style="display: inline-block; width: 100%"
                @num-pages="pageCount = $event"
                @page-loaded="pdfPage = $event"
              />
            </el-dialog>

          </li>
          <li v-if="fileList.length < limit && formType != 3" class="upload-pic" @click="handleClickUpload">
            <!-- <img src="../../assets/images/uploadPic.png"> -->
            <i class="el-icon-plus avatar-uploader-icon" />
          </li>
        </ul>
      </div>
    </el-upload>

  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { getToken } from '@/utils/auth'
export default {
  name: 'PicUpload',
  components: {
    pdf
  },
  props: {
    fileImgList: {
      type: Array,
      default: () => []
    },
    arrIndex: {
      type: Number,
      default: -1
    },
    formType: {
      type: Number,
      default: -1 // 1新增 2编辑 3查看
    },
    num: {
      type: Number,
      default: 3
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '.jpg,.png,.jpeg,.pdf'
    },
    limit: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      authenStatus: 0,
      fileList: [],
      currentFile: '',
      picVisible: false,
      isShowBtn: false,
      imageList: [],
      pdfList: [],
      viewVisible: false,
      pdfPage: 1,
      pageCount: 1,
      token: getToken(),
      url: 'https://api-minio.qccvas.com/qcc-jky-dev/6971051089816715264-滴滴电子发票.pdf'
    }
  },
  watch: {
    fileImgList(newVal) {
      this.initData()
    }
  },
  updated() {
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.fileList = []
      const imgList = []
      const pdfList = []
      for (const img of this.fileImgList) {
        if (img.type === 'image/jpeg' || img.type === 'image/png' || img.type === 'application/pdf') {
          this.fileList.push({
            id: img.id,
            fileName: img.name,
            filePath: img.path,
            fileType: img.type,
            url: img.url })
        }

        if (img.type === 'image/jpeg' || img.type === 'image/png') {
          imgList.push({
            url: img.url
          })
        } else if (img.type === 'application/pdf') {
          pdfList.push({
            url: img.url
          })
        }
      }
      this.imageList = imgList
      this.pdfList = pdfList
    },
    onPreview(item) {
      console.log('onPreview', item)
    },
    handleClickUpload() {
      this.authenStatus = 1
      if (this.formType === 3) {
        return
      }
      this.authenStatus = 0
    },
    // 移入显示删除附件
    handleover(item) {
      this.currentFile = item
      this.isShowBtn = true
    },
    handleClick(item) {
      this.authenStatus = 1
      if (item.fileType === 'application/pdf') {
        this.src = pdf.createLoadingTask({
          url: item.url,
          httpHeaders: { Authorization: 'Bearer ' + this.token }
        })
        this.src.promise.then(pdf => {
          this.viewVisible = true
        })
      } else if (item.fileType === 'video/mp4') {
        this.viewVisible = true
      }
    },
    closePreview() {
      this.pdfPage = 1
      this.viewVisible = false
    },
    previousPage() {
      let p = this.pdfPage
      p = p > 1 ? p - 1 : this.pageCount
      this.pdfPage = p
    },
    nextPage() {
      let p = this.pdfPage
      p = p < this.pageCount ? p + 1 : 1
      this.pdfPage = p
    },
    // 移出隐藏删除
    handleleave() {
      this.isShowBtn = false
    },
    showPic(img) {
      if (img.fileType.indexOf('pdf') === -1) {
        this.picVisible = true
        this.currentFile = img
      } else {
        this.$util.DownLoadUtils.download(img.url, img.fileName, 'pdf')
      }
    },
    handleDelPic(index, item) {
      this.fileList.splice(index, 1)
      this.$emit('uploadFile', this.fileList, item, this.arrIndex)
      /* this.$backend.request(this.$api.foodRecord.fileDelete, { id: item.id }).then((response) => {
        if (response.success) {
          this.fileList.splice(index, 1)
          console.log('删除')
          this.$emit('uploadFile', this.fileList, item, this.arrIndex)
        } else {
          this.$util.TipsUtils.message(response)
        }
      }).catch(() => {
      })*/
    },
    // // 上传附件
    uploadFile(file) {
      if (this.limit > 0) {
        if (this.fileList.length >= this.limit) {
          return
        }
      }
      if (!this.$util.CheckUtils.beforeAvatarUpload(file, this.accept, this.size)) {
        return
      }
      this.$backend.request(this.$api.common.uploadFile, { file: file.raw }, '', true, true).then((response) => {
        if (response.success) {
          if (this.limit > 0) {
            if (this.fileList.length >= this.limit) {
              this.$emit('uploadFile', this.fileList, file, this.arrIndex)
              return
            }
          }
          this.fileList.push(response.data)
          this.$emit('uploadFile', this.fileList, file, this.arrIndex)
        } else {
          this.$util.TipsUtils.message(response)
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
#pic-upload{
  min-width: 260px;
  overflow: hidden;
  overflow-x: auto;
    ::v-deep.el-upload--picture-card{
        width: 60px;
        height: 60px;
        border: 0;
        border-radius: 4px;
        line-height: 60px;
        background: #fff;
    }
    ::v-deep.el-upload-list--picture-card{
        display: none;
    }
    .description {
        ul {
            display: flex;
            li {
                position: relative;
                margin: 0 5px 5px;
                flex-shrink: 0;
                width: 60px;
                height: 60px;
                background: #f7f8fa;
                z-index: 0;
                .del-btn {
                    position: absolute;
                    background: rgba(0, 0, 0, 0.5);
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    line-height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    i {
                        color: white;
                        font-size: 16px;
                    }
                }
                .delete-btn {
                   position: absolute;
                   right: 0;
                   top: 0;
                   width: 16px;
                   height: 16px;
                   background: rgba(0, 0, 0, 0.5);
                   line-height: 16px;
                   z-index: 9999;
                   .el-icon-close {
                     font-size: 16px;
                     color:#fff;
                     opacity: 0.8;
                   }
                }
                img {
                    width: 60px;
                    height: 60px;
                }
            }
            .upload-pic{
              width: 60px;
              height: 60px;
              border: 1px solid #f0f2f2;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                    width: 26px;
                    height: 26px;
                }
            }
        }
    }
}
</style>
