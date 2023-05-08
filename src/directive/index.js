import Vue from 'vue'
// 针对 el-input做的限制，只能输入正整数
Vue.directive('error', {
  bind: function(el) {
    console.log(el)
    const input = el.getElementsByTagName('input')[0]
    input.onkeyup = function(e) {
      showError(input)
    }
    input.onblur = function(e) {
      showError(input)
    }
  }
})
Vue.directive('Int', {
  update: function(el, binding, vcode) {
    const input = el.getElementsByTagName('input')[0]
    input.onkeydown = (event) => {
      return (binding.value.type === 'decimal' && (event.keyCode === 110 || event.keyCode === 190)) || event.keyCode === 9 || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode === 8 || event.keyCode === 17 || event.keyCode === 67 || event.keyCode === 86
      /* return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8*/
    }
    input.onkeyup = function(e) {
      showValue(input, binding)
    }
    input.onblur = function(e) {
      showValue(input, binding)
      minus0(input, binding)
    }
  }
})
const trigger = (el, type) => {
  /* const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, false)
  el.dispatchEvent(e)*/
  el.dispatchEvent(new Event(type))
}
function showValue(input, binding) {
  if (binding.value.type !== 'decimal') {
    binding.value.data[binding.value.filed] = binding.value.data[binding.value.filed] ? binding.value.data[binding.value.filed].replace(/[^\d]/g, '') : ''
  }
  /* trigger(input, 'input')*/
}
function minus0(input, binding) {
  let num = binding.value.data[binding.value.filed]
  if (binding.value.type === 'decimal') {
    if (num.indexOf('.') > -1) {
      num = num.replace(/[^\d|^\.]/g, '').split('').filter((item, i, array) => {
        return item !== '.' || array.lastIndexOf(item) === i
      }).join('')
      /* const frontNine = num.split('.')[0]
      const behindFour = num.split('.')[1]*/
      num = num.split('.')[0].slice(0, 9) + '.' + num.split('.')[1].slice(0, 3)
      if (!/^([1-9][0-9]{0,8}(\.[0-9]{1,5})?)$|^([0](\.[0-9]{0,4}[1-9]))$/.test(num)) {
        num = ''
      }
    } else {
      num = num.replace(/[^\d]/g, '').slice(0, 9)
    }
    /* if (!/^([1-9][0-9]{0,8}(\.[0-9]{1,5})?)$|^([0](\.[0-9]{0,4}[1-9]))$/.test(binding.value.data[binding.value.filed])) {
      binding.value.data[binding.value.filed] = binding.value.data[binding.value.filed].replace(/[^\d]/g, '').slice(0, 9)
    }*/
  } else if (!parseInt(num)) {
    num = ''
  }
  binding.value.data[binding.value.filed] = num
  trigger(input, 'input')
}
function showError(input) {
  if (input.value) {
    input.parentNode.classList.remove('has-error')
  } else {
    input.parentNode.classList.add('has-error')
  }
  trigger(input, 'input')
}
