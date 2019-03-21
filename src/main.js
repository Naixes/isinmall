// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 引入根组件
import App from './App'
// 引入路由
import router from './router'
// 引入状态管理
import Vuex from 'vuex'

import '@/assets/css/base.css'
import '@/assets/css/product.css'
import '@/assets/css/checkout.css'
import '@/assets/css/login.css'

// 价格格式化插件
import {currency} from '@/util/currency'

Vue.use(Vuex)

// 懒加载
import lazyload from 'vue-lazyload'
Vue.use(lazyload, {
  loading: '/static/loading-svg/loading-bars.svg'
})

// 滚动加载插件
import vueInfiniteScroll from 'vue-infinite-scroll'
Vue.use(vueInfiniteScroll)

Vue.config.productionTip = false

// 全局价格过滤器
Vue.filter('currencyFormat', currency)

// 状态管理模式
const store = new Vuex.Store({
  state: {
    // 用户名
    nickName: '',
    // 购物车数量
    cartCount: 0
  },
  mutations: {
    updateNickName(state, nickName) {
      state.nickName = nickName
    },
    updateCartCount(state, cartCount) {
      state.cartCount += parseInt(cartCount)
    },
    initCartCount(state, cartCount) {
      state.cartCount = parseInt(cartCount)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  // 或者使用mount挂载
  el: '#app',
  // 注册vuex实例
  store,
  router,
  // 或者使用render: createElement => createElement(App),渲染根组件
  // template底层也会调用render方法
  // 表示包含的子模版
  components: { App },
  // 表示使用App模板替换el指定的区域
  template: '<App/>'
})//.$mount('#app')
