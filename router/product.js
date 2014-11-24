var express = require('express');
var router = express.Router();
var Product = require('../models/productModel');
var Person = require('../models/person');
module.exports = router;

router.get('/productDetail/:productName',function(req,res) {
    Product.get(req.params.productName,function(err,product) {
        if(!product){
            err = '该套餐已失效，请直接与我们联系！';
        }
        if(err){
            req.flash('error',err)
            return res.redirect('/');
        }
        Person.get(req.session.user.username,function(err,user){
            if(err){
                req.flash('error',err)
                return res.redirect('/');
            }
            Person.findByProduct(req.params.productName,function(err,childs){
                res.render('productDetail',{
                    'title' : '套餐详情',
                    'user' : user,
                    'product' : product,
                    'childs' :childs,
                    'error' : req.flash('error').toString(),
                    'success' : req.flash('success').toString()
                })
            });
        })

    })
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