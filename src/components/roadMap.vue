<template>
    <div class='road-map-panel'>
        <el-container>
            <el-row :gutter="10">
                <el-col :span="12">
                    <div class="grid-content amap-box" id='amap'></div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content">
                        <el-tabs class='table_tab' v-model="activeName">
                            <el-tab-pane label="路口统计" name="first">
                                <el-table class='result_table' :data="crosses" stripe border highlight-current-row @row-click='showCross' max-height='350' style="width: 100%">
                                    <el-table-column type="index" width="40">
                                    </el-table-column>
                                    <el-table-column label="通过时间">
                                        <template slot-scope="scope">
                                            <span>{{ formatUnixtimestamp(scope.row['pass_time']) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="first_name" label="道路A" width="150">
                                    </el-table-column>
                                    <el-table-column prop="second_name" label="道路B" width="150">
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="道路统计" name="second">
                                <el-table class='result_table' :data="roads" stripe border highlight-current-row @row-click='showRoad' max-height='360' style="width: 100%">
                                    <el-table-column type="index" width="40">
                                    </el-table-column>
                                    <el-table-column label="开始时间" width="150">
                                        <template slot-scope="scope">
                                            <span>{{ formatUnixtimestamp(scope.row['start_time']) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="结束时间" width="150">
                                        <template slot-scope="scope">
                                            <span>{{ formatUnixtimestamp(scope.row['stop_time']) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="经过道路">
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>

                    </div>
                </el-col>
            </el-row>
        </el-container>
    </div>
    
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
    name: 'RoadMap',
    data () {
        return {
            map:null,
            AMap: null,
            roadData: this.$store.state.roadData,
            roads: [],
            crosses: [], 
            marker: null,
            path: null,
            activeName: 'first',
        }
    },
    mounted(){
        //this.roadData = this.$store.state.roadData
        this.createMap()
    },
    methods: {
        createMap(){
            AMapLoader.load({
                "key": "c456a66f90bbed06c6214bc9d5168fcb",   // 申请好的Web端开发者Key，首次调用 load 时必填
                "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": []  //插件列表
            }).then((AMap)=>{
                this.AMap = AMap
                this.map = new AMap.Map('amap', {
                    center: [116.397428, 39.90923],
                    resizeEnable: true,
                    zoom: 10
                })
                //重新定位
                let sumLng = 0
                let sumLat = 0
                let num = 0
                let lngLats = []
                for(let point of this.roadData){
                    lngLats.push(new this.AMap.LngLat(point['lngLat'][0],point['lngLat'][1]))
                    sumLat += point['lngLat'][1]
                    sumLng += point['lngLat'][0]
                    num += 1
                    this.getRoad(point)
                    this.getCross(point)
                }
                this.drawPath(lngLats) 
                if(num!==0){
                    this.map.setCenter(new this.AMap.LngLat(sumLng/num, sumLat/num))
                    this.map.setZoom(12)
                }
                let temp = []
                for(let road of this.roads){
                    if(road['stop_time']-road['start_time']>5){
                        temp.push(road)
                    }
                }
                this.roads = temp
            }).catch(e => {
                console.log(e);
            })
        },
        drawPath(lngLats,color='red'){
            let polyline = new this.AMap.Polyline({
                path: lngLats,  
                borderWeight: 3, // 线条宽度，默认为 1
                strokeColor: color, // 线条颜色
                lineJoin: 'round' // 折线拐点连接处样式
            })
            // 将折线添加至地图实例
            this.map.add(polyline)
            return polyline
        },
        showCross(row){
            if(null !== this.marker){
                this.map.remove(this.marker)
            }
            if(null !== this.path){
                this.map.remove(this.path)
                this.path = null
            }
            this.marker = row['marker']
            this.map.add(this.marker)
            
            this.map.setCenter(row['position'])
            this.map.setZoom(17)
        },
        showRoad(row){
            if(null !== this.path){
                this.map.remove(this.path)
            }
            if(null !== this.marker){
                this.map.remove(this.marker)
                this.marker = null
            }
            this.path = this.drawPath(row['points'], 'blue')
            let sumLng=0
            let sumLat=0
            let num=0
            for(let point of row['points']){
                sumLat += point['lat']
                sumLng += point['lng']
                num += 1
            }
            if(num>0){
                this.map.setCenter(new this.AMap.LngLat(sumLng/num, sumLat/num))
                this.map.setZoom(15)
            }
        },
        getRoad(point){
            let roads = point['roads']
            if(roads.length>0){
                //window.console.log(roads)
                let road = roads[0]
                let hasRoad = false
                for(let i=this.roads.length-1;i>=0;i--){
                    if(this.roads[i]['id'] === road['id']){
                        if(point['Time'] - this.roads[i]['stop_time'] > 3){
                            hasRoad = false
                        }
                        else{
                            this.roads[i]['stop_time'] = point['Time']
                            this.roads[i]['points'].push(new this.AMap.LngLat(point['lngLat'][0],point['lngLat'][1]))

                            hasRoad = true
                        }
                        break                      
                    }
                }
                if(!hasRoad){
                    this.roads.push({
                        id: road['id'], name: road['name'], 
                        start_time: point['Time'],
                        stop_time: point['Time'],
                        points :[new this.AMap.LngLat(point['lngLat'][0],point['lngLat'][1])]
                    })
                }
            }
        },
        getCross(point){
            let crosses = point['crosses']
            if(crosses.length>0 && crosses[0]['distance']<= 10){
                let cross = crosses[0]
                let hasCross = false
                let crossesLength = this.crosses.length
                if(crossesLength !== 0){
                    if(this.crosses[crossesLength-1]['first_id'] === cross['first_id'] && this.crosses[crossesLength-1]['second_id'] === cross['second_id']){
                        if(point['Time'] - this.crosses[crossesLength-1]['pass_time'] > 3){
                            hasCross = false
                        }
                        else{
                            hasCross = true
                            if(this.crosses[crossesLength-1]['distance'] > cross['distance']){
                                let marker = new this.AMap.Marker({
                                    position: new this.AMap.LngLat(point['lngLat'][0],point['lngLat'][1])
                                })
                                this.crosses[crossesLength-1]['marker'] = marker
                                this.crosses[crossesLength-1]['pass_time'] = point['Time']
                                this.crosses[crossesLength-1]['distance'] = cross['distance']
                                this.crosses[crossesLength-1]['position'] = point['lngLat']
                            }
                        }
                    }
                }
                if(!hasCross){
                    let marker = new this.AMap.Marker({
                        position: new this.AMap.LngLat(point['lngLat'][0],point['lngLat'][1])
                    })
                    this.crosses.push({first_id: cross['first_id'], first_name: cross['first_name'], 
                                        second_id: cross['second_id'], second_name: cross['second_name'], 
                                        pass_time: point['Time'], distance: cross['distance'], 
                                        marker: marker, position: point['lngLat']})
                }
            }
        },
        formatUnixtimestamp (timestamp){
                let unixtimestamp = new Date(timestamp*10**3);
                let year = 1900 + unixtimestamp.getYear();
                let month = "0" + (unixtimestamp.getMonth() + 1);
                let date = "0" + unixtimestamp.getDate();
                let hour = "0" + unixtimestamp.getHours();
                let minute = "0" + unixtimestamp.getMinutes();
                let second = "0" + unixtimestamp.getSeconds();
                return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
                    + " " + hour.substring(hour.length-2, hour.length) + ":"
                    + minute.substring(minute.length-2, minute.length) + ":"
                    + second.substring(second.length-2, second.length);
        },
    }
}
</script>

<style scoped>
    .road-map-panel{
        position: relative;
        width: 100%;
    }
    .el-row{
        width: 100%;
    }
    .amap-box{
        height: 30rem;
        width: 100%;
    }
    .grid-content {
        min-height: 1rem;
    }
</style>