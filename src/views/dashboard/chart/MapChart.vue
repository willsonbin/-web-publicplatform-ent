<template>
  <div id="code-map-chart" style="width: 100%;height:100%;" />
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
      data: [],
      chart: ''
    }
  },
  watch: {
    dataSource(newVal) {
      if (!newVal || newVal.length === 0) {
        this.data = []
      } else {
        this.data = []
        newVal.forEach((item, index) => {
          this.data.push([item.fromLon, item.fromLat, item.quantity, item.fromAreaCn || item.fromAreaEn, index])
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
        this.chart = this.$echarts.init(document.getElementById('code-map-chart'))
      }
      this.option = {
        tooltip: {
          show: true,
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,1)',
          extraCssText: 'box-shadow: 0 0 3px #dbdbdb;',
          padding: 10,
          formatter: function(params) {
            var res = ''
            if (params.seriesType === 'scatter') {
              res = '<span style="color:#333;font-size: 12px">' +
                   params.value[3] +
                   '<br/><span style="display:inline-block;width: 8px;height:8px;border-radius:8px;background:#FFD510;margin-right: 6px;"></span>' +
                   params.value[2] + ' 件</span>'
            }
            return res
          }
        },
        geo: {
          map: 'world',
          label: {
            emphasis: {
              show: false
            }
          },
          zoom: 1.3,
          roam: true, // 是否允许缩放
          scaleLimit: {
            min: 1 // 最小缩放
          },
          itemStyle: {
            normal: {
              // areaColor: '#DCDCDC',
              areaColor: '#7CBDEF',
              borderColor: '#fff'
            },
            emphasis: {
              areaColor: '#BBD7F2'
            }
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            symbol: 'circle',
            symbolSize: 14,
            label: {
              show: true,
              color: '#333',
              position: 'bottom',
              formatter: function(params) {
                if (params.data[4] < 10) {
                  return params.data[3]
                }
                return ''
              }
            },
            itemStyle: {
              normal: {
                color: 'yellow',
                borderColor: '#2363E4',
                borderWidth: 1,
                opacity: 0.8
              }
            },
            data: this.data
          }]
      }
      this.chart.setOption(this.option, true)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
