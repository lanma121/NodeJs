/**
 * Created by Administrator on 2015/8/3 0003.
 */


/**
 *
 *
 *User 是一个描述数据的对象，即mvc中的m
 *
 *
 *
 *
 *
 * @type {Db|exports|module.exports}
 */

var mongodb = require("./db");

function User(user){
    this.name = user.name;
    this.password = user.password;
}
module.exports = User;


//对象实例方法
User.prototype.save = function save(callback){
    var user = {
        name:this.name,
        password:this.password
    }
    console.log(user.name+"   user  "+user.password);
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取user集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为name属性添加索引
            collection.ensureIndex('name',{unique:true});
            //写入文档
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                callback(err,user);
            });
        })
    });
}


//对象构造方法
User.get = function(username,callback){
    console.log("获取用户名："+username);
    mongodb.open(function(err,db){
        console.log(err);
        if(err){
            return callback(err);
        }
        //读取user集合
        db.collection('users',function(err,collection){
            console.log("users  "+err);
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找name属性为username的文档
            collection.findOne({name:username},function(err,doc){
                mongodb.close();
                console.log(doc);
                if(doc){
                    //分装文档为user对象
                    var user = new User(doc);
                    return callback(err,user);
                }else{
                    return callback(err,null);
                }
            })
        });

    });
}
