var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var ejs = require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
// 设置页面路径
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.engine('.html', ejs.__express);
// 设置页面后缀
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 拦截登录信息，注意要在创建路由之前
app.use((req, res, next) => {
  // 注意是cookies
  if(req.cookies.userId) {
    next()
  }else {
    // console.log(`path:${req.path} originalUrl:${req.originalUrl}`)
    if(req.path == '/goods/list' || req.originalUrl == '/users/login' || req.originalUrl == '/users/logout') {
      next()
    }else {
      res.json({
        status: '10001',
        msg: '当前未登录',
        result: ''
      })
    }
  }
})

// 创建一级路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
