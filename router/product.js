var express = require('express');
var router = express.Router();
var Product = require('../models/productModel');

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
        res.render('productDetail',{
            'user' : req.session.user,
            'product' : product,
            'error' : req.flash('error').toString(),
            'success' : req.flash('success').toString()
        })
    })
})