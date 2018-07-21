import Vue from 'vue'
import Router from 'vue-router'
import Goodslist from '@/views/Goodslist'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Goodslist',
      component: Goodslist
    }
  ]
})
