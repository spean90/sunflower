/**
 * Created by Administrator on 2014/11/14.
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var logger = require('morgan');
var path = require('path');
var index = require('./router/index.js');
var user = require('./router/user.js');
var product = require('./router/product.js')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var expressLayouts = require('express-ejs-layouts');
var settings = require('./settings');
var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'bower_components')));
app.use(flash());
app.use(expressLayouts);
app.use(session({
    secret: settings.cookieSecret,
    name: 'sunflower_name',
    cookie: {maxAge: 1000 * 60 * 30},//30 minuter
    store: new MongoStore({
        db : settings.db,
        host : settings.host,
        port : settings.port,
        username : settings.username,
        password : settings.password,
        auto_reconnect : true
    }), // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use('/',index);
//app.use(function(req,res,next) {
//    console.log("进程id"+process.pid);
//    if(!req.session.user){
//        req.flash('error','请先登录！');
//        return res.redirect('/')
//    }
//    next();
//})
app.use('/product',product);
app.use('/user',user);
app.use(function(req,res,next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
app.listen(3000,function(){  //百度云需要监听18080
    console.log('Express server listening on port ' + 3000)
});