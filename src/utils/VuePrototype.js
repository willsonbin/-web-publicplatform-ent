import Vue from 'vue'
import { getPermission } from '@/utils/auth'
Vue.prototype.hasPermission = function(permissionValue) {
  if (!window.config.remoteDebugg) {
    return true
  }
  if (getPermission().indexOf(permissionValue) === -1) {
    return false
  }
  return true
}

