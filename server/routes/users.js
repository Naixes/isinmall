var express = require('express');
var router = express.Router();

var Users = require('../models/users')
require('./../util/util')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  var params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  Users.findOne(params, (err, userData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      })
    }else {
      if(userData) {
        // 将用户名存入cookie
        res.cookie('userId', userData.userId, {
          // 将cookie放入根目录
          path: '/',
          // cookie的周期
          maxAge: 1000*60*60
        })
        res.cookie('userName', userData.userName, {
          path: '/',
          maxAge: 1000*60*60
        })
        res.json({
          status: '0',
          msg: '',
          result: {
            'userName': userData.userName
          }
        })
      }else {
        res.json({
          status:'1',
          result: '用户名或密码错误'
        })
      }
    }
  })
})

// 查询购物车数量
router.get('/cartCount', (req, res, next) => {
  Users.findOne({userName: req.cookies.userName}, (err, userData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      if(userData) {
        let cartCount = 0
        userData.cartList.forEach(item => {
          cartCount += parseInt(item.productNum)
        })
        res.json({
          status: '0',
          msg: '',
          result: {
            cartCount
          }
        })
      }
    }
  })
})

// 登出
router.post('/logout', (req, res, next) => {
  // 清除cookie
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

router.get('/checkLogin', (req ,res, next) => {
  if(req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: {
        userName: req.cookies.userName
      }
    })
  }
})

// 获取购物车信息
router.get('/cartList', (req, res, next) => {
  Users.findOne({userId: req.cookies.userId}, (err, cartListData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      if(cartListData) {
        res.json({
          status: '0',
          msg: '',
          result: {
            cartList: cartListData.cartList
          }
        })
      }
    }
  })
})

// 删除购物车商品
router.post('/cartDel', (req, res, next) => {
  const userId = req.cookies.userId, productId = req.body.productId
  Users.update({userId}, {
    // 删除$pull
    $pull: {cartList: {productId}}
  }, (err, delData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
})

// 编辑购物车商品
router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId,
      productNum = req.body.productNum,
      productId = req.body.productId,
      checked = req.body.checked
  Users.update({userId, 'cartList.productId': productId},
    {'cartList.$.productNum': productNum, 'cartList.$.checked': checked},
    (err, editData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
})

// 选中全部商品
router.post('/checkAll', (req, res, next) => {
  let check = req.body.checkAll
  Users.findOne({userId: req.cookies.userId}, (err, userData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      if(userData) {
        userData.cartList.map(item => {
          item.checked = check ? 1 : 0
          // console.log(item.checked)
        })
        userData.save(err => {
          if(err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          }else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        })
      }
    }
  })
})

// 获取地址列表
router.get('/address', (req, res, next) => {
  Users.findOne({userName: req.cookies.userName}, (err, userData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      if(userData) {
        res.json({
          status: '0',
          msg: '',
          result: {
            addressList: userData.addressList
          }
        })
      }
    }
  })
})

// 修改默认地址
router.post('/setDefault', (req, res, next) => {
  Users.findOne({userName: req.cookies.userName}, (err, userData) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      if(userData) {
        userData.addressList.forEach(item => {
        item.isDefault = item.addressId == req.body.addressId
        })
        userData.save(err => {
          if(err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          }else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        })
      }
    }
  })
})

// 删除地址
router.post('/delAddress', (req, res, next) => {
  Users.update({userId: req.cookies.userId},
    {$pull: {addressList: {addressId: req.body.addressId}}},
    (err, delData) =>　{
      if(err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }else {
        res.json({
          status: '0',
          msg: '',
          result: ''
        })
      }
    }
  )
})

// 提交订单
router.post('/orderConfirm', (req, res, next) => {
  Users.findOne({userId: req.cookies.userId}, (findUserDataErr, userData) => {
    if(findUserDataErr) {
      res.json({
        status: '1',
        msg: '',
        result: ''
      })
    }else {
      let orderId = '', goodsList = [], addressInfo = []
      // find返回第一个符合条件的成员，不返回数组
      // filter返回所有符合条件的成员，返回数组
      goodsList = userData.cartList.filter(item => item.checked == '1')

      addressInfo = userData.addressList.find(item => item.addressId == req.body.addressId)

      const plantForm = '67'
      // 返回0-1之间的随机数,乘10，向下取整：0-9
      const r1 = Math.floor(Math.random()*10)
      const r2 = Math.floor(Math.random()*10)
      const sysDate = new Date().Format('yyyyMMddhhmmss')
      const createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')

      orderId = plantForm+r1+sysDate+r2

      if(userData) {
        userData.orderList = {
          orderId,
          orderTotal: req.body.orderTotal,
          addressInfo,
          goodsList,
          oderStatus: '0',
          createDate
        }
      }
      userData.save(saveErr => {
        if(saveErr) {
          res.json({
            status: '1',
            msg: '',
            result: ''
          })
        }else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
            }
          })
        }
      })
    }
  })
})

// 获取订单详情
router.get('/orderDetail', (req, res, next) => {
  Users.findOne({userId: req.cookies.userId}, (err, userData) => {
    if(err) {
      res.json({
        status: '1',
        msg: '',
        result: ''
      })
    }else {
      if(userData) {
        const orderDetail = userData.orderList.find(item => item.orderId == req.param('orderId'))
        if(orderDetail) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderTotal: orderDetail.orderTotal
            }
          })
        }else {
          res.json({
            status: '12001',
            msg: '无此订单',
            result: ''
          })
        }
      }
    }
  })
})

module.exports = router;
