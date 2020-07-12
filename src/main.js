import Vue from 'vue'
import App from './App.vue'

import router from './router/index'
import store from './store/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.$echarts = echarts

String.prototype.format = function() {
    var values = arguments;
    return this.replace(/\{(\d+)\}/g, function(match, index) {
        if (values.length > index) {
            return values[index];
        } else {
            return "";
        }
    });
};

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')