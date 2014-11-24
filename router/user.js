/**
 * Created by Administrator on 2014/11/14.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Person = require('../models/person');
module.exports = router;

router.get('/detail/:username',function(req,res){
    Person.get(req.params.username,function(err,user){
        if(err){
            req.flash('error',err)
            return req.redirect('/');
        }
        if(user){
            req.session.user = user;
        }
        res.redirect('/user/detail');
    })
})
router.get('/detail',function(req,res){
    res.render('userDetail',{
        title : '信息中心',
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    })
})

router.post('/updateInfo',function(req,res) {
    console.dir(req.body);
    Person.update(req.session.user.username,req.body.tel,req.body.address,function(err,result) {
        if(err){
            req.flash("error",err)
            return req.redirect('/user/detail')
        }
        Person.get(req.session.user.username,function(err,user) {
            console.dir("get userinfo "+user);
            req.flash('success','修改成功！');
            req.session.user = user;
            return res.redirect('/user/detail');
        })

    })
})

router.post('/alterPassword',function(req,res) {
    console.dir(req.body);
    Person.get(req.session.user.username,function(err,user) {
        if(err){
            req.flash('error','操作数据库异常，稍后再试！');
            return res.redirect('/user/detail');
        }
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');//注意：hash 对象在 digest() 方法被调用后将不可用。
        var md = crypto.createHash('md5');
        var new_password = md.update(req.body.new_password).digest('base64');
        console.log(password+ "   " + password);
        if(password!=user.password){
            req.flash('error','密码错误！');
            return res.redirect('/user/detail');
        }else {
            Person.updatePassword(req.session.user.username,new_password, function(err,result){
                if(err) {
                    req.flash('error','操作数据库异常，稍后再试！');
                    return res.redirect('/user/detail');
                }
                req.flash('success','修改密码成，请重新登录！');
                return res.redirect('/signout');
            })
        }
    })
})

router.post('/addChild',function(req,res) {
    var child = {
        'name' : req.body.child_name,
        'age'  : req.body.child_age,
        'class': req.body.child_class,
        'sex'  : req.body.child_sex
    }
    Person.addChild(req.session.user.username,child,function(err,result) {
        if(err){
            req.flash('error','操作数据库异常，稍后再试！');
            return res.redirect('/user/detail');
        }
        Person.get(req.session.user.username,function(err,user) {
            console.dir("get userinfo "+user);
            req.session.user = user;
            return res.redirect('/user/detail');
        })
    })
})

router.get('/child_delete/:child_name',function(req,res) {
    console.dir(req.params.child_name);
    Person.deleteChild(req.session.user.username,req.params.child_name,function(err,result) {
        if(err){
            req.flash('error','操作数据库异常，稍后再试！');
            return res.redirect('/user/detail');
        }
        Person.get(req.session.user.username,function(err,user) {
            console.dir("get userinfo "+user);
            req.session.user = user;
            return res.redirect('/user/detail');
        })
    })
})

router.get('/joinProduct/:child_name/:productName',function(req,res) {
    Person.joinProduct(req.session.user.username,req.params.child_name,req.params.productName,function(err,result) {
        if(err){
            req.flash('error','操作数据库异常，稍后再试！');
           // return res.redirect('/product/productDetail/'+req.params.productName);
        }
        return res.redirect('/product/productDetail/'+req.params.productName);
    })
})
