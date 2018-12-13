// 创建商品模型

var mongoose = require('mongoose')

var Schema = mongoose.Schema

// 定义商品模型
var productSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "checked":String,
  "productNum":Number,
  "productImage": String
})

// 绑定数据并导出模型
module.exports = mongoose.model('Good', productSchema)
