var express = require('express');
var router = express.Router();
var Product = require('../models/productModel');
var Person = require('../models/person');
var async = require('async');
var nodemailer = require('nodemailer');
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.163.com",
    auth: {
        user: "huangsiping1990@163.com", // 账号
        pass: "****" // 密码
    }
});
//var transporter = nodemailer.createTransport({
//    service: 'Gmail',
//    auth: {
//        user: 'spean90@gmail.com',
//        pass: 'cqmyg12345'
//    }
//});


module.exports = router;

router.get('/cb/:company',function(req,res) {
    res.render('callbackpage',{
        company : req.params.company,
        success : req.flash('success').toString()
    });
    console.log(req.params.company+'点击了回执');
    smtpTransport.sendMail({
        from: 'huangsiping1990@163.com',
        to: '569510125@qq.com',
        subject: req.params.company+'hr浏览了简历',
        text: 'hr点击进入了回执页面'
    },function(error, info){
    });
});
router.post('/callback',function(req,res) {
    console.log('...点击了提交按钮');
    var param = req.body;
    console.log('company:'+param.company);
    console.log('result:'+param.result);
    console.log('msg:'+param.msg);
    smtpTransport.sendMail({
        from: 'huangsiping1990@163.com',
        to: '569510125@qq.com',
        subject: param.company+'hr回执',
        text: '回执:'+param.result+"     msg: "+param.msg
    },function(error, info){
        if(error){
            req.flash('success',"邮件发送失败！不过还是感谢您的反馈，谢谢！");
            console.log(error);
        }else{
            req.flash('success',"感谢您的回执，已经收到邮件，谢谢您!");
            console.log(info);
        }

        res.render('callbackpage',{
            company : param.company,
            success : req.flash('success').toString()
        });
    });


});


router.get('/productDetail/:productName',function(req,res) {

    /**
     * 使用async.parallel;优化代码；
     */
    async.parallel([function(callback) {
        Person.get(req.session.user.username,callback);
    },function(callback) {
        Product.get(req.params.productName,callback);
    },function(callback) {
        Person.findChildsByProduct(req.params.productName,callback);
    }],function (err, results) {
//        console.log('1.1 err: ', err);
//        console.log('1.1 results: ', results);
        if(!results[1]){
            err = "该套餐已失效，请直接与我们联系！";
        }
        if(err){
            req.flash('error',err)
            return res.redirect('/');
        }
        res.render('productDetail',{
            'title' : '套餐详情',
            'user' : results[0],
            'product' : results[1],
            'childs' :results[2],
            'error' : req.flash('error').toString(),
            'success' : req.flash('success').toString()
        })
    })

    /**
     * 一般方法***  使用上面的async.parallel代替；
     */
//    Product.get(req.params.productName,function(err,product) {
//        if(!product){
//            err = '该套餐已失效，请直接与我们联系！';
//        }
//        if(err){
//            req.flash('error',err)
//            return res.redirect('/');
//        }
//        Person.get(req.session.user.username,function(err,user){
//            if(err){
//                req.flash('error',err)
//                return res.redirect('/');
//            }
//            Person.findByProduct(req.params.productName,function(err,childs){
//                res.render('productDetail',{
//                    'title' : '套餐详情',
//                    'user' : user,
//                    'product' : product,
//                    'childs' :childs,
//                    'error' : req.flash('error').toString(),
//                    'success' : req.flash('success').toString()
//                })
//            });
//        })
//
//    })
})

router.get('/productList',function(req,res) {
    Product.getAll(function(err,products) {
        if(err){
            req.flash('error',err)
            return res.redirect('/');
        }
        res.render('productList',{
            'title' : '套餐列表',
            'user' : req.session.user,
            'products' : products,
            'error' : req.flash('error').toString(),
            'success' : req.flash('success').toString()
        })
    })
})

router.post('/addProduct',function(req,res) {
    var param = req.body;
    var product = new Product({
        productName : param.productName,
        productTitle : param.productTitle,
        productFee : param.productFee,
        productContent : param.productContent
    });
    Product.get(param.productName,function(err,doc) {
        if(doc){
            err = "该套餐名已存在！";
        }
        if(err){
            req.flash('error',err);
            return res.redirect('/product/productList');
        }
        product.save(function(err,result) {
            if(err){
                req.flash('error',err);
                return res.redirect('/product/productList');
            }
            req.flash('success','添加成功！');
            return res.redirect('/product/productList');
        });
    })
})

router.get('/delete/:productName',function(req,res){
    Product.delete(req.params.productName,function(err,result) {
        if(err){
            req.flash('error',err);
            return res.redirect('/product/productList');
        }
        //req.flash('success','删除成功！');
        return res.redirect('/product/productList');
    })
})

router.get('/noticeUser/:email/:productName',function(req,res) {
    console.log('email:'+req.params.email);
    transporter.sendMail({
        from: 'spean90@gmail.com',
        to: req.params.email,
        subject: '来自向日葵的问候',
        text: '您好，该进贡了！谢谢'
    },function(error, info){
        if(error){
            req.flash('error',"邮件发送失败！");
            console.log(error);
        }else{
            req.flash('success',"邮件发送成功！");
            console.log('Message sent: ' + info.response);
        }

        return res.redirect('/product/productDetail/'+req.params.productName);
    });

})