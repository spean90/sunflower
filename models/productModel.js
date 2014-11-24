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

Product.getAll = function(callback) {
    var cursor = new db().collection('product').find({});
    cursor.toArray(function(err,products) {
        callback(err,products);
    })
}

Product.delete = function(productName,callback) {
    new db().collection('product').remove({'productName':productName},function(err,result) {
        callback(err,result);
    });
}

