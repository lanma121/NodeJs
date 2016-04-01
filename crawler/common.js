/**
 * Created by liuzhentao on 2016/3/30 0030.
 */

var fs = require("fs");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.writeFile = function( content, file, flags ) {
    createMkidrs(kmdirs);
    fs.open(kmdirs+file, flags, 0644, function(e,fd){
        if(e) throw e;
        fs.write(fd, content, 0, 'utf8', function(e){
            if(e) throw e;
            fs.closeSync(fd);
        });

    });
}

exports.createMkidrs = function (kmdirs) {
    if(fs.existsSync(kmdirs)){
        return true;
    }
    var mkdirArr = kmdirs.split("/");
    var mkdr = "";
    for (var i= 0,l = mkdirArr.length;i < l; i++){
        var mkd = mkdirArr[i];
        mkdr += i === 0 ? mkd : ("/" + mkd);
        if(!fs.existsSync(mkdr)){
            fs.mkdirSync(mkdr, 0777, function (err) {
                if (err) {
                    return console.error(err);
                }
                //console.log(mkdr+"目录创建成功。");
            });
        };
    }

}

exports.req = function (url,callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        //console.log("State: " + this.readyState);
        if (this.readyState === 4) {
            callback( this.responseText );
        }
    };
    xhr.open("GET", url);
    xhr.send();
}

