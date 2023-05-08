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
      :style="{height: (fileList.length>0 ? '160px' : '60px')}"
    >
      <div class="description">
        <ul>
          <li
            v-for="(item,index) in fileList"
            :key="index"
            @mouseover="handleover(item)"
            @mouseleave="handleleave()"
            @click="authenStatus = 1"
          >
            <div v-if="formType != 3" class="delete-btn">
              <i class="el-icon-close" @click="handleDelPic(index,item)" />
            </div>
            <video
              preload="auto"
              width="200px"
              height="200px"
              controls="true"
              style="margin-top: -44px;"
            >
              <source :src="item.url" type="video/mp4">
              <source :src="item.url" type="video/flv">
            </video>
          </li>
          <li v-if="fileList.length < limit && formType != 3" class="upload-pic" @click="handleClickUpload">
            <i class="el-icon-plus avatar-uploader-icon" />
          </li>
        </ul>
      </div>
    </el-upload>
    <el-dialog title="查看图片" append-to-body :visible.sync="picVisible" :close-on-click-modal="false" width="45%">
      <img :src="currentFile ? currentFile.url : ''" alt="" style="width: 100%;max-height: 90%">
      <!-- <div class="dialog-button">
        <el-button @click="picVisible = false">取消操作</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PicUpload',
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
      isShowBtn: false
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
    console.log('fileList', this.fileList)
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.fileList = []
      for (const img of this.fileImgList) {
        this.fileList.push({
          id: img.id,
          fileName: img.name,
          filePath: img.path,
          fileType: img.type,
          url: img.url })
      }
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
    >>>.el-upload--picture-card{
        width: 60px;
        height: 60px;
        border: 0;
        border-radius: 4px;
        line-height: 60px;
        background: #fff;
    }
    >>>.el-upload-list--picture-card{
        display: none;
    }
    .description {
        ul {
            display: flex;
            li {
                position: relative;
                margin: 0 5px 5px;
                flex-shrink: 0;
                width: 200px;
                height: 160px;
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
