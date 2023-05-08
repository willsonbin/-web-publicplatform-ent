module.exports = {
  // 获取首页顶部消息提示
  getInfoTip: {
    path: '/audit/selectBy',
    method: 'GET',
    server: 'trace'
  },
  // 获取首页图表和基本信息数据
  getHomeInfo: {
    path: '/index',
    method: 'GET',
    server: 'trace'
  },
  // 获取首页公告数据
  getAnnouncement: {
    path: '/announcement/latestNotice',
    method: 'GET',
    server: 'trace'
  },
  // 点击跳转删除代办事项
  deleteWaitEvent: {
    path: `/audit?type={{type}}&status={{status}}`,
    method: 'DELETE',
    server: 'trace'
  }
}
