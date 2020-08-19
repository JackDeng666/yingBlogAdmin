<template>
  <div>
    <el-card style="text-align: center;">
      <div class="panel line" style="display: inline-block;">
        <h1>近期访问信息</h1>
        <div class="chart" :style="{width: '600px', height: '400px'}"></div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel pie" style="display: inline-block;">
        <h1>总信息</h1>
        <div class="chart" :style="{width: '600px', height: '400px'}"></div>
        <div class="panel-footer"></div>
      </div>
      <div><el-button @click="getJson" type="primary">提交修改站主信息</el-button></div>
      <div id="jsoneditor"></div>
    </el-card>
  </div>
</template>

<script>
import {Statistics} from '../../utils/api'
import echarts from "echarts"
import JSONEditor from 'jsoneditor'
export default {
  data() {
    return {
      siteInfo: {},
      editor: null
    }
  },
  methods: {
    // 图表
    initEcharts(){
      // 组装数据
      let dateData = []
      let numData = [[],[],[]]
      for(let i = 0; i < this.siteInfo.recentDaysStatistics.length; i++){
        let data = this.siteInfo.recentDaysStatistics[i]
        let date = new Date(data.date)
        let str = (date.getMonth() + 1) + "月" + date.getDate() + "日"
        dateData.push(str)
        numData[0].push(data.dayBrowsedCount)
        numData[1].push(data.dayLikedCount)
        numData[2].push(data.dayBlogBrowsedCount)
      }
      let mainData = []
      mainData.push({
        value: this.siteInfo.mainInfo.allBrowsedCount,
        name: "总进入数"
      })
      mainData.push({
        value: this.siteInfo.mainInfo.allLikedCount,
        name: "总点赞数"
      })
      mainData.push({
        value: this.siteInfo.mainInfo.allBlogBrowsedCount,
        name: "总博客浏览数"
      })
      // 渲染
      let lineChart = echarts.init(document.querySelector(".line .chart"))
      let lineChartOption = {
        color: ["#00f2f1","#f05","#2d9ee9"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          textStyle: {
            color: "rgb(50, 50, 50)",
            fontSize: 14,
            fontWeight: "bold"
          }
        },
        grid: {
          top: "10%",
          left: "5%",
          right: "10%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dateData,
          axisTick: {
            show: true
          },
          axisLabel: {
            textStyle: {
              color: "#000",
              fontSize: 12,
              fontWeight: "bold"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#868686",
              width: 1
            }
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: true
          },
          axisLabel: {
            textStyle: {
              color: "#000",
              fontSize: 12,
              fontWeight: "bold"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#868686",
              width: 1
            }
          },
          splitLine: {
            lineStyle: {
              color: "#868686",
              width: 0.5
            }
          }
        },
        series: [
          {
            name: "网站进入次数",
            type: "line",
            data: numData[0],
            // smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,0,0,1,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 212, 240, 0.5)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(0, 212, 240, 0.1)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0,0,0,0.1)",
            },
          },
          {
            name: "网站点赞数",
            type: "line",
            data: numData[1],
            // smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,0,0,1,
                [
                  {
                    offset: 0,
                    color: "rgba(236, 43, 37, 0.5)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(236, 43, 37, 0.1)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0,0,0,0.1)",
            },
          },
          {
            name: "博客点击数",
            type: "line",
            data: numData[2],
            // smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,0,0,1,
                [
                  {
                    offset: 0,
                    color: "rgba(45, 158, 233, 0.5)"
                  },
                  {
                    offset: 0.8,
                    color: "rgb(45, 158, 233, 0.1)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0,0,0,0.1)",
            },
          }
        ]
      }
      lineChart.setOption(lineChartOption)
      
      let pieChart = echarts.init(document.querySelector(".pie .chart"))
      let pieChartOption = {
        color: ["#00f2f1","#f05","#2d9ee9"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "rgba(0,0,0)",
            fontSize: "14",
            fontWeight: "bold"
          }
        },
        series: [
          {
            name: "成员",
            type: "pie",
            radius: ["10%", "80%"],
            center: ["50%", "50%"],
            roseType: "radius",
            label: {
              fontSize: 12,
              fontWeight: "bold"
            },
            data: mainData
          }
        ]
      };
      pieChart.setOption(pieChartOption);
    },
    async getJson(){
      let res = await Statistics.updateOwnerInfo(this.editor.get())
      if(res.data.meta.status==1){
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
    }
  },
  async created(){
    let res = await Statistics.getSiteInfo()
    this.siteInfo = res.data.data.siteInfo
    this.initEcharts()
    
    // jsoneditor
    const container = document.getElementById('jsoneditor')
    const options = {
      mode: 'code',
      modes: ['code', 'form', 'tree'], // allowed modes
      onError: function (err) {
        alert(err.toString())
      }
    }
    this.editor = new JSONEditor(container, options)
    this.editor.set(this.siteInfo.ownerInfo)
  }
};
</script>

<style>
.panel {
  position: relative;
  border: 1px solid rgba(25, 186, 139, 0.2);
  background: rgba(108, 214, 59, 0.2);
  margin: 10px 10px;
}
.panel::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}
.panel::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  content: "";
}
.panel-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.panel-footer::after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}
.panel-footer::before {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}
.panel h1{
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}
.panel .chart{
  margin-top: 20px;
  color: #f05;
}
#jsoneditor {
  width: 100%;
  height: 500px;
}
.jsoneditor {
  margin-top: 10px;
  border: solid #3883fa !important;
}
</style>
