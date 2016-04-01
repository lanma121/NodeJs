/**
 * Created by Administrator on 2015/7/22 0022.
 */
var server = require("./server");
var router = require("./route");
server.start(router.route);