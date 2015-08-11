var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var  User = require('../user');
/* 用户注册 */
router.get('/', function(req, res, next) {
//  for(var i in req.session){
//    console.log(i+" :    "+req.session[i]);
//  }
//  console.log("--------------------------------");
//  for(var i in req.cookies){
//    console.log(i+" :    "+req.cookies[i]);
//  }
//  console.log("--------------------------------");
//  for(var i in req.session.cookie.data){
//    console.log(i+" :    "+req.session.cookie.data[i]);
//  }
  res.render('reg', { title: '用户注册' });
});
router.post('/', function(req, res, next) {
  // 检查两次用户输入的口令是否一致
  var password = req.body.password;
  var password_repeat = req.body.password;
  var username = req.body.username;
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '');//通过Flash保存的变量只会在用户当前和下一次的请求中被访问
    return res.redirect('/reg');
  }
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    console.log("md5加密密码："+password);
    var newUser = new User({
      name: username,
      password: password
    });
    console.log(newUser.name+"    "+newUser.password);
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {//通过用户名获取已知用户
      console.log("获取用户名是否存在："+user);
      if (user){
        err = 'Username already exists.';
      }
      if (err) {
        //req.flash('error', err);
        console.log("----------------------");
        return res.redirect('/reg');
      }
      //如果不存在，则新增用户
      newUser.save(function(err) {//将用户数据写入数据库
        if (err) {
          req.flash('error', err);
          console.log("----------------------");
          return res.redirect('/reg');
        }
        req.session.user = newUser;//像会话对象写入当前用户的信息
        req.flash('success', '');
        res.redirect('/');
        console.log("将用户数据写入数据库");
      });
    });
});



module.exports = router;
