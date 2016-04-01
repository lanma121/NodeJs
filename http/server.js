/**
 * Created by Administrator on 2015/7/22 0022.
 */


var http = require("http");
var url = require('url');
function start(route){
    function onRequest(request,response){
        //console.log(request);
        var pathname = url.parse(request.url).pathname;
        //var pathname = url.parse(request.url).pathname;
        console.log("request pathname:　　"+pathname);
        route(pathname);
        response.writeHead(200,{"Content-Type":"text/plain"});
        response.write("ulr is"+pathname);
        response.end();
    }
    http.createServer(onRequest).listen(8885);
}

exports.start = start;