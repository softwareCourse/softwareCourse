<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    <div id="container" style="width:500px; height:300px"></div>
    <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {heatmapData} from '../data'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      map:null,
      heatmap:null,
      hmdata:heatmapData,
    }
  },
  mounted(){
    AMapLoader.load({
        "key": "c456a66f90bbed06c6214bc9d5168fcb",   // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": []  //插件列表
    }).then((AMap)=>{
        //this.map = new AMap.Map('container');
        this.map = new AMap.Map("container", {
            resizeEnable: true,
            center: [116.418261, 39.921984],
            zoom: 11
        });

        if (!this.isSupportCanvas()) {
            alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
        }

        //详细的参数,可以查看heatmap.js的文档 http://www.patrick-wied.at/static/heatmapjs/docs.html
        //参数说明如下:
        /* visible 热力图是否显示,默认为true
        * opacity 热力图的透明度,分别对应heatmap.js的minOpacity和maxOpacity
        * radius 势力图的每个点的半径大小
        * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
        *	{
        .2:'rgb(0, 255, 255)',
        .5:'rgb(0, 110, 255)',
        .8:'rgb(100, 0, 255)'
        }
        其中 key 表示插值的位置, 0-1
        value 为颜色值
        */
        this.map.plugin(["AMap.HeatMap"], ()=> {
            //初始化heatmap对象
            this.heatmap = new AMap.HeatMap(this.map, {
                radius: 25, //给定半径
                opacity: [0, 0.8]
                /*,
                gradient:{
                    0.5: 'blue',
                    0.65: 'rgb(117,211,248)',
                    0.7: 'rgb(0, 255, 0)',
                    0.9: '#ffea00',
                    1.0: 'red'
                }
                */
            });
            //设置数据集：该数据为北京部分“公园”数据
            this.heatmap.setDataSet({
                data: this.hmdata,
                max: 100
            });
        });

        
    }).catch(e => {
        console.log(e);
    })
    this.drawLine();
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { text: '在Vue中使用echarts' },
            tooltip: {},
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    },
    //判断浏览区是否支持canvas
    isSupportCanvas() {
        let elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
