// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

//按需引用iview
import 'iview/dist/styles/iview.css'//按需引用也需要引入css样式文件
import {Icon} from 'iview'

Vue.component('Icon',Icon)

Vue.config.productionTip = false

Vue.use(infiniteScroll)

Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bubbles.svg"
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
