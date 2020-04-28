const db = require('./db');
const User = require('./models/user')
const Import = require('./models/import')
const Production = require('./models/production')
const Group = require('./models/group')
const sha1 = require('sha1');
/*
User.create({
    userName: "admin",
    passWord: sha1("admin"),
    isAdmin: true
}, (err, user) => {
    console.log(user.toJSON())
});
*/
Production.create({
    productionName: "test2",
    detail: "test2",
    price: 30
}, (err, user) => {
    if(err){
        console.error(err);
    }
    else {
        console.log(user.toJSON())
    }
});
