var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var  User = require('../user');


function checkNotLogin(req, res, next) {
  console.log("checkNotLogin: "+req.session.user);
  if (req.session.user) {
    //req.flash('error', '已登录');
    return res.redirect('/');
  }
  next();
}

/*用户登录 */
router.post('/', checkNotLogin);
router.post('/', function(req, res, next) {
  console.log("--------------------------------");
  console.log(req.body.username+"    "+req.body.password);
  // 生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.get(req.body.username, function(err, user) {
    console.log(user);
    if (!user) {
      //req.flash('error', '');
      return res.redirect('/login');
    }
    if (user.password != password) {
      //req.flash('error', '');
      return res.redirect('/login');
    }
    req.session.user = user;
    //req.flash('success', '');
    res.redirect('/');
  });
});

//app.get('/logout', function(req, res) {
//  req.session.user = null;
//  req.flash('success', '');
//  res.redirect('/');
//});
router.get('/', checkNotLogin);
router.get('/', function(req, res, next) {
  res.render('login', { title: '用户登录' });
});
module.exports = router;
