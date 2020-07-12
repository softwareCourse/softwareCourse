<template>
    <div class="home-page">
        <div class='home-page-label'><i class="el-icon-map-location"></i>路径统计工具</div>
        <el-button class="start-button" type="text" 
            icon="el-icon-thumb"  @click="startTool">Start!</el-button>
    </div>
</template>

<script>

export default {
    name: 'HomePage',
    methods: {
        startTool(){
            this.$router.push({ name: 'upload'})
        }
    }
}
</script>

<style scoped>
    .home-page{
        position: absolute;  
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
        background: rgb(160, 207, 255);
    }

    .home-page-label{
        margin-bottom: 10rem;
        line-height: 1.75;
        font-size: 5rem;
        color: #fff;
        letter-spacing: 0.5rem;
        font-family: "Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }

    .start-button{
        color: #fff;
        font-size: 2.5rem;
    }
</style>