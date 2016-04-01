/**
 * Created by Administrator on 2015/7/22 0022.
 */

var http = require("http");


http.createServer(function(request,response){
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.end("Hello World nodejs d \n");

}).listen(8888);