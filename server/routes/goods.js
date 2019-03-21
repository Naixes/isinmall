// 连接数据库获取数据

var express = require('express')
var router = express.Router()

var mongoose = require('mongoose')
var Goods = require('../models/goods')
var Users = require('../models/users')

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/isinmall')

// 监听连接状态
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected.')
})
mongoose.connection.on('error', () => {
  console.log('MongoDB connect error.')
})
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.')
})

// 注册子路由
router.get('/list', (req, res, next) => {
  // res.send('goodslist~~')
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param('sort')
  let params = {}
  let priceLevel = req.param('priceLevel')
  var priceGt = '', priceLte = ''
  if(priceLevel!='all') {
    switch (priceLevel) {
      case '0' :priceGt = 0; priceLte = 100; break;
      case '1' :priceGt = 100; priceLte = 500; break;
      case '2' :priceGt = 500; priceLte = 1000; break;
      case '3' :priceGt = 1000; priceLte = 2000; break;
      // case '4' :priceGt = 2000; break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let skip = (page - 1) * pageSize
  let goodsList = Goods.find(params).skip(skip).limit(pageSize)

  // console.log(`${page} ${pageSize} ${sort} ${skip}`)
  // 1是升序-1是降序
  goodsList.sort({'salePrice': sort})
  goodsList.exec((err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      })
    }else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

router.post('/addcart', (req, res, next) => {
  // 查询出用户信息
  Users.findOne({userId: '100000077'}, (userDataErr, userData) => {
    if(userDataErr) {
      res.json({
        status: '1',
        msg: userDataErr.message
      })
    }else {
      if(userData) {
        let goodsItem = ''
        // console.log(req.body.productId)
        userData.cartList.forEach(item => {
          if(item.productId == req.body.productId) {
            goodsItem = item
            item.productNum++
          }
        })
        // console.log(goodsItem)
        // 判断商品是否存在
        if(goodsItem) {
          userData.save(plusProductNumErr => {
            if(plusProductNumErr) {
              res.json({
                status: '1',
                msg: plusProductNumErr.message
              })
            }else {
              res.json({
                status: '0',
                msg: 'success'
              })
            }
          })
        }else {
          // post请求用body获取参数
          // 用商品Id查询商品信息
          Goods.findOne({productId: req.body.productId}, (productDataErr, productData) => {
            if(productDataErr) {
              res.json({
                status: '1',
                msg: productDataErr.message
              })
            }else {
              // 将商品信息保存到cartList里面去
              console.log(productData.productId)
              if(productData) {
                productData.productNum = 1
                productData.checked = 1
                userData.cartList.push(productData)
                userData.save(saveProductDataErr => {
                  if(saveProductDataErr) {
                    res.json({
                      status: '1',
                      msg: saveProductDataErr.message
                    })
                  }else {
                    res.json({
                      status: '0',
                      msg: 'success'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

// 不要忘记导出
module.exports = router
