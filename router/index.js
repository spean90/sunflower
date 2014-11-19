/**
 * Created by Administrator on 2014/11/14.
 */
var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/',function(req,res){
    res.render('index',{
        title : 'It is never too late to be what you might have been.',//'做积极向上的向日葵！'
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    })
})

