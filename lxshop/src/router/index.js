import Vue from 'vue'
import Router from 'vue-router'
import Goodslist from '@/views/Goodslist'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'Goodslist',
      component: Goodslist
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }, {
      path: '/address',
      name: 'Address',
      component: Address
    }, {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    }
  ]
})
