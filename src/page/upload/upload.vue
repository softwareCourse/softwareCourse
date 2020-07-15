<template>
    <div>
        <el-container>
            <el-aside width="200px"></el-aside>
            <el-container>
                <el-header>
                    <div class="header-label">
                        路径上传
                    </div>
                </el-header>
                <el-main>
                    <div class="upload-panel">
                        <el-upload
                            class="upload-demo"
                            drag
                            ref="upload"
                            accept=".json"
                            :auto-upload="false"
                            :on-change="setFile"
                            :on-remove="removeFile"
                            action="/">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传json文件，且不超过500kb</div>
                        </el-upload>
                        <el-button 
                                type="primary"
                                class='submit-button'
                                :disabled="!file"
                                :loading="runningFlag"
                                @click="readFile"
                            >上传文件</el-button>
                    </div>
                    <div class="timeline-panel">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in activities"
                                :key="index"
                                :color="activity.color"
                                :icon="activity.icon"
                                size="large">
                                {{activity.content}}
                            </el-timeline-item>
                        </el-timeline>
                        <el-button 
                                type="success"
                                class='submit-button'
                                :disabled="!finishFlag"
                                @click="goStats"
                            >进入统计页面</el-button>
                    </div>

                </el-main>
            </el-container>
            
            <el-aside width="200px"></el-aside>
        </el-container>
        <div class="footer">
            路径统计工具@softwareCourse
        </div>
    </div>
    
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
    name: 'UploadPage',
    data () {
        return {
            file: null,
            uploadData: null,
            geocoder: null,
            finishFlag: false,
            runningFlag: false,
            distance: 0,
            finish: {
                icon: 'el-icon-check',
                color: '#67C23A'
            },
            running: {
                icon: 'el-icon-loading',
                color: '#909399'
            },
            notRunning: {
                icon: '',
                color: '#E4E7ED'
            },
            activities: [
                {
                    content: '读取文件',
                },
                {
                    content: '坐标转换',
                }, /*{
                    content: '路径纠偏',
                },*/ {
                    content: '逆地理解析',
                }, {
                    content: '数据加载完成',
                }
            ]
        }
    },
    mounted(){
        this.file = null
        this.uploadData = null
        this.finishFlag= false
        this.runningFlag= false
        this.distance = 0
        for(let activity of this.activities) {
            activity['icon'] = this.notRunning['icon']
            activity['color'] = this.notRunning['color']
        }
        AMapLoader.load({
            "key": "c456a66f90bbed06c6214bc9d5168fcb",   // 申请好的Web端开发者Key，首次调用 load 时必填
            "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            "plugins": []  //插件列表
        }).then((AMap)=>{
            this.AMap = AMap
            AMap.plugin('AMap.Geocoder', ()=> {
                this.geocoder = new AMap.Geocoder({
                    city: "010", //城市设为北京，默认：“全国”
                    radius: 1000, //范围，默认：500
                    extensions: 'all',
                    batch: true
                })
            })
        }).catch(e => {
            console.log(e);
        })
        
    },
    methods: {
        setFile(file){
            this.file = file
        },
        removeFile(){
            this.file = null
        },
        goStats(){
            this.$router.push({ name: 'stats'})
        },
        readData() {
            let p = new Promise((resolve, reject) => {
                window.console.log('readData')
                let activity = this.activities[0]
                activity['icon'] = this.running['icon']
                activity['color'] = this.running['color']
                this.$set(this.activities, 0, activity)
                
                let reader = new FileReader()               
                reader.onload = (e)=> {
                    let uploadData = JSON.parse(e.target.result)
                    if(uploadData instanceof Array && uploadData.length > 0 &&
                        'Time' in uploadData[0] && 'Longitude' in uploadData[0] 
                        && 'Latitude' in uploadData[0] && 'HeadingAngle' in uploadData[0] 
                        && 'Velocity' in uploadData[0]){
                        this.uploadData = uploadData
                        activity['icon'] = this.finish['icon']
                        activity['color'] = this.finish['color']
                        this.$set(this.activities, 0, activity)
                        window.console.log('read success')
                        resolve()
                    }
                    else{
                        this.$message.error('json文件格式出错，无法解析');
                        reject()
                    }
                }
                reader.onerror = () => {
                    this.$message.error('json文件格式出错，无法解析');
                    this.uploadData = null
                    reject()
                }
                reader.readAsText(this.file.raw)
            })
            return p
            
        },
        transform(start, end){
            let p = new Promise((resolve, reject) => {
                let points = this.uploadData.slice(start, end)
                let lngLats = []
                for(let i=0;i<points.length;i++){
                    lngLats.push(points[i]['lngLat'])
                }
                this.AMap.convertFrom(lngLats, 'gps', (status, result) => {
                    if (result.info === 'ok') {
                        let resLnglats = result.locations
                        for(let i = 0;i<end-start;i++){
                            this.uploadData[start+i]['lngLat'] = resLnglats[i]
                        }
                        resolve()
                    }
                    else{
                        reject(start, end)
                    }
                })
            })
            return p
        },
        transformBatch(){
            window.console.log('transformBatch')
            let activity = this.activities[1]
            activity['icon'] = this.running['icon']
            activity['color'] = this.running['color']
            this.$set(this.activities, 1, activity)
            let transformList = []
            for(let point of this.uploadData){
                point['lngLat'] = new this.AMap.LngLat(point['Longitude'], point['Latitude'])
            }
            for(let index=0;index < Math.ceil(this.uploadData.length/40);index++){
                transformList.push(this.transform(index*40, Math.min((index+1)*40, this.uploadData.length)))
            }
            //window.console.log(this.uploadData)
            return Promise.all(transformList).then(
                ()=>{
                    activity['icon'] = this.finish['icon']
                    activity['color'] = this.finish['color']
                    this.$set(this.activities, 1, activity)
                }
            )
        },
        /*
        graspRoad(start, end){
            let p =  new Promise((resolve, reject) => {
                let points = this.uploadData.slice(start, end)
                let pathParamList = []
                let startTime = this.uploadData[0]['Time']
                for(let point of points){
                    pathParamList.push(
                        {
                            "x":point['lngLat']['lng'],
                            "y":point['lngLat']['lat'],
                            "sp":point['Velocity']/3.6,
                            "ag":point['HeadingAngle'],
                            "tm":parseInt(point['Time']-startTime)+1
                        }
                    )
                }
                pathParamList[0]['tm'] = startTime
                window.console.log(pathParamList)
                this.AMap.plugin('AMap.GraspRoad',() => {
                    let grasp = new this.AMap.GraspRoad();
                    grasp.driving(pathParamList,(error,result) => {
                        if(!error){
                            let newPath = result.data.points;
                            window.console.log(newPath)
                            this.distance += result.data.distance;
                            resolve()
                        }
                        else{
                            reject(error)
                        }
                    })
                })
            })
            return p
        },
        graspRoadBatch(){
            window.console.log('graspRoad')
            let activity2 = this.activities[2]
            activity2['icon'] = this.running['icon']
            activity2['color'] = this.running['color']
            let graspRoadFuncs = []
            for(let index=0;index < Math.ceil(this.uploadData.length/450);index++){
                graspRoadFuncs.push(this.graspRoad(index*450, Math.min((index+1)*450, this.uploadData.length)))
            }
            window.console.log(this.uploadData)
            return Promise.all(graspRoadFuncs)
        },
        */
        getRegeoCode(start, end){
            let p =  new Promise((resolve, reject) => {
                let points = this.uploadData.slice(start, end)
                let lngLats = []
                for(let i=0;i<points.length;i++){
                    lngLats.push(points[i]['lngLat'])
                }

                this.geocoder.getAddress(lngLats, (status, result) => {
                    if (status === 'complete'&&result.regeocodes) {
                        let regeocodes = result.regeocodes;

                        for(let i = 0;i<end-start;i++){
                            this.uploadData[start+i]['roads'] = regeocodes[i].roads
                            this.uploadData[start+i]['crosses'] = regeocodes[i].crosses
                        }
                        
                        resolve()
                    }else{
                        reject('批量逆地理解析：status: {0}, points index: {1}, {2}'.format(status, start, end))
                    }
                
                })
            })  
            return p          
        },
        getRegeoCodeBatch(){
            window.console.log('getRegeoCodeBatch')
            let activity = this.activities[2]
            activity['icon'] = this.running['icon']
            activity['color'] = this.running['color']
            this.$set(this.activities, 2, activity)
            let getAddressFuncs = []
            for(let index=0;index < Math.ceil(this.uploadData.length/20);index++){
                getAddressFuncs.push(this.getRegeoCode(index*20, Math.min((index+1)*20, this.uploadData.length)))
            }
            //window.console.log(this.uploadData)
            return Promise.all(getAddressFuncs).then(
                ()=>{
                    activity['icon'] = this.finish['icon']
                    activity['color'] = this.finish['color']
                    this.$set(this.activities, 2, activity)
                }
            )
        },
        readFile(){
            /*
            1. read file
            2. transfer gps to gdLnglat
            3. grasp Road
            4. get address
            */
            this.runningFlag = true
            this.readData()
                .then(this.transformBatch)
                //.then(this.graspRoadBatch)
                .then(this.getRegeoCodeBatch)
                .then(()=>{
                    let activity = this.activities[3]
                    activity['icon'] = this.finish['icon']
                    activity['color'] = this.finish['color']
                    this.$set(this.activities, 3, activity)
                    window.console.log('finish all')
                    window.console.log(this.uploadData)
                    this.runningFlag = false
                    this.finishFlag = true
                    for(let point of this.uploadData){
                        point['lngLat'] = [point['lngLat']['lng'],point['lngLat']['lat']]
                    }
                    this.$store.commit("changeRoadData",this.uploadData)
                }).catch(err =>{
                    window.console.log(err)
                })
            
        }
    }
}
</script>

<style scoped>
    .header-label{
        padding:1rem 0;
        font-size: 1.5rem;
        line-height: 1.5;
        border-bottom: 1px solid rgb(160, 207, 255);
        color: rgb(83, 168, 255);
    }
    .footer{
        position: fixed;
        height: 4rem;
        width: 100%;
        bottom: 0;
        display: flex;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
        text-align: center;
        color: rgb(140, 197, 255);
        font-family: "Microsoft YaHei","微软雅黑",Arial,sans-serif;
        background: #fff;
    }
    .el-main{
        display: flex;
        flex-direction: column;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
    }
    .upload-panel{
        width: 50%;
    }
    .timeline-panel{
        width: 50%;
        padding: 1rem;
    }
</style>