import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from '../page/home/home'
import UploadPage from '../page/upload/upload'
import StatsPage from '../page/stats/stats'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/home', name: 'home', component: HomePage },
        { path: '/upload', name: 'upload', component: UploadPage },
        { path: '/stats', name: 'stats', component: StatsPage },
        { path: '/', redirect: '/home' }
    ]
})

export default router