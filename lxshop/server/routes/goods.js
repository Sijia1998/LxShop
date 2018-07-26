var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('./../models/goods')

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.");
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.");
})

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.");
})

router.get("/",function(req,res,next){
  console.log(req.query);

  let page = parseInt(req.query.page);
  let rows = parseInt(req.query.pageSize);
  let sort = parseInt(req.query.sort)
  console.log(page,rows);
  console.log(sort);

  // // 分页公式
  let skip = (page-1)*rows//当前页码减1
  let goodsModel = Goods.find({}).skip(skip).limit(rows)

  goodsModel.sort({'salePrice':sort})
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  })
})

module.exports = router;