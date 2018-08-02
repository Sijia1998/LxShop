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
module.exports = router;
