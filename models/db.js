var settings =require('../settings');
/**
 * Created by Administrator on 2014/9/28.
 */
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var url = format('mongodb://%s:%s@%s:%s/%s?w=1&readPreference=primaryPreferred&auto_reconnect=true',settings.username,settings.password,settings.host,settings.port,settings.db);
var mdb;
MongoClient.connect(url,{
    db: {
        native_parser: false
        //pkFactory :CustomPKFactory
    },
    server: {
        socketOptions: {
            connectTimeoutMS: 500
        },poolSize : 20
    },
    replSet: {},
    mongos: {}
},function(err,database){
    if(err) {
        console.log(err);
        throw err;
    }
    mdb = database;
});
module.exports = function(){
    return  mdb;
}
