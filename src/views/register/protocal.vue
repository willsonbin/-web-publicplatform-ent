<template>
  <div class="wrapper">
    <section class="protocalWrapper">
      <div class="protacalContent ql-snow ql-editor" v-html="info" />
    </section>
    <el-checkbox v-model="checked" :disabled="isDisabled" style="padding:10px 0px" @change="handleChecked">已阅读并同意《<span>{{ name }}</span>》</el-checkbox>
    <section />
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  data() {
    return {
      checked: false,
      info: '',
      isDisabled: true,
      name: ''
    }
  },
  methods: {
    handleChecked() {
      this.$emit('isChecked', this.checked)
    },
    // 获取注册协议
    getSysConfig() {
      this.$backend.request(this.$api.register.getSysConfig).then((response) => {
        if (response.success) {
          this.info = response.data.registerAgreement.content
          this.name = response.data.registerAgreement.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}
    .protocalWrapper{
        border: 1px solid #77A0FF;
        height: 570px;
        width: 80%;
        overflow-y: auto;
        margin-top: -24px;
        margin-bottom: 10px;
        min-width: 560px;
         p{
             line-height: 24px;
             text-indent: 20px;
             color: #333333;
             font-size: 14px;
         }
    }
 .ql-editor{
        overflow: visible;
    }
    .protacalContent{
        color: #000;
        ::v-deep h1{
            display: block;
            font-size: 2em;
            margin-block-start: 0.67em;
            margin-block-end: 0.67em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            font-weight: bold;
        }
        ::v-deep h2{
                display: block;
                font-size: 1.5em;
                margin-block-start: 0.83em;
                margin-block-end: 0.83em;
                margin-inline-start: 0px;
                margin-inline-end: 0px;
                font-weight: bold;
        }
    }
</style>
