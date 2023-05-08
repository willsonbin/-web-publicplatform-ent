<template>
  <div id="code-send-chart" style="width: 100%;height:300px;" />
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
        this.chart = this.$echarts.init(document.getElementById('code-send-chart'))
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
            name: '个',
            minInterval: 1,
            splitLine: { // 背景横线
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLabel: { // y轴label
              show: true,
              color: '#0B78FF'
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
            name: '个',
            minInterval: 1,
            show: true,
            axisLabel: {
              show: true,
              formatter: '{value}',
              color: '#F8C319'
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
            name: '总量',
            type: 'line',
            data: this.data.totalData,
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: '#0B78FF'
              }
            },
            symbol: 'none'
          },
          {
            name: '当天量',
            type: 'line',
            yAxisIndex: 1,
            data: this.data.currentData,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: '#F8C319'
              }
            },
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
