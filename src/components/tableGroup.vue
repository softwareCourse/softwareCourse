<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <div id="velchart" class="chart"></div>
            </el-col>
            <el-col :span="12">
                <div id="roadpie" class="chart"></div>
            </el-col>
        </el-row>
    </div>
    
</template>

<script>
export default {
    name: 'TableGroup',
    data () {
        return {
            roadData: this.$store.state.roadData,
        }
    },
    mounted(){      
        this.drawVelChart()
        this.drawRoadPieChart()
      
    },
    methods: {
        drawVelChart(){
            let velList = []
            let xData = []
            let average = (arr) => arr.reduce((acc, val) => acc + val, 0)/arr.length
            for(let index=0;index < Math.ceil(this.roadData.length/20);index++){
                let t = this.formatUnixtimestamp(this.roadData[index*20]['Time'],'time')
                xData.push(t)
                velList.push(average(this.roadData.slice(index*20, Math.min((index+1)*20, this.roadData.length)).map((x)=>x['Velocity'])))
            }

            let cht = this.$echarts.init(document.getElementById('velchart'))
            cht.setOption({
                title: { 
                    text: '行驶速度折线图',
                    left: "center",
                    top: 20,
                },
                xAxis: {
                    type: 'category',
                    data: xData
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: velList,
                    type: 'line',
                    smooth: true
                }]
            });
        },
        drawRoadPieChart(){
            let roadLevel = [
                {'name':'城市快速路', 'value':0},
                {'name':'主干路', 'value':0},
                {'name':'支路', 'value':0},
                {'name':'辅路', 'value':0},
            ]
            for(let point of this.roadData){
                if(point['roads'].length>0 && point['roads'][0]['distance'] < 10){
                    if(point['roads'][0]['name'].indexOf("辅路") != -1){
                        roadLevel[3]['value'] += 1
                    }
                    else if(point['roads'][0]['name'].indexOf("环") != -1){
                        roadLevel[0]['value'] += 1
                    }
                    else if(point['roads'][0]['name'].indexOf("路") != -1){
                        roadLevel[1]['value'] += 1
                    }
                    else if(point['roads'][0]['name'].indexOf("街") != -1){
                        roadLevel[2]['value'] += 1
                    }
                }
            }
            window.console.log(roadLevel)
            let cht = this.$echarts.init(document.getElementById('roadpie'))
            cht.setOption({
                title: { 
                    text: '行驶道路级别扇形图',
                    left: "center",
                    top: 20,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {d}%'
                },
                series: [
                    {
                        name: '道路等级',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        animation: false,
                        data: roadLevel.sort((a, b) => { return a.value - b.value }),
                        labelLine: {
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    }
                ]
            })
        },
        formatUnixtimestamp (timestamp, type){
            type = type||'all'; 
            let unixtimestamp = new Date(timestamp*10**3);
            let year = 1900 + unixtimestamp.getYear();
            let month = "0" + (unixtimestamp.getMonth() + 1);
            let date = "0" + unixtimestamp.getDate();
            let hour = "0" + unixtimestamp.getHours();
            let minute = "0" + unixtimestamp.getMinutes();
            let second = "0" + unixtimestamp.getSeconds();
            if(type === 'all'){
                return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
                    + " " + hour.substring(hour.length-2, hour.length) + ":"
                    + minute.substring(minute.length-2, minute.length) + ":"
                    + second.substring(second.length-2, second.length);
            }  
            else if(type === 'time'){
                return hour.substring(hour.length-2, hour.length) + ":"
                    + minute.substring(minute.length-2, minute.length) + ":"
                    + second.substring(second.length-2, second.length);
            }

        },
    }
}
</script>

<style scoped>
    .chart{
        position: relative;
        width: 400px;
        height: 300px;
    }
</style>