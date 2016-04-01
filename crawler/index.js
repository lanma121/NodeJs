/**
 * Created by liuzhentao on 2016/3/17 0017.
 */

/***
 * xmlhttprequest
 * 是一个内置的http包装器用来模拟浏览器XMLHttpRequest对象
 * 可以跨域访问，达到代码重用和使用现有库
 *
 */


(function(){
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var fs = require("fs");
    var goods_id = 2049538;   // 商品id || 期号
    var urlPage = "http://www.yungou.cn/api.do?goods_id="+goods_id+"&num=99&page=1&action=getRecords";   //参与者信息
    var urlCode = "http://www.yungou.cn/api.do?id=##&action=getRecordsCodes";                           //参与者幸运号
    var kmdirs = "苹果手机无线U盘/"+goods_id+"/";//保存文件目录，商品名 + 期号
    var nums = 218;    //总需人次
    function createMkidrs() {
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


    function writeFile( content, file, flags ) {
        createMkidrs(kmdirs);
        fs.open(kmdirs+file, flags, 0644, function(e,fd){
            if(e) throw e;
            fs.write(fd, content, 0, 'utf8', function(e){
                if(e) throw e;
                fs.closeSync(fd);
            });

        });
    }


    function req(url,callback) {
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




    var setInval = null;
    var fileName = "pages.json";
    var isover = 0;
    var total = 0;
    var flags = "a+";

    function pagesHander(result) {
        writeFile( result, fileName, "w+" );
        var data = JSON.parse(result).data;
        var dtal = parseInt(data.total);
        var rati = dtal - total;
        isover = rati;
        if(total && rati > 99){
            clearInterval(setInval);
            setInval = null;
            flags = "w+";
            req(urlPage.replace("&num=99","&num=20000"),pagesHander);
            return;
        }
        if(rati <= 0){
            return;
        }
        total = dtal;
        var lists = data.lists;
        for(var i in lists){
            if( i >= rati ){
                return;
            }
            var list = lists[i];
            req(urlCode.replace("id=##","id="+list.id),getCodesByUid);
        };

        if(!setInval) {
            fileName = "tmp.json";
            setInval = setInterval(function(){
                //console.log("=================================="+isover);
                if( isover === 0 ){
                    req(urlPage,pagesHander);
                }
            },5000);
        }
    }
    var codess = 0;
    function getCodesByUid(result) {
        var result = JSON.parse(result).data.codes;
        writeFile( ","+result, "codes.txt", "a+" );
        isover--;
        //console.log(isover);
        if(isover === 0){
            codess = 0;
            predicteResult();
        }
    }


    function getCodes (code){
        console.log("3s after : "+code);
        fs.readFile(kmdirs+"codes.txt",{encoding:"utf8"},function(err,data){
            if (err) throw err;

            if(!new RegExp(code).test(data)){
                codess++;
            };
            console.log(codess);
        })
    }

    function shapetime(vhrs, vmin, vsec, vmil) {
        if(vsec > 59){
            vmin += 1;
            vsec = vsec % 60;
        }
        if(vmin > 59){
            vhrs += 1;
            vmin = vmin % 60;
        }
        if(vhrs > 23){
            vhrs = 0;
        }
        if (vsec <= 9) vsec = "0" + vsec;
        if (vmin <= 9) vmin = "0" + vmin;
        if (vhrs <= 9) vhrs = "0" + vhrs;
        vmil = vmil <= 10 ? "00" + vmil : vmil <= 100 ? "0" + vmil : vmil;
        console.log("购买时间：   "+vhrs + ":" + vmin + ":" + vsec + ":" + vmil);
        return parseInt(vhrs + "" + vmin + "" + vsec + "" + vmil);
    }

    function predicteResult() {
        fs.readFile(kmdirs+"tmp.json",{encoding:"utf8"},function(err,data){
            if (err) throw err;
            var json = JSON.parse(data).data.lists;
            var sum = 0;
            for(var i in json){
                sum += parseInt(json[0].time.replace(/[:|\.]/g,""));
            };
            var finalTime = new Date();
            sum += shapetime(finalTime.getHours(), finalTime.getMinutes(), (finalTime.getSeconds() + 3),finalTime.getMilliseconds());
            var code = sum % nums + 10000001;
            getCodes (code);

        })

    }

    req(urlPage.replace("&num=99","&num=20000"),pagesHander);

}())


