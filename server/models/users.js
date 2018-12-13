const mongoose = require('mongoose')

// 定义json结构
const usersSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPsw": String,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "salePrice": String,
      "checked":String,
      "productNum":String,
      "productImage": String
    }
  ],
  "addressList": [
    {
      "addressId" : String,
      "userName" : String,
      "streetName" : String,
      "postCode" : Number,
      "tel" : Number,
      "isDefault" : Boolean
    }
  ]
})

// 输出模型
module.exports = mongoose.model('User', usersSchema)
