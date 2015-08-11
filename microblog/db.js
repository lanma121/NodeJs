/**
 * Created by Administrator on 2015/8/3 0003.
 */

/**
 * 数据库连接
 *
 *
 * @type {*|exports|module.exports}
 */


var setting = require('./setting.js');
var Db = require("mongodb").Db;
var connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
console.log(connection);
module.exports = new Db(setting.db,new Server(setting.host,27017,{}));
