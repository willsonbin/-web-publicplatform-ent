<template>
  <div id="code-search-chart" style="width: 100%;height:300px;" />
</template>

<script>
import resize from '../mixins/resize'

export default {
  mixins: [resize],
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      option: {},
      chart: '',
      data: {
        xAxisData: [],
        totalData: [],
        currentData: []
      }
    }
  },
  watch: {
    dataSource(newVal) {
      if (newVal.length === 0) {
        this.data = {
          xAxisData: [],
          totalData: [],
          currentData: []
        }
      } else {
        this.data.xAxisData = newVal.map(item => {
          return item.date
        })
        this.data.totalData = newVal.map(item => {
          return item.total
        })
        this.data.currentData = newVal.map(item => {
          return item.current
        })
      }
      this.setChartOption()
    }
  },
  mounted() {
    this.setChartOption()
  },
  methods: {
    setChartOption() {
      if (!this.chart) {
        this.chart = this.$echarts.init(document.getElementById('code-search-chart'))
      }
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        grid: {
          top: '70'
        },
        xAxis: [
          {
            type: 'category',
            data: this.data.xAxisData,
            boundaryGap: true,
            axisLine: { lineStyle: { color: '#999' }},
            axisLabel: { // x轴label
              show: true,
              interval: 0, // 横轴信息全部显示
              rotate: 20,
              fontSize: 12,
              color: '#333'
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次',
            minInterval: 1,
            splitLine: { // 背景横线
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLabel: { // y轴label
              show: true,
              color: '#6a8ff4'
            },
            axisLine: { // y轴线
              show: false
            },
            axisTick: { // 刻度线
              show: false
            }
          },
          {
            type: 'value',
            name: '次',
            minInterval: 1,
            show: true,
            axisLabel: {
              show: true,
              formatter: '{value}',
              color: '#4bd1e0'
            },
            splitLine: {
              show: false
            },
            axisLine: { // y轴线
              show: false
            },
            axisTick: { // 刻度线
              show: false
            }
          }
        ],
        series: [
          {
            name: '溯源累计查询',
            type: 'line',
            data: this.data.totalData,
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: '#6a8ff4'
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#6a8ff4' // 0% 处的颜色
                  }, {
                    offset: 0.5,
                    color: 'rgba(255,255,255,0)' // 50% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgba(255,255,255,0)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            smooth: true,
            symbol: 'none'
          },
          {
            name: '溯源当天查询',
            type: 'line',
            yAxisIndex: 1,
            data: this.data.currentData,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#4bd1e0' // 0% 处的颜色
                  }, {
                    offset: 0.5,
                    color: 'rgba(255,255,255,0)' // 50% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgba(255,255,255,0)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#4bd1e0'
              }
            },
            smooth: true,
            zlevel: 1
          }
        ]
      }
      this.chart.setOption(this.option, true)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
