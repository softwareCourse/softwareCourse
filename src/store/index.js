import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        roadData: null
    },
    mutations: {
        changeRoadData(state, data) {
            state.roadData = data
        }
    },
    plugins: [persistedState({ storage: window.sessionStorage })]
})

export default store