<template>
  <div id="dashboard-primary">
    <h1>工作台</h1>
    <!-- 代办提醒 -->
    <el-carousel
      v-if="topInfo && topInfo.length > 0"
      height="40px"
      :autoplay="true"
      :interval="4000"
      arrow="never"
      direction="vertical"
      style="padding: 20px 20px 0 20px;"
    >
      <el-carousel-item v-for="(item, index) in topInfo" :key="index">
        <i class="el-icon-message-solid" style="color: #FF7576;margin-right: 10px;font-size: 16px;" />
        <b size="medium" class="waitTip" @click="handleToTz(item)">{{ item.content }}</b>
      </el-carousel-item>
    </el-carousel>
    <div style="padding: 20px 20px 10px 20px">
      <el-row :gutter="24" style="margin-bottom: 20px">
        <el-col :span="6">
          <div class="dashboard-col">
            <div class="dashboard-image orgCount">
              <img src="../../assets/images/orgCount.png">
            </div>
            <div>
              <h4>溯源信息</h4>
              <p>
                <span>{{ codeInfo }}</span>个
              </p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="dashboard-col">
            <div class="dashboard-image goodsCount">
              <img src="../../assets/images/goodsCount.png">
            </div>
            <div>
              <h4>商品数量</h4>
              <p>
                <span>{{ goodsNum }}</span>个
              </p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="dashboard-col">
            <div class="dashboard-image codeCount">
              <img src="../../assets/images/codeCount.png">
            </div>
            <div>
              <h4>追溯码总数</h4>
              <p>
                <span>{{ codeCount }}</span>个
              </p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="dashboard-col">
            <div class="dashboard-image codeSearchCount">
              <img src="../../assets/images/codeSearchCount.png">
            </div>
            <div>
              <h4>扫码查询总数</h4>
              <p>
                <span>{{ scanCodeNum }}</span>次
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="18">
          <div class="dashboard-chart" style="height:264px">
            <div
              class="dashboard-title"
              style="display:flex;align-items:center;justify-content:space-between;padding-right:20px;"
            >
              <p>追溯流程</p>
            </div>
            <section class="funcWrapper">
              <div class="imgWraper">
                <section class="functionImgContent">
                  <img src="../../assets/images/企业认证.png">
                  <span class="bottomTitle">企业认证</span>
                </section>
                <span class="bottomDes">企业资质/认证展示</span>
              </div>
              <img src="../../assets/images/箭头.png" style="width:45px;height:12px;margin-top:60px">
              <div class="imgWraper">
                <section class="functionImgContent">
                  <img src="../../assets/images/原料.png">
                  <span class="bottomTitle" style="padding-bottom: 0px">原料/加工</span>
                  <span class="bottomTitle" style="padding: 0px 0px 12px 0px;">产品信息</span>
                </section>
                <span class="bottomDes">产地/加工生产/批次</span>
              </div>
              <img src="../../assets/images/箭头.png" style="width:45px;height:12px;margin-top:60px">
              <div class="imgWraper">
                <section class="functionImgContent">
                  <img src="../../assets/images/检测.png">
                  <span class="bottomTitle">检测</span>
                </section>
                <span class="bottomDes">产品检测/报告展示</span>
              </div>
              <img src="../../assets/images/箭头.png" style="width:45px;height:12px;margin-top:60px">
              <div class="imgWraper">
                <section class="functionImgContent">
                  <img src="../../assets/images/流通.png">
                  <span class="bottomTitle">流通</span>
                </section>
                <span class="bottomDes">填报物流</span>
              </div>
              <img src="../../assets/images/箭头.png" style="width:45px;height:12px;margin-top:60px">
              <div class="imgWraper">
                <section class="functionImgContent">
                  <img src="../../assets/images/消费者.png" style="width:30px:height:10px">
                  <span class="bottomTitle">消费者</span>
                </section>
                <span class="bottomDes">扫码溯源</span>
              </div>
            </section>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="dashboard-chart" style="height:264px">
            <div
              class="dashboard-title"
              style="display:flex;align-items:center;justify-content:space-between;padding-right:10px;"
            >
              <p>最新公告</p>
              <div v-if="hasPermission('MENU_ANNOUNCEMENT_MANAGEMENT')" style="color:grey;cursor:pointer;display:flex;align-items:center;" @click="handleToAnnounce"><img src="../../assets/images/point.jpg"></div>
            </div>
            <section class="noticeWrapper">
              <!-- <div class="noticeContent" > -->
              <div v-for="item in announcementInfo" :key="item" class="noticeList">
                <i class="dot" style="margin: 5px 10px;" />
                <span class="notice-title" @click="toNewInfo">{{ item.title }}</span>
                <span class="noticeTime">{{ item.createDate.substring(5,10) }}</span>
              </div>
              <p v-if="!announcementInfo || announcementInfo.length == 0" style="text-align:center;color:#999">暂无数据</p>
            </section>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="dashboard-chart-2">
            <div
              class="dashboard-title"
              style="display:flex;align-items:center;justify-content:space-between;padding-right:20px;"
            >
              <p>消费扫码趋势</p>
            </div>
            <!-- 消费扫码趋势图表 -->
            <div class="dashboard-chart-box">
              <div id="scanCode" style="width: 100%;height:100%" />
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="dashboard-chart-2">
            <div
              class="dashboard-title"
              style="display:flex;align-items:center;justify-content:space-between;padding-right:20px;"
            >
              <p>标签申请趋势</p>
            </div>
            <!-- 标签申请趋势 -->
            <div class="dashboard-chart-box">
              <div id="label" style="width: 100%;height:100%" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 企业资料未填写完整时的提示弹框 -->
    <el-dialog :visible.sync="dialogVisible" width="35%" :show-close="false">
      <section class="dialogContent">
        <span class="tipsLogo">
          <i class="el-icon-warning" style="color:#FC9F0D; font-size:30px" />
          <h2 class="tipsTitle">企业资料未完善</h2>
        </span>
        <ul class="tipsList">
          <li>下面资料还需要进一步填写：</li>
          <li>
            <i class="dot" />企业简介
          </li>
          <li>
            <i class="dot" />企业展示图标
          </li>
        </ul>
      </section>
      <span slot="footer" class="footer">
        <span>提醒：企业资料可在消费者扫码溯源页面显示</span>
        <el-button type="primary" @click="jumpEnterpriseInfo">去完善企业资料</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import echarts from 'echarts'
