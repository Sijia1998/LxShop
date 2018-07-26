const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//骨架模板
const productSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "productUrl": String
});

module.exports = mongoose.model('Good',productSchema);//模型


