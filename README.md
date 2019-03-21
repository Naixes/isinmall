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

# 功能实现

## 懒加载

## 路由跳转

## 代理转发

## 购物车数量和用户名同步

vuex

this.$store.commit('updateCartCount', -parseInt(this.delItem.productNum))

## 排序和过滤

let goodsList = Goods.find(params).skip(skip).limit(pageSize)

goodsList.sort({'salePrice': sort})

goodsList.exec((err, doc) => {})

## 登录

cookie-parser

## 登陆拦截

express中间件

## 格式化价格

## 滚动加载

vue-infinite-scroll

## 结合slot创建全局模态框

## 父子组件通信

<modal :mdShow="cartMsgShow" @close="closeModal">

this.$emit('close')

## 购物车编辑

### 总价格和全选的自动计算

计算属性