// import CodeSearchChart from './chart/codeSearchChart.vue'
// import CodeSendChart from './chart/codeSendChart.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  // components: { CodeSearchChart, CodeSendChart },
  data() {
    return {
      analysis: {
        orgNum: 0,
        goodsNum: 0,
        codeNum: 0,
        scanNum: 0
      },
      codeSearchData: [],
      codeSendData: [],
      MapChartData: [],
      dialogVisible: false,
      // url传参
      queryInfo: {
        status: 1
      },
      queryType: {
        type: 1
      },
      topInfo: [], // 顶部消息
      baseInfo: {}, // 顶部基本信息数据
      codeInfo: '', // 塑源信息
      goodsNum: '',
      codeCount: '', // 追溯码总数
      scanCodeNum: '', // 扫码查询总数

      scanTrendDate: [], // 扫码趋势图表日期
      currentQuantity: [], // 当天数量
      sumQuantity: [], // 累计数量
      labelDate: [], // 标签申请趋势日期
      currentTotal: [], // 当天量
      total: [], // 总量
      announcementInfo: [], // 公告信息
      announcementDate: [] // 公告日期
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'orgInfoFlag'])
  },
  mounted() {
    this.getTopInfoTip()
    this.getHomeDetail()
    this.getAnnouncement()
    this.showDialog()
  },
  methods: {
    handleToAnnounce() {
      this.$router.push('/announcement/notice')
    },
    handleToTz(item) {
      switch (item.type) {
        case 1: // 企业认证
          if (this.hasPermission('MENU_ORG_CERTIFICATION')) {
            this.$router.push('/enterprise/entCerfication')
            this.deleteWaitEvent(item.type, 1)
          }
          break
        case 2: // 产品检测
          if (this.hasPermission('MENU_PRODUCT_REVIEW_RECORD')) {
            this.$router.push('/basicSetting/productReport')
            this.deleteWaitEvent(item.type, 1)
          }
          break
        case 3: // 功效宣称
          if (this.hasPermission('MENU_EFFECT_REVIEW_RECORD')) {
            this.$router.push('/basicSetting/efficacyReport')
            this.deleteWaitEvent(item.type, 1)
          }
          break
        case 4: // 企业资料
          if (this.hasPermission('MENU_ORG_DATA')) {
            this.$router.push('/enterprise/record/info')
            this.deleteWaitEvent(item.type, 1)
          }
          break
        case 5: // 原料追溯信息
          if (this.hasPermission('MENU_MATERIAL_INFORMATION')) {
            this.$router.push('/traceability/materialInfo')
            this.deleteWaitEvent(item.type, 1)
          }
          break
        case 6: // 产品追溯信息
          if (this.hasPermission('MENU_PRODUCT_INFORMATION')) {
            this.$router.push('/traceability/productInfo')
            this.deleteWaitEvent(item.type, 1)
          }
          break
        case 7: // 标签申请
          if (this.hasPermission('MENU_LABEL_APPLY_RECORD')) {
            this.$router.push('/basicSetting/labelApply')
            this.deleteWaitEvent(item.type, 1)
          }
          break
      }
    },
    // 删除消息
    deleteWaitEvent(type, status) {
      this.$backend
        .request(this.$api.home.deleteWaitEvent, { type, status })
        .then(res => {
          console.log(res)
        })
    },
    /** **********数值转换单位方式一****fun(str, unit = '个')********************** */
    fun(str, unit = '') {
      str = str + ''
      if (str.length > 7) {
        return `${str.slice(0, 1)}000万+`
      } else if (str.length > 4 && str.length < 8) {
        return `${str.slice(0, -4)}万${this.removeZero(str.slice(-4), unit)}`
      } else {
        return str + unit
      }
    },
    removeZero(str, unit) {
      const arr = str.split('')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '0') {
          arr.shift()
          i--
          continue
        } else {
          break
        }
      }
      return arr.length ? arr.join('') + unit : ''
    },
    /** *******数字转化为单位类型***********************/
    getUnitNum(str) {
      if (str.length > 8) {
        return str.slice(0, 1) + '000万+个'
      } else if (str.length > 4 && str.length <= 8) {
        return str.slice(0, -4) + '万' + str.slice(-4)
      } else {
        return str
      }
    },
    // 底部待办提醒跳转对应页面

    // 获取顶部消息提示信息
    getTopInfoTip() {
      const param = this.$util.ObjectUtils.deepCopy(this.queryInfo)
      this.$backend.request(this.$api.home.getInfoTip, param).then(res => {
        console.log(res, '顶部提示信息')
        this.topInfo = res.data || []
      })
    },
    // 获取首页数据
    getHomeDetail() {
      this.$backend.request(this.$api.home.getHomeInfo).then(res => {
        console.log(res, '首页')
        this.baseInfo = res.data.module1
        this.codeInfo = this.baseInfo.traceabilityQuantity || 0
        this.goodsNum = this.baseInfo.allQuantity || 0
        this.codeCount = this.baseInfo.codeQuantity || 0
        this.scanCodeNum = this.baseInfo.scanQuantity || 0
        // 转化数字为单位类型
        const cINum = this.fun(this.codeInfo)
        this.codeInfo = cINum
        const gNum = this.fun(this.goodsNum)
        this.goodsNum = gNum
        const cNum = this.fun(this.codeCount)
        this.codeCount = cNum
        const sNum = this.fun(this.scanCodeNum)
        this.scanCodeNum = sNum

        // console.log(this.fun('552000000','++++++++++++++'));

        // 获取产品备案趋势图表数据
        // this.materialTrend = res.data.module2.materialTrend;
        // this.productTrend = res.data.module2.productTrend;

        const { scanRecordTrend = [], labelApplyTrend = [] } = res.data.module2
        // 获取扫码趋势日期
        this.scanTrendDate = scanRecordTrend.map(item =>
          item && item.applyDate.substring(5, 10) || []
        )
        // 获取扫码查询当天数量
        this.currentQuantity = scanRecordTrend.map(
          item => item.quantity

        )
        // 获取扫码查询累计数量
        this.sumQuantity = scanRecordTrend.map(
          item => item.sumQuantity && item.sumQuantity || []

        )
        // 获取标签申请趋势日期
        this.labelDate = labelApplyTrend.map(item =>
          item.applyDate.substring(5, 10)
        )
        // 获取累计总数
        this.total = labelApplyTrend.map(
          item => item.sumQuantity
        )
        // 获取当天量
        this.currentTotal = labelApplyTrend.map(item => item.quantity)
        // console.log(this.currentTotal,'标签当天量');

        // 获取到数据后再渲染图表
        this.getscanCodeCharts()
        this.getLabelCharts()
      })
    },
    // 配置标签申请趋势图表
    getLabelCharts() {
      const labelChart = this.$echarts.init(document.getElementById('label'))
      labelChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        legend: {
          data: ['总量', '当天量'],
          top: '4%',
          right: '5%',
          icon: 'line',
          itemHeight: 39, // 图例图标的高度
          itemWidth: 19 // 图例图标的宽度
        },
        grid: {
          left: '4%',
          right: '7%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.labelDate,
          // data: ['05-01','05-02','05-03','05-04','05-05','05-06','05-07','05-08','05-09','05-10','05-11','05-12','05-13','05-14','05-15','05-16','05-17','05-18','05-19','05-20','05-21','05-22','05-23','05-24','05-25','05-26','05-27','05-28','05-29','05-30']
          // x轴线的配置
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CACACA'
            }
          },
          // x轴文字的配置
          axisLabel: {
            show: true,
            textStyle: {
              color: 'black'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed' // 虚线
            },
            show: true // 隐藏
          },
          // 去掉y轴的线
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '总量',
            symbolSize: 1, // 去掉折现上显示的圆点
            type: 'line',
            // stack: "Total",
            data: this.total,
            // data: [5, 10, 20, 10, 5],
            itemStyle: {
              normal: {
                color: '#3890FF' // 折线的颜色
              }
            }
          },
          {
            name: '当天量',
            type: 'line',
            // symbol: "circle", //设定为实心点
            symbolSize: 7, // 设定实心点的大小
            stack: 'Total',
            data: this.currentTotal,
            // data: [10, 20, 30, 15, 25],
            itemStyle: {
              normal: {
                color: '#F8C112'
              }
            }
          }
        ]
      })
      // 图表自适应
      window.addEventListener('resize', function() {
        labelChart.resize()
      })
    },

    // 配置消费扫码趋势图表
    getscanCodeCharts() {
      const scanCodeChart = this.$echarts.init(
        document.getElementById('scanCode')
      )
      scanCodeChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        legend: {
          data: ['累计查询', '当天查询'],
          top: '4%',
          right: '5%',
          icon: 'line',
          itemHeight: 39, // 图例图标的高度
          itemWidth: 19 // 图例图标的宽度
        },
        grid: {
          left: '4%',
          right: '7%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.scanTrendDate,
          // data: ['05-01','05-02','05-03','05-04','05-05']
          // x轴线的配置
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CACACA'
            }
          },
          // x轴文字的配置
          axisLabel: {
            show: true,
            textStyle: {
              color: 'black'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed' // 虚线
            },
            show: true // 隐藏
          },
          // 去掉y轴的线
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '累计查询',
            smooth: true, // 设置成曲线图
            symbolSize: 1, // 去掉折现上显示的圆点
            type: 'line',
            // stack: "Total",
            data: this.sumQuantity,
            // data: [10, 20, 30, 15, 25],
            // 线条区域下层渐变
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0.1,
                      color: '#D5DFF0' // 0% 处的颜色
                    },
                    {
                      offset: 0.5,
                      color: '#D5DFF0' // 0% 处的颜色
                    },
                    {
                      offset: 0.7,
                      color: '#D5DFF0' // 0% 处的颜色
                    },
                    {
                      offset: 0.9,
                      color: '#FFFFFF' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#7E41F8' // 折线的颜色
              }
            }
          },
          {
            name: '当天查询',
            type: 'line',
            smooth: true,
            symbolSize: 7, // 设定实心点的大小
            stack: 'Total',
            data: this.currentQuantity,
            // data: [5, 10, 20, 10, 5],
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0.1,
                      color: '#D4F3F7' // 0% 处的颜色
                    },
                    {
                      offset: 0.5,
                      color: '#D4F3F7' // 0% 处的颜色
                    },
                    {
                      offset: 0.7,
                      color: '#D4F3F7' // 0% 处的颜色
                    },
                    {
                      offset: 0.9,
                      color: '#FFFFFF' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#4BD1E0'
              }
            }
          }
        ]
      })
      // 图表自适应
      window.addEventListener('resize', function() {
        scanCodeChart.resize()
      })
    },
    // 获取首页公告数据
    getAnnouncement() {
      const param = this.$util.ObjectUtils.deepCopy(this.queryType)
      this.$backend.request(this.$api.home.getAnnouncement, param).then(res => {
        console.log(res)
        this.announcementInfo = res.data
        // this.announcementInfo = res.data.map(item => item.title)
        // // console.log(this.announcementInfo);
        // this.announcementDate = res.data.map(item => item.createDate)
        console.log(this.announcementDate)
      })
    },
    // 跳转到最新公告
    toNewInfo() {
      if (this.hasPermission('MENU_ANNOUNCEMENT_MANAGEMENT')) {
        this.$router.push('/announcement/notice')
      }
    },

    /** ************************************/
    showDialog() {
      // isAdmin  0是管理员 1不是
      // orgInfoFlag  true 完成 false未完成
      if (this.userInfo.isAdmin === 0 && this.orgInfoFlag) {
        this.dialogVisible = false
      } else if (this.userInfo.isAdmin === 0 && !this.orgInfoFlag) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
      }
    },
    // 跳转到企业备案信息
    jumpEnterpriseInfo() {
      this.$router.push({ path: '/enterprise/record/info' })
      this.dialogVisible = false
    },
    getOrderEchart() {
      this.codeSendData = []
      this.$backend
        .request(this.$api.traceInfo.getOrderEchart)
        .then(response => {
          if (response.success) {
            this.codeSendData = response.data
          }
        })
    },
    getHomeEchart() {
      this.codeSearchData = []
      this.$backend
        .request(this.$api.traceInfo.getHomeEchart)
        .then(response => {
          if (response.success) {
            this.codeSearchData = response.data
          }
        })
    },
    getHomeTopic() {
      this.$backend.request(this.$api.traceInfo.getHomeTopic).then(response => {
        if (response.success) {
          this.analysis.codeNum = response.data.codeNum || 0
          this.analysis.goodsNum = response.data.goodsNum || 0
          this.analysis.orgNum = response.data.orgNum || 0
          this.analysis.scanNum = response.data.scanNum || 0
        }
      })
    },
    getHomeFlow() {
      this.$backend.request(this.$api.traceInfo.getHomeFlow).then(response => {
        if (response.success) {
          this.MapChartData = response.data || []
          this.MapChartData.sort(function(a, b) {
            return b.quantity - a.quantity
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.waitTip{
   cursor: pointer;
   font-weight: normal;
}
// #dashboard-primary .noticeWrapper .dot[data-v-6cdeb2ee] {
//   margin: 5px 10px;
// }
#dashboard-primary .funcWrapper[data-v-6cdeb2ee] {
  margin: 20px 32px;
}
#dashboard-primary {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  .funcWrapper {
    display: flex;
    justify-content: space-evenly;
    margin: 20px 0px;
    .functionImgContent {
      background: #f4f5ff;
      width: 7vw;
      height: 73%;
      img {
        display: block;
        margin: 0 auto;
        padding-top: 28px;
      }
    }
    .bottomTitle {
      color: #333;
      font-weight: bold;
      font-size: 14px;
      padding: 30px 0px;
      display: block;
      text-align: center;
    }
    .bottomDes {
      margin-top: 22px;
      color: #333;
      font-size: 14px;
      display: block;
      text-align: center;
      width: 120px;
    }
  }
  .noticeWrapper {
    margin: 20px 0px;
    position: relative;
    .noticeTime {
      position: absolute;
      right: 30px;
    }
    .noticeList {
      margin: 10px 8px;
      .notice-title {
        cursor: pointer;
        display: inline-block;
        width: 200px;
        position: relative;
        left: -2px;
        // height: 20px;
        // line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        // background-color: cadetblue;
      }
    }
    .dot {
      margin: 0px 10px;
      width: 5px;
      height: 5px;
      border-radius: 10px;
      font-style: normal;
      display: inline-block;
      background: #000;
    }
    .noticeContent {
      display: flex;
      align-items: center;
      align-content: center;
      flex-direction: row;
      margin: 10px 0px;
      p {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 24px;
        line-height: 24px;
      }
    }
  }
  h1 {
    margin: 0;
    font-size: 16px;
    color: #333;
    height: 50px;
    line-height: 42px;
    height: 42px;
    padding: 0 20px;
    font-weight: 600;
    border-bottom: 1px solid #e5e5e5;
  }
  .dashboard-col {
    display: flex;
    align-items: center;
    border: 1px solid #e4e9fb;
    border-radius: 4px;
    padding: 0 20px;
    height: 100px;
    .dashboard-image {
      width: 60px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      img {
        width: 33px;
        height: 33px;
        margin-left: 14px;
      }
    }
    .orgCount {
      width: 60px;
      height: 60px;
      background: #e96c5b;
    }
    .goodsCount {
      width: 60px;
      height: 60px;
      background: #f6c022;
    }
    .codeCount {
      width: 60px;
      height: 60px;
      background: #0ec070;
    }
    .codeSearchCount {
      width: 60px;
      height: 60px;
      background: #6395f9;
    }
    h4 {
      margin: 0;
      margin-bottom: 14px;
      color: #333;
    }
    p {
      color: #999;
    }
    p > span {
      font-size: 20px;
      margin-right: 8px;
      font-weight: bold;
      color: #6395f9;
    }
  }
  .dashboard-chart {
    height: 295px;
    border-radius: 4px;
    border: 1px solid #e4e9fb;
    overflow: hidden;
  }
  .dashboard-chart-2 {
    height: 278px;
    border-radius: 4px;
    border: 1px solid #e4e9fb;
    // height: 264px;
    display: flex;
    flex-direction: column;
  }
  .dashboard-title {
    border-bottom: 1px solid #e4e9fb;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-weight: bold;
    flex-shrink: 0;
  }
  .dashboard-chart-box {
    width: 100%;
    margin-top: -40px;
    height: calc(100% + 40px);
  }
  .dashboard-chart-legend {
    font-size: 12px;
    color: #999;
    font-weight: normal;
    display: flex;
    align-items: center;
    > span {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
    .dashboard-chart-scroll {
      display: inline-block;
      width: 20px;
      height: 3px;
      background: #999;
      margin-right: 10px;
    }
  }
  .dashboard-map {
    border-radius: 4px;
    border: 1px solid #e4e9fb;
  }
  .dashboard-map-chart {
    height: 500px;
    padding: 10px 20px;
  }
}
.topTips {
  border: 1px solid #ffbabf;
  background: #ffebec;
  width: 97%;
  height: 36px;
  line-height: 36px;
  display: inline-block;
  margin: 15px 0px 0px 20px;
  padding: 0px 10px;
}
::v-deep .el-dialog__header {
  display: none;
}
.dialogContent {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0px;
  flex-direction: column;
  .tipsLogo {
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .tipsTitle {
    color: #000;
    margin-left: 10px;
  }
  .tipsList {
    color: #000;
    font-size: 14px;
    line-height: 26px;
    align-self: flex-start;
    .dot {
      width: 5px;
      height: 5px;
      background: #000;
      border-radius: 8px;
      display: inline-block;
      margin-right: 8px;
    }
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: #999999;
    font-size: 12px;
  }
}
::v-deep.el-carousel .el-carousel__container {
  background: #FFEBEC;
  border: 1px solid #FFBABB;
  overflow: hidden;
  .el-carousel__item {
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
}
</style>
