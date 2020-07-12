<template>
    <div>
        <el-container>
            <el-aside width="200px"></el-aside>
            <el-container>
                <el-header>
                    <div class="header-label">
                        路径统计
                    </div>
                </el-header>
                <el-main>
                    <el-row class="tac">
                        <el-col :span="4">
                            <el-menu
                                default-active="1"
                                @select="selectMenu"
                                class="el-menu-vertical">
                                <el-menu-item index="1">
                                    <i class="el-icon-map-location"></i>
                                    <span slot="title">路径展示</span>
                                </el-menu-item>
                                <el-menu-item index="2">
                                    <i class="el-icon-data-analysis"></i>
                                    <span slot="title">统计图表</span>
                                </el-menu-item>
                            </el-menu>
                        </el-col>
                        <el-col :span="20">
                            <div v-if="menuIndex == 1">
                                <RoadMap/>
                            </div>
                            <div v-else>
                                <TableGroup/>
                            </div>
                        </el-col>
                    </el-row>
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
import RoadMap from '../../components/roadMap'
import TableGroup from '../../components/tableGroup'

export default {
    name: 'StatsPage',
    data() {
        return {
            menuIndex:1
        }
    },
    components:{
        RoadMap,
        TableGroup
    },
    mounted(){
        window.console.log(this.$store.state.roadData)
    },
    methods: {
        selectMenu(index){
            this.menuIndex = index
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
</style>