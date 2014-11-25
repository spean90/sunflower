var db = require('./db');
function Person(person) {
    this.username = person.username;
    this.password = person.password;
    this.tel = person.tel;
    this.address = person.address;
    this.email = person.email;
    this.child_name = person.child_name;
    this.child_age = person.child_age;
    this.child_class = person.child_class;
    this.child_sex = person.child_sex;
}

module.exports = Person;

Person.prototype.save = function save(callback){
    var user = {
        username : this.username,
        password : this.password,
        tel : this.tel,
        address : this.address,
        email : this.email,
        childs : [{
            name : this.child_name,
            age : this.child_age,
            class : this.child_class,
            sex : this.child_sex
        }]
    }

    db().collection("person").insert(user,{upsert:false, w: 1}, function (err,result) {
        console.log("err:"+err);
        console.log("result:"+result);
        callback(err,result);
    })
}

Person.get = function get(username,callback){
    db().collection('person').findOne({'username':username},
        function(err,doc){
            callback(err,doc);
        });
}

Person.update = function update(username,tel,address,password,callback) {
    new db().collection('person').update({'username' : username},{$set : {'tel':tel,'address':address}},
        function(err,doc){
            callback(err,doc);
    })
}

Person.updatePassword = function (username,password,callback) {
    new db().collection('person').update({'username' : username},{$set : {'password':password}},
        function(err,doc){
            callback(err,doc);
        })
}

Person.addChild = function(username,child,callback) {
    new db().collection('person').update({'username' : username},{$push : {'childs':child}},
        function(err,doc){
            callback(err,doc);
        })
}

Person.deleteChild = function(username,child_name,callback) {
    new db().collection('person').update({'username' : username},{$pull : {'childs':{'name':child_name}}},
        function(err,doc){
            callback(err,doc);
        })
}

Person.setProduct = function(username,child_name,productName,callback) {
    new db().collection('person').update({'username' : username,'childs.name':child_name},{$set : {'childs.$.product':productName}},
        function(err,doc){
            callback(err,doc);
        })
}

Person.findChildsByProduct = function(productName,callback) {
    var cursor = new db().collection('person').find({'childs.product' : productName},function(err,result){
        if(err){
            return callback(err,result);
        }
        result.toArray(function(err,docs){
            if(err){
                return callback(err,docs);
            }
            var childs = [];
            if(docs.length!=0){
                docs.forEach(function(doc){
                    doc.childs.forEach(function(child){
                        if(child.product == productName){
                            child.father = doc.username;
                            child.father_email = doc.email;
                            childs.push(child);
                        }
                    })
                })
            }
            callback(err,childs);
        })
    });
};


