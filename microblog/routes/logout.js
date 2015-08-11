var express = require('express');
var router = express.Router();

function checkLogin(req, res, next) {
  console.log("session login :"+req.session.user);
  if (!req.session.user) {
    req.flash('error', '');
    return res.redirect('/login');
  }
  next();
}
/* 用户退出 */

router.get('/', checkLogin);
router.get('/', function(req, res) {
  req.session.user = null;
  req.flash('success', '未登录');
  res.redirect('/');
});

module.exports = router;
