var express = require('express');
var router = express.Router();//Router-level middleware
var Post = require("../post");
/* GET home page. */

router.get('/', function(req, res, next) {
  //console.log(req.session.user.username);
  Post.get(req.session.user, function(err, posts) {
    console.log(err+"     ---------"+req.session.user);
    if (err) {
      posts = [];
    }
    console.log(posts);
    res.render('index', {
      user:req.session.user,
      posts: posts,
      layout:"layout"//指定页面布局
    });
  });
});

module.exports = router;
