
/**
 * Created by Administrator on 2015/7/22 0022.
 */


var EventEmitter = require("events").EventEmitter;

var event = new EventEmitter();

    event.on("some_event",function(arg){

        console.log("一些事件触发-------------"+arg);
    });

    event.emit("some_event","我我参数");

    event.once("once",function(){
        console.log("----------------注册一次事件监听---------");
    })

    event.emit("once");//只走一次
    event.emit("once");//不输出
//移除事件监听
    function removeFunb(){
        console.log("移除事件监听---");
    }

    event.on("remove",removeFunb);
    event.emit("remove");
    event.removeListener("remove",removeFunb);
    event.emit("remove");

event.emit("error");





