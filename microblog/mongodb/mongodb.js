/**
 * Created by Administrator on 2015/8/4 0004.
 */

/**
 *参考：
 *  documentation	http://mongodb.github.io/node-mongodb-native/
    apidoc	        http://mongodb.github.io/node-mongodb-native/
    source	        https://github.com/mongodb/node-mongodb-native
    mongodb	        http://www.mongodb.org/
                    http://christiankvalheim.com/
 *
 */
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {

        collection.count(function(err, count) {
            console.log(format("count = %s", count));
        });

        // Locate all the entries using find
        collection.find().toArray(function(err, results) {
            console.dir(results);
            // Let's close the db
            db.close();
        });
    });
})