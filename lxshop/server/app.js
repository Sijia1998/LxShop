var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter =require('./routes/goods')
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//设置模板引擎
app.set('views', path.join(__dirname, 'views/'));  
app.engine('.html',ejs.__express); 
app.set('view engine', 'html');  


//使用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

//设置跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(function(req,res,next){
  if(req.cookies.userId){
    next()
  }else{
    console.log("path:"+req.path);
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list'){
      next()
    }else{
      res.json({
        status:'10001',
        msg:'您当前未登录',
        result:''
      })
    }
  }
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods',goodsRouter)


// catch 404 and forward to error handler  捕获404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler  捕获error
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
