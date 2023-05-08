<template>
  <el-input
    :placeholder="placeholder"
    :value="inputVal"
    type="text"
    :trim="trim"
    :size="size"
    :clearable="clearable"
    :disabled="disabled"
    @input="backValue"
    @blur="blur"
    @focus="focus"
  >
    <slot slot="prefix" name="prefix" />
  </el-input>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'DebounceInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    trim: {
      type: Boolean,
      required: false,
      default: true
    },
    maxLength: {
      type: Number,
      required: false
    },
    blur: {
      type: Function,
      required: false,
      default: () => {}
    },
    focus: {
      type: Function,
      required: false,
      default: () => {}
    },
    type: {
      type: String,
      required: false
    },
    size: {
      type: String,
      required: false
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      inputVal: ''
    }
  },
  watch: {
    // value: {
    //   immediate:true,
    //   handler:function(val){
    //     this.inputVal = val;
    //   }
    // }
  },
  created() {},
  methods: {
    backValue(data) {
      this.inputVal = data
      this.debounce(data)
    },
    debounce: debounce(function(e) {
      this.$emit('change', e)
    }, 500)
  }
}
</script>

<style scoped>

</style>
