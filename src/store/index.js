import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        roadData: null
    },
    mutations: {
        changeRoadData(state, data) {
            state.roadData = data
        }
    }
})

export default store