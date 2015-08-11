
var mongodb = require('./db');

function Post(username, post, time) {
  this.user = username;
  this.post = post;
  if (time) {
    this.time = time;
  } else {
    this.time = new Date();
  }
}
module.exports = Post;
//存储微博内容
Post.prototype.save = function save(callback) {
  console.log("---- save blog ---------");
  // 存入  Mongodb的文档
  var post = {
    user: this.user,
    post: this.post,
    time: this.time
  };
  mongodb.open(function (err, db) {
    console.log("open　save blog -------"+err);
    if (err) {
      return callback(err);
    }
    // 读取 posts集合
    db.collection('posts', function (err, collection) {
      console.log("posts      :"+err);
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 为 user属性添加索引
      collection.ensureIndex('user');
      // 写入post文档
      collection.insert(post, {safe: true}, function (err, post) {
        mongodb.close();
        callback(err, post);
      });
    });
  })
}
//从数据中获取微博，可以指定用户获取，也可以获取全部的内容
Post.get = function get(username, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //  读取posts集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }// 查找 user 属性为 username 的文档，如果 username 是 null则匹配全部
      var query = {};
      if (username) {
        query.user = username;
      }
      collection.find(query).sort({time: -1}).toArray(function(err, docs) {
        mongodb.close();
        if (err) {
          callback(err, null);
        }
        //  封装posts 为 Post对象
        var posts = [];
        docs.forEach(function(doc, index) {
          var post = new Post(doc.user, doc.post, doc.time);
          posts.push(post);
        });
        callback(null, posts);
      });
    });
  });
}

