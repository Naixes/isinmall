# 项目结构

index.html
src

​	views -- 页面
​	App.vue
​	main.js
​	components
​	router
​	util
​	assets
​		css
​		img
static
.babelrc
pacckage.json
.gitignore
README.md

# 页面布局

组件化布局

使用vue文件作为组件

# 功能实现

## 懒加载

1. 安装插件：


   npm install **vue-lazyload** --save-dev

2. main.js引入插件：

   import VueLazyLoad from 'vue-lazyload'
   Vue.use(VueLazyLoad,{
       error:require('./statics/site/imgs/erro.jpg'),
       loading:require('./statics/site/imgs/load.gif')
   })

3. vue文件中将需要懒加载的图片 :src="" 修改为 v-lazy="" 

## 路由跳转

```js
// 引入路由
import VueRouter from 'vue-router'
// 安装路由
Vue.use(VueRouter)

export default new Router({
  // 设置路由模式
  mode: 'hash', // hash(#)/abstract
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    ...
  ],
  // 修改高亮路由的样式类
  linkActiveClass: 'mui-active'
})
export default router

```

<router-view/> 占位显示匹配到的组件

<router-link to="/home">设置路由跳转

# 请求处理

```js

// 发送请求
// 引入vue-resource，操作请求
import VueResource from 'vue-resource'
// 安装vueResource
Vue.use(VueResource)
// 设置api默认主域名，也可以在vm中设置http: {root: ''}
// Vue.http.options.root = 'http://vue.studyit.io'

import axios from 'axios'
axios.post('/users/login', {userName: this.userName, userPwd: this.userPwd}).then(result => {
    let res = result.data
    // console.log(res)
    if(res.status == '0') {
        this.errorTip = false
        this.loginShow = false
        // console.log(res.result.userName)
        this.$store.commit('updateNickName', res.result.userName)
        this.getCartCount()
    }else {
        this.errorTip = true
    }
})
```

## 代理转发

## 购物车数量和用户名同步

```js
// 引入安装状态管理工具vuex
import Vuex from 'vuex'
Vue.use(Vuex)
```

vuex

this.$store.commit('updateCartCount', -parseInt(this.delItem.productNum))

## 排序和过滤

let goodsList = Goods.find(params).skip(skip).limit(pageSize)

goodsList.sort({'salePrice': sort})

goodsList.exec((err, doc) => {})

## 登录

**cookie-parser**

## 登陆拦截

**express中间件**

## 格式化价格

全局过滤器

Vue.filter('currencyFormat', currency)

## 滚动加载

**vue-infinite-scroll**

## 结合slot创建全局模态框组件

<!-- 插槽，只有一个时可以不用添加name -->

​          <slot name="bread"></slot>

## 父子组件通信

<modal :mdShow="cartMsgShow" @close="closeModal">

this.$emit('close')

## 购物车编辑

### 总价格和全选的自动计算

计算属性



