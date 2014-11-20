var db = require('./db');
function Person(person) {
    this.username = person.username;
    this.password = person.password;
    this.tel = person.tel;
    this.address = person.address;
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
