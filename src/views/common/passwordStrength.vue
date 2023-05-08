<template>
  <div class="intensity">
    <span class="psdText">密码强度</span>
    <span
      class="line"
      :class="[level.includes('low') ? 'low' : '']"
    />
    <span
      class="line"
      :class="[level.includes('middle') ? 'middle' : '']"
    />
    <span
      class="line"
      :class="[level.includes('high') ? 'high' : '']"
    />
  </div>
</template>

<script>
export default {
  props: {
    newPws: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      level: []
    }
  },
  watch: {
    newPws(val) {
      this.level = []
      this.checkPassword('rule', val, function() {})
    }
  },
  methods: {
    checkPassword(rule, value, callback) {
    // 校验是数字
      const regex1 = /^\d+$/
      // 校验字母
      const regex2 = /^[A-Za-z]+$/
      // 校验符号
      const regex3 =
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$/
      if (regex1.test(value)) {
        this.level.push('low')
      } else if (regex2.test(value)) {
        this.level.push('low')
      } else if (regex3.test(value)) {
        this.level.push('low')
      } else if (/^[A-Za-z\d]+$/.test(value)) {
        this.level.push('low')
        this.level.push('middle')
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\d]+$/.test(
          value
        )
      ) {
        this.level.push('low')
        this.level.push('middle')
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z]+$/.test(
          value
        )
      ) {
        this.level.push('low')
        this.level.push('middle')
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z\d]+$/.test(
          value
        )
      ) {
        this.level.push('low')
        this.level.push('middle')
        this.level.push('high')
      }
      return callback()
    }
  }
}
</script>

<style lang="scss" scoped>
.intensity {
  .psdText {
    font-size: 12px;
    margin-right: 10px;
  }
  .line {
    display: inline-block;
    width: 48px;
    height: 4px;
    background: #d8d8d8;
    border-radius: 3px;
    margin-right: 8px;
    &.low {
      background: #f4664a;
    }
    &.middle {
      background: #ffb700;
    }
    &.high {
      background: #2cbb79;
    }
  }
  .level {
    margin: 0 16px 0 8px;
  }
  .warningtext {
    color: #5a5a5a;
    font-size: 12px;
    margin-top: 5px;
  }
}
</style>
