var express = require('express');
var router = express.Router();
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//POST请求通过req.body来取参数
//登录接口
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      if (doc) {
        //存入cookie
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 //1000毫秒 * 60 * 60分钟 =一个小时
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60 //1000毫秒 * 60 * 60分钟 =一个小时
        });

        //存入session
        // req.session.user = doc;

        res.json({
          status: "0",
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })

})

//登出接口
router.post('/logout', (req, res, next) => {
  //清除cookie
  res.clearCookie("userId", {
    path: '/',
  })
  res.json({
    status: "0",
    msg: "",
    result: ''
  })
})

router.get('/checkLogin', (req, res, next) => {
  // console.log(req.cookies);
  if (req.cookies.userName) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '0',
      msg: '未登录',
      result: ''
    })
  }
})

//查询当前用户的购物车数据
router.get('/cartList', (req, res, next) => {
  // console.log(req);
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})


//购物车商品删除接口
router.post('/cartdel', (req, res, next) => {
  console.log(req.body);
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  // console.log(productId);
  User.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
})


//修改商品数量
router.post('/carEdit', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;
  console.log(checked + typeof (checked));

  User.update({ //查询条件
    'userId': userId,
    'cartList.productId': productId,
  }, { //需要修改的数据
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
})

//全选和取消全选
router.post('/editCheckAll', function (req, res, next) {
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll ? '1' : '0';
  console.log(typeof (checkAll));
  User.findOne({
    userId: userId
  }, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        })
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1,
              message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        })
      }
    }
  })
})

//获取地址接口
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})

//删除地址信息接口
router.post('/removeAdd', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  User.update({
    userId: userId,
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
})

//设置默认地址接口
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  let isDefault = req.body.isDefault;
  User.findOne({
    userId: userId,
  }, (err, doc) => {
    if (!addressId) {
      res.json({
        status: '1003',
        msg: 'addressId is null',
        result: ''
      })
    } else {
      let addressList = doc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      console.log(addressList);

      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: 'success'
          })
        }
      })
    }
  })
})

//获取订单信息
router.get('/getOrderList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, (err, doc) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.orderList
      })
    }
  })
})
module.exports = router;
