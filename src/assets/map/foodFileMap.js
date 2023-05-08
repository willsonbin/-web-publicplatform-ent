/* eslint-disable */
export default function(mapData) {
  var worldGeoCoordMap = {
    /*'黑龙江': [127.9688, 45.368],
    "山东": [117.1582, 36.8701],
    "海南": [110.3893, 19.8516]*/
  };
  worldGeoCoordMap = mapData
  var worldDatas = [
    /*[{
      name: '黑龙江',
      value: 0
    }],	[{
      name: '山东',
      value: 0
    }],	[{
      name: '海南',
      value: 0
    }]*/
  ];
  for(let key in worldGeoCoordMap){
    worldDatas.push([{name:key,value:0}])
  }
  console.log(6666)
  console.log(worldGeoCoordMap)
  console.log(worldDatas)
  
  var convertData = function(data) {
    var res = [];
    const filterData =  data.filter((item)=>{return item[0].name&&item[0].name!=='null'})
    console.log(6666)
    console.log(filterData)
    for(let i=0;i<filterData.length-1;i++){
      res.push([{coord:worldGeoCoordMap[filterData[i][0].name],value:0},{coord:worldGeoCoordMap[filterData[i+1][0].name],value:0}])
    }
    /*res.push([{
      coord: worldGeoCoordMap[data[0][0].name],
      value: 0
    }, {
      coord: worldGeoCoordMap[data[1][0].name],
      value: 0
    }],[{
      coord: worldGeoCoordMap[data[1][0].name],
      value: 0
    }, {
      coord: worldGeoCoordMap[data[2][0].name],
      value: 0
    }]);*/
    return res;
  };
  var series = [];
  [
    [worldDatas[worldDatas.length-1][0].name, worldDatas]
  ].forEach(function(item, i) {
    series.push({
        type: 'lines',
        zlevel: 2,
        effect: {
          show: true,
          period: 4, //箭头指向速度，值越小速度越快
          trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: 'arrow', //箭头图标
          symbolSize: 5, //图标大小
        },
        lineStyle: {
          normal: {
            width: 1, //尾迹线条宽度
            opacity: 1, //尾迹线条透明度
            curveness: .3 //尾迹线条曲直度
          }
        },
        data: convertData(item[1])
      }, {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: { //涟漪特效
          period: 4, //动画时间，值越小速度越快
          brushType: 'stroke', //波纹绘制方式 stroke, fill
          scale: 4 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          normal: {
            show: true,
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: function(params){//圆环显示文字
              return params.data.name;
            },
            fontSize: 13
          },
          emphasis: {
            show: true
          }
        },
        symbol: 'circle',
        symbolSize: function(val) {
          return 5+ val[2] * 5; //圆环大小
        },
        itemStyle: {
          normal: {
            show: false,
            color: '#f00'
          }
        },
        data: item[1].map(function(dataItem) {
          return {
            name: dataItem[0].name,
            value: worldGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
          };
        }),
      }
    );
  });
  return {
    title: {
      text: '追溯链地图',
      textStyle:{
        color: '#333',
        fontSize: 14
      },
      top: 10,
      left: 15
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#000',
      borderColor: '#FFFFCC',
      showDelay: 0,
      hideDelay: 0,
      enterable: true,
      transitionDuration: 0,
      extraCssText: 'z-index:100',
      formatter: function(params, ticket, callback) {
        //根据业务自己拓展要显示的内容
      }
    },
    backgroundColor: "#F5F5F5",
    visualMap: { //图例值控制
      show: false,
      color: ['#ECAB3F']
    },
    geo: {
      map: 'world',
      zoom: 1.0,
      label: {
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          color: '#435FA7', //地图背景色
          borderColor: '#435FA7', //省市边界线00fcff 516a89
        },
        emphasis: {
          color: '#435FA7' //悬浮背景
        }
      }
    },
    series: series
  };
}


