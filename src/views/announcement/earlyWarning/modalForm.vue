<template>
  <div>
    <el-dialog
      title="预警详情"
      :visible.sync="formVisible"
      width="30%"
    >
      <section class="wrapper">
        <section class="titleContent">
          <h3>{{ detailInfo.title }}</h3>
          <span class="timeContent">{{ detailInfo.createDate }}</span>
          <span class="line" />
        </section>
        <!-- <section class="detailContent">
          <div class="gap">
            <p>扫描码值：<b>00056656565514</b></p>
            <p>经销商：</p>
          </div>
          <ul class="detailList">
            <li><i class="dot" />cesrewrewrgrfhgfhghhn</li>
            <li><i class="dot" />cesrewrewrgrfhgfhghhn</li>
            <li><i class="dot" />cesrewrewrgrfhgfhghhn</li>
          </ul>
        </section> -->
        <section class="detailContent">
          <div class="ql-editor" v-html="detailInfo.text">
            {{ detailInfo.text }}
          </div>
        </section>
        <!-- <section>
          <p class="tips">注：以上数据仅供参考，数据来自系统用户允许授权后，获取的扫码地理位置，出现同一码值出现在多地扫码触发的预警告知提醒。</p>
        </section> -->
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="formVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  data() {
    return {
      formVisible: false,
      detailInfo: {}
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.wrapper{
    font-size: 14px;
    color: #333;
    .tips{
       color: #999999;
    }
}
.titleContent{
    display: flex;
    flex-direction: column;
    h3{
        font-size: 18px;
        height: 36px;
        color: #000;
        line-height: 36px;
        flex: 1
    }
    .timeContent{
        color: #666666;
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        flex: 1;
    }
}
.detailContent{
    padding:10px 0px;
    .gap{
        padding: 20px 0px;
            p{
                height: 24px;
                line-height: 24px;
            }
    }
    .detailList{
        display: flex;
        flex-direction: column;
        justify-content: center;
        li {
            height: 26px;
            line-height: 26px;
        }
    }
}
.line{
     width: 100%;
     height: 1px;
     background: #dcdfe6;
     display: block;
    }
.dot{
    margin: 0px 10px;
    width: 5px;
    height: 5px;
    border-radius: 10px;
    font-style: normal;
    display: inline-block;
    background: #000;
}
</style>
