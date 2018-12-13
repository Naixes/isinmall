<template>
  <div>
    <!--标签名不能有大写！！！-->
    <nav-header></nav-header>
    <nav-bread>
      <!-- 插槽 -->
      <span slot='bread'>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <!-- sortby -->
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortByPrice">Price
            <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click='showFilterby'>Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterbyShow}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur': selectedFilter == 'all'} " @click='filterSelect("all")'>All</a></dd>
              <dd v-for="(item, index) in priceFilter" :key="item.startPrice">
                <a href="javascript:void(0)" :class="{'cur': selectedFilter == index}" @click='filterSelect(index)'>{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item.productId">
                  <div class="pic">
                    <!-- 添加懒加载 -->
                    <a href="#" ><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">${{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addcart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" class="load-more">
                <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loadingFlag">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 画面遮罩 -->
    <div class="md-overlay" v-show='maskShow' @click='closePop'></div>
    <!--向子组件传递状态-->
    <!--登陆提示模态框-->
    <modal :mdShow="loginMsgShow" @close="closeModal">
      <p slot="message">
        请先登录，否则无法加入购物车
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="loginMsgShow=false">关闭</a>
      </div>
    </modal>
    <!--加入购物车成功模态框-->
    <modal :mdShow="cartMsgShow" @close="closeModal">
      <p slot="message">
        <svg class="icon icon-status-ok">
          <use xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="cartMsgShow=false">继续购物</a>
        <!--路由跳转-->
        <router-link class="btn btn--m" to="/cart" @click="cartMsgShow=false">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'
import Modal from '@/components/Modal'
import axios from 'axios'

export default {
  data() {
    return {
      goodsList: [],

      priceFilter: [
        {startPrice: 0, endPrice: 100},
        {startPrice: 101, endPrice: 500},
        {startPrice: 501, endPrice: 1000},
        {startPrice: 1001, endPrice: 2000},
      ],
      selectedFilter: 'all',

      // sort by
      filterbyShow: false,
      maskShow:false,

      page: 1,
      pageSize: 4,
      // true为升序，1
      sortFlag: true,

      // 禁止滚动加载：false
      busy: false,
      loadingFlag: false,

      // 登陆提示
      loginMsgShow: false,
      // 加入购物车成功提示
      cartMsgShow: false
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted() {
    // console.log('mounted')
    this.getGoodsList(false)
  },
  methods: {
    // loadMoreFlag：true表示连续加载
    getGoodsList(loadMoreFlag) {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.selectedFilter
      }
      // 显示loading
      this.loadingFlag = true
      // 跨域请求
      axios.get('/goods/list', {params}).then(result => {
        // console.log(result)
        let res = result.data
        // 显示loading
        this.loadingFlag = false
        if(res.status == '0') {
          if(loadMoreFlag) {
            // 如果结果为零禁止滑动请求
            if(res.result.count == 0) {
              this.busy = true
            }else {
              this.goodsList = this.goodsList.concat(result.data.result.list)
              this.busy = false
            }
          }else {
            this.goodsList = res.result.list
            this.busy = false
          }
        }else {
          this.goodsList = []
        }
      }
    )
    },
    filterSelect(index) {
      this.selectedFilter = index
      // 注意清空页码
      this.page = 1
      this.getGoodsList(false)
      this.filterbyShow = false
      this.maskShow = false
    },
    showFilterby() {
      this.filterbyShow = true
      this.maskShow = true
    },
    closePop() {
      this.filterbyShow = false
      this.maskShow = false
    },
    sortByPrice() {
      this.page = 1
      this.sortFlag = !this.sortFlag
      this.getGoodsList(false)
    },
    loadMore() {
      // 停止加载
      this.busy = true

      // setTimeout避免多次请求
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    },
    addcart(productId) {
      // console.log(productId)
      axios.post('/goods/addcart', {productId}).then(result => {
        let res = result.data
        // console.log(res)
        if(res.status == '0') {
          this.cartMsgShow = true
          // 更新购物车
          this.$store.commit('updateCartCount', 1)
        }else if(res.status == '10001') {
          // alert(res.msg)
          this.loginMsgShow = true
        }else {
          alert(res.msg)
        }
      })
    },
    // 关闭模态框
    closeModal() {
      this.loginMsgShow = false
      this.cartMsgShow = false
    }
  }
}
</script>

<style scoped>
  .load-more {
    text-align: center;
  }
  .icon-arrow-short {
    transition: all .5s ease;
  }
  .sort-up {
    transform: rotate(180deg);
    transition: all .5s ease;
  }
</style>

