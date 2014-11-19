var db = require('./db')();

function Person(person) {
    this.username = person.username;
    this.password = person.password;
    this.tel = person.tel;
    this.child.name = person.child.name;
    this.child.age = person.child.age;
    this.child.class = person.child.class;
    this.child.sex = person.child.sex;
}

module.exports = Person;

Person.prototype.save = function save(callback){
    var user = {
        username : this.username,
        password : this.password,
        tel : this.tel,
        child : {
            name : this.child.name,
            age : this.child.age,
            class : this.child.class,
            sex : this.child.sex
        }
    }
    db.collection("person").insert(user,{upsert:false, w: 1}, function (err,result) {
        console.log("err:"+err);
        console.log("result:"+result);
        callback(err,result);
    })
}

Person.get = function get(username,callback){
    db.collection('person').findOne({'username':username},
        function(err,doc){
            callback(err,doc);
        });
}
