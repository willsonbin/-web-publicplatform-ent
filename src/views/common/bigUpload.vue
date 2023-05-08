<template>
  <div id="pic-upload" :style="{height: fileList.length > 0? '600px': '100px'}"><!--:style="{borderColor: requiredFlag==-1?'#ff4949':''}"-->
    <el-upload
      :disabled="authenStatus == 1 ? true:false"
      :size="size"
      :multiple="multiple"
      action="/"
      :auto-upload="false"
      list-type="picture-card"
      :accept="accept"
      :on-change="uploadFile"
    >
      <div class="description">
        <ul>
          <draggable v-model="fileList" chosen-class="chosen" force-fallback="true" group="people" animation="1000" @start="drag=true" @end="drag=false">
            <transition-group>
              <li
                v-for="(item,index) in fileList"
                :key="index"
                class="item"
                @mouseover="handleover(item)"
                @mouseleave="handleleave()"
                @click="authenStatus = 1"
              >
                <img :src="item.url" class="avatar" style="width:490px">
                <div class="del-btn">
                  <el-button plain @click="handleDelPic(index,item)">删除</el-button>
                </div>
                <div class="del-btn" style="margin-top: 46px;">
                  <el-upload
                    :disabled="authenStatus==0?true:false"
                    :size="size"
                    :multiple="multiple"
                    action="/"
                    :auto-upload="false"
                    list-type="picture-card"
                    :accept="accept"
                    :on-change="uploadFile"
                  >
                    <el-button plain style="margin-left: -5px;" @click="changeImage(index,item)">替换</el-button>
                  </el-upload>

                </div>
              </li>
            </transition-group>
          </draggable>
          <li v-if="fileList.length < limit" ref="uploadRef" class="upload-pic" @click="handleClickUpload">
            <i class="el-icon-plus avatar-uploader-icon" />
          </li>
        </ul>

      </div>
    </el-upload>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'PicUpload',
  components: { draggable },
  props: {
    fileImgList: {
      type: Array,
      default: () => []
    },
    arrIndex: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    num: {
      type: Number,
      default: 1
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
      imageUrl: '',
      isReplace: false,
      replaceId: ''
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
    // 图片替换
    changeImage(index, item) {
      this.isReplace = true
      this.replaceId = item.id
      this.authenStatus = 1
    },
    handleClickUpload() {
      this.isReplace = false
      this.authenStatus = 1
      if (this.disabled) {
        return
      }
      this.authenStatus = 0
    },
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
    // 移入显示删除附件
    handleover(item) {
      this.currentFile = item
      this.isShowBtn = true
    },
    // 移出隐藏删除
    handleleave() {
      this.isShowBtn = false
    },
    handleDelPic(index, item) {
      this.fileList.splice(index, 1)
      this.$emit('uploadBigFile', this.fileList, item, this.arrIndex)
    },
    // 上传附件
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
          // if (this.limit > 0) {
          //   if (this.fileList.length >= this.limit) {
          //     this.$emit('uploadBigFile', this.fileList, file, this.arrIndex)
          //     return
          //   }
          // }
          this.fileList.push(response.data)
          if (this.isReplace) {
            this.fileList.splice(this.fileList.findIndex(item => item.id === this.replaceId), 1)
          }
          this.$emit('uploadBigFile', this.fileList, file, this.arrIndex)
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
    >>>.el-upload--picture-card{
        width: 60px;
        height: 60px;
        border: 0;
        border-radius: 4px;
        line-height: 60px;
    }
    >>>.el-upload-list--picture-card{
        display: none;
    }
    .description {
        ul {
            display: flex;
            flex-direction: column;
             width: 100%;
            li {
                position: relative;
                flex-shrink: 0;
                width: 100%;
                height: 100%;
                margin-bottom: -22px;
                z-index: 0;
                .del-btn {
                    color: #333;
                    position: absolute;
                    width: 100%;
                    height: 10%;
                    text-align: center;
                    line-height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    left: 500px;
                    top: 0;
                    // i {
                    //   border: 1px solid #C6C6C6;
                    //     color: #333;
                    //     font-size: 16px;
                    //     font-style: normal;
                    // }
                }
            }
            .upload-pic{
              width: 581px;
              margin-top: 10px;
              height: 40px;
              border: 1px solid #f0f2f2;
              display: flex;
              align-items: center;
              justify-content: center;
            }
        }
    }
}
</style>
