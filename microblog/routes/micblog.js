/**
 * Created by Administrator on 2015/8/10 0010.
 */



var express = require('express');
var router = express.Router();
var Post = require("../post");
var User = require("../user");
function checkLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

//获取微博信息
router.get('/', function(req, res) {
    console.log(req.user+"=========================-");
    User.get(req.user, function(err, user) {
        console.log(user+"      ***********");
        if (!user) {
            return res.redirect('/');
        }
        Post.get(user.name, function(err, posts) {
            console.log("-----------"+err);
            if (err) {
                return res.redirect('/');
            }
            console.log(posts);
            res.render('user', {
                user: user.name,
                posts: posts
            });
        });
    });
    console.log("fffffffffffffffffffffffff");
});


/* 发表信息 */
router.post('/', checkLogin);
router.post('/', function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/u/' + currentUser.name);
    });
});
module.exports = router;