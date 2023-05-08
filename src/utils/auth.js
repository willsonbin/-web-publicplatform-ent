// import Cookies from 'js-cookie'
const UserPermission = 'User-Permission'

const TokenKey = 'Token'

export function getToken() {
  return window.sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return window.sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  window.sessionStorage.removeItem('permissions')
  window.sessionStorage.removeItem(UserPermission)
  return window.sessionStorage.removeItem(TokenKey)
}
export function setUserMenuFlag(children1, children2) {
  console.log(1)
}
export function setPermission(value) {
  // return Cookies.set(UserPermission, value)
  return window.sessionStorage.setItem(UserPermission, JSON.stringify(value))
}

export function getPermission() {
  // return Cookies.get(UserPermission) || []
  var str = window.sessionStorage.getItem(UserPermission)
  if (str) {
    return JSON.parse(str)
  } else {
    return []
  }
}

export function filterMenu(arr) {
  arr.forEach(item => {
    if (item.href) this.pageMenu.push(item)
    if (item.children.length) filterMenu(item.children)
  })
}

