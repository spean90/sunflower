/**
 * Created by Administrator on 2014/11/14.
 */
var express = require('express');
var router = express.Router();
var Person = require('../models/person');
module.exports = router;

router.post('/login',function(req,res){
    console.dir(req.body.user);
    req.flash('success','登录成功！');
    req.session.user = req.body;
    res.redirect('/')
})

router.get('/signup',function(req,res) {
    res.render('signup',{
        title : 'Welcome to join us !'
    })
})

router.post('/signup',function(req,res) {
    console.dir(req.body);
    var person = new Person(req.body);
    person.save(function(err,result){
       console.log('保存结束：'+err+"   "+result);
    });

    var user = {
        username : req.body.username,
        password : req.body.password
    }
    req.flash('success','注册成功！');
    req.session.user = user;
    res.redirect('/')
})

router.get('/signout' ,function(req,res) {
    req.flash('success','成功退出');
    req.session.user = null;
    res.redirect('/');
})