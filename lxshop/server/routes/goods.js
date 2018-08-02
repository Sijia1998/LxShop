var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('./../models/goods');
var User = require("../models/user")


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


//查询商品列表
router.get("/list", function (req, res, next) {
  let page = parseInt(req.query.page);
  let rows = parseInt(req.query.pageSize);
  let priceLevel = req.query.priceLevel;
  let sort = parseInt(req.query.sort)

  let priceGt = '';
  let priceLte = '';
  let params = {}

  if (priceLevel != "all") {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  // // 分页公式
  let skip = (page - 1) * rows //当前页码减1
  let goodsModel = Goods.find(params).skip(skip).limit(rows)

  goodsModel.sort({
    'salePrice': sort
  })
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
})

router.post('/addCart',(req,res,next)=>{
  let userId = "100000077";
  let productId = req.body.productId;
  User.findOne({userId:userId},(err,userDoc)=>{
    if(err){
      res.json({
          status:'1',
          msg:err.message
      })
    }else{
      // console.log("userDoc:"+userDoc);
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach((item)=>{
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){
          userDoc.save((err2,doc2)=>{
            // console.log("tyu",doc2);
            if(err2){
              res.json({
                  status:'1',
                  msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'success'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId},(err1,document)=>{
            if(err1){
              res.json({
                  status:'1',
                  msg:err1.message
              })
            }else{
              console.log("1111111111",document);
              if(document){
                document.productNum = 1;
                // document.checked = 1;
                userDoc.cartList.push(document);
                userDoc.save((err2,doc2)=>{
                  if(err2){
                    res.json({
                        status:'1',
                        msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
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

//加入到购物车
// router.post("/addCart", function (req, res, next) {
//   let User = require("../models/user")
//   // res.send('respond with a resource');
//   let userId = "100000077";
//   let productId = req.body.productId //POST请求通过req.body来取参数
//   let User = require("../models/user")
//   User.findOne({
//     userId: userId
//   },  (err, userDoc) => {
//     if (err) {
//       res.json({
//         status: "1",
//         msg: err.message
//       })
//     } else {
//       if (userDoc) {
//         let goodsItem = '';
//         // console.log(userDoc.cartList);
//         //判断购物车里是否已经有此商品
//         userDoc.cartList.forEach((item) => {
          
//           if (item.productId == productId) {
//             goodsItem = item;
//             console.log("123",item);
//             item.productNum++;
//           }
//         });
//         if (goodsItem) {
//           userDoc.save(function (err2, doc2) {
//             if (err2) {
//               res.json({
//                 status: "1",
//                 msg: err2.message
//               })
//             } else {
//               console.log("加入成功");
//               res.json({
//                 status: "0",
//                 msg: '',
//                 result: "success"
//               })
//             }
//           })
//         } else {
//           Goods.findOne({
//             productId: productId
//           }, function (err1, doc) {
//             if (err1) {
//               res.json({
//                 status: "1",
//                 msg: err1.message
//               })
//             } else {
//               if (doc) {
//                 doc.productNum = 1;
//                 console.log(doc.productNum);
                
//                 doc.checked = 1;
//                 userDoc.cartList.push(doc);
//                 userDoc.save( (err2, doc2) => {
//                   if (err2) {
//                     res.json({
//                       status: "1",
//                       msg: err2.message
//                     })
//                   } else {
//                     console.log("保存成功");
//                     res.json({
//                       status: "0",
//                       msg: '',
//                       result: "success"
//                     })
//                   }
//                 })
//               }
//             }
//           })
//         }
//       }

//     }
//   })
// })


module.exports = router;
