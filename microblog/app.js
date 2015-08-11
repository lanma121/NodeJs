var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var partials = require("express-partials");
var mongoStore = require("connect-mongo")(session);//https://github.com/kcbanner/connect-mongo
var setting  = require("./setting");

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var micblog = require('./routes/micblog');
var reg = require('./routes/reg');
var app = express();//创建一个web应用实例，后面的操作都是针对这个实例进行的

var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});
//app.use(express.logger({stream: accessLogfile}));
//
//  app.error(function (err, req, res, next) {
//    var meta = '[' + new Date() + '] ' + req.url + '\n';
//    errorLogfile.write(meta + err.stack + '\n');
//    next();
//  });




/**
 * app.set();设置参数
 *
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

/**
 * app.use();启用中间件
 *
 */
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());//解析客户端请求
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());//解析cookie
app.use(express.static(path.join(__dirname, 'public')));//支持静态文集，并指定目录（public）；
//把会话信息存入数据库中，以免丢失 http://www.myext.cn/javascript/a_6290.html
app.use(session({
  secret:setting.cookieSecret,
  store:new mongoStore({db:setting.db})
}))
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/logout', logout);
app.use('/micblog', micblog);
app.param('user', function (req, res, next, user) {
  if(user){
    req.user = user;
    console.log(req.user+"*******************");
    next();
  }else{
    console.log('CALLED ONLY ONCE  '+user);
  }
  console.log(req.user+"------------------------");

})
app.use('/u/:user', micblog);
app.use('/reg', reg);



//app.dynamicHelpers({
//  user: function(req, res) {
//    return req.session.user;
//  },
//  error: function(req, res) {
//    var err = req.flash('error');
//    if (err.length)
//    return err;
//    else
//    return null;
//  },
//  success: function(req, res) {
//    var succ = req.flash('success');
//    if (succ.length)
//      return succ;
//    else
//      return null;
//  }
//});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
