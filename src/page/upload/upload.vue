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
                                size="large"
                                :timestamp="activity.timestamp">
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
export default {
    name: 'UploadPage',
    data () {
        return {
            file: null,
            uploadData: null,
            finishFlag: true,
            finish: {
                icon: 'el-icon-check',
                color: '#67C23A'
            },
            running: {
                icon: 'el-icon-loading',
                color: '#909399'
            },
            notRunning: {
                icon: 'el-icon-time',
                color: '#E4E7ED'
            },
            activities: [
                {
                    content: '坐标转换',
                    timestamp: '2018-04-03 20:46',
                    icon: 'el-icon-check',
                    color: '#67C23A'
                }, {
                    content: '路径纠偏',
                    timestamp: '2018-04-03 20:46',
                    icon: 'el-icon-loading',
                    color: '#909399'
                }, {
                    content: '逆地理解析',
                    timestamp: '',
                    icon: '',
                    color: '#E4E7ED'
                }, {
                    content: '数据加载完成',
                    timestamp: '',
                    icon: '',
                    color: '#E4E7ED'
                }
            ]
        }
    },
    mounted(){
        this.file = null
        this.uploadData = null
    },
    methods: {
        readData(file) {
            const reader = new FileReader()
            reader.readAsText(file.raw)
            reader.onload = (e) => {
                try {
                    this.uploadData = JSON.parse(e.target.result)
                }
                catch(err){
                    this.$message.error('json文件格式出错，无法解析');
                    this.uploadData = null
                }
            }
        },
        readFile(){
            this.readData(this.file)
        },
        setFile(file){
            this.file = file
        },
        removeFile(){
            this.file = null
        },
        goStats(){
            this.$router.push({ name: 'stats'})
        },
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
    .submit-button{
        margin: 1rem 0;
    }
    .timeline-panel{
        width: 50%;
        padding: 1rem;
    }
</style>