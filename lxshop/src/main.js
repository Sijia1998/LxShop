// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'
import {currency} from './util/currency'

//按需引用iview
import 'iview/dist/styles/iview.css'//按需引用也需要引入css样式文件
import {Icon} from 'iview'

Vue.component('Icon',Icon)

Vue.config.productionTip = false

Vue.filter("currency",currency)

Vue.use(infiniteScroll)
Vue.use(Vuex)
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bubbles.svg"
})

const store = new Vuex.Store({
  //state是唯一数据源
  state:{
    nickName:'',
    cartCount:0
  },
  //mutations用来改变状态
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
