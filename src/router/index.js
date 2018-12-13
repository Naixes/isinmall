import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import CartList from '@/views/CartList'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

Vue.use(Router)

export default new Router({
  // 设置路由模式
  mode: 'hash', // hash(#)/abstract
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'CartList',
      component: CartList
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderconfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/ordersuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
