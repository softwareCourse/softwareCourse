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
                                    <el-table-column prop="first_name" label="道路A" width="160">
                                    </el-table-column>
                                    <el-table-column prop="second_name" label="道路B" width="160">
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="道路统计" name="second">
                                <el-table class='result_table' :data="roads" stripe border highlight-current-row @row-click='showRoad' max-height='360' style="width: 100%">
                                    <el-table-column type="index" width="40">
                                    </el-table-column>
                                    <el-table-column label="开始时间" width="160">
                                        <template slot-scope="scope">
                                            <span>{{ formatUnixtimestamp(scope.row['start_time']) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="结束时间" width="160">
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
        }
    },
    mounted(){
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
        }).catch(e => {
            console.log(e);
        })
    },
    methods: {
        drawPath(lngLats,color='red'){
            let polyline = new this.AMap.Polyline({
                path: lngLats,  
                borderWeight: 2, // 线条宽度，默认为 1
                strokeColor: color, // 线条颜色
                lineJoin: 'round' // 折线拐点连接处样式
            })
            // 将折线添加至地图实例
            this.map.add(polyline)
            return polyline
        },
        /*
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
            
            this.map.setCenter(this.marker['G']['position'])
            this.map.setZoom(13)
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
                this.map.setCenter(new AMap.LngLat(sumLng/num, sumLat/num))
                this.map.setZoom(14)
            }
        },
        */
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