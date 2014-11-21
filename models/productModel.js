var db = require('./db');

var Product = function(product) {
    this.productName = product.productName;
    this.productFee = product.productFee;
    this.productContent = product.productContent;
}

module.exports = Product;

Product.prototype.save = function save(callback) {
    var product = {
        productName : this.productName,
        productFee : this.productFee,
        productContent : this.productContent
    }
    new db().collection('product').insert(product,{upsert:false, w: 1},function(err,result){
        console.log("err:"+err);
        console.log("result:"+result);
        callback(err,result);
    })
}

Product.get = function(productName,callback) {
    new db().collection('product').findOne({'productName' : productName},function(err,product) {
        callback(err,product);
    })
}

