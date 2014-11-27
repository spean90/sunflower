/**
 * Created by Administrator on 2014/11/14.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Person = require('../models/person');
module.exports = router;

router.get('/',function(req,res){
    res.render('index',{
        title : '向日葵托管',//'做积极向上的向日葵！'
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    })
})


router.post('/login',function(req,res){
    Person.get(req.body.username,function(err,user){
        if(!user){
            err = "用户不存在!";
        }else{
            var md5 = crypto.createHash('md5');
            var password = md5.update(req.body.password).digest('base64');
            console.log(password+ "   " + user.password);
            if(password != user.password){
                err = "密码错误，请重新登录！";
            }
        }
        if(err){
            req.flash('success',err);
            res.redirect('/')
            return;
        }
        req.flash('success','登录成功！');
        req.session.user = user;
        res.redirect('/')
    })

})

router.get('/signup',function(req,res) {
    res.render('signup',{
        title : 'Welcome to join us !',
        error : req.flash('error').toString()
    })
})

router.post('/signup',function(req,res) {
    console.dir(req.body);
    if(req.body.password!=req.body.re_password){
        req.flash('error', "密码输入不一致！");
        return res.redirect('/signup');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var person = new Person({
        username : req.body.username,
        password : password,
        tel :req.body.tel,
        address : req.body.address,
        email : req.body.email,
        child_name : req.body.child_name,
        child_age : req.body.child_age,
        child_class : req.body.child_class,
        child_sex : req.body.child_sex
    });
    Person.get(person.username,function(err,user){
        if (user)
            err = 'Username already exists.';
        if (err) {
            req.flash('error', err);
            return res.redirect('/signup');
        }
        person.save(function(err,result){
            if (err) {
                req.flash('error', err);
                return res.redirect('/signup');
            }
            req.flash('success','注册成功！');
            req.session.user = person;
            res.redirect('/')
        });
    })

})

router.get('/signout' ,function(req,res) {
    //req.flash('success','成功退出');
    req.session.user = null;
    res.redirect('/');
})

