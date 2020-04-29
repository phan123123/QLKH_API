var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var User = require('../models/User');
var ObjectID = require('mongoose').Types.ObjectId;
const sha1 = require('sha1');

//generate ramdom token
var tokenRegister = '';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let charactersLength = characters.length;
for (var i = 0; i < 16; i++) {
    tokenRegister += characters.charAt(Math.floor(Math.random() * charactersLength));
}

//control the request
router.all('/', function(req, res) {
    //get the action and call
    let action = req.body.action.trim()
    if (action in global && typeof global[action] === "function") {
        global[action](req.body, res);
    }
    // function ís not exist
    else {
        res.status(400).json({
            error: "Don't have this feature!!"
        })
    }
});

//get token for register new user
global.getRegisterToken = (adminData, res) => {
    // check is admin?
    User.findOne({
        userName: adminData.userName,
        passWord: sha1(adminData.passWord)
    }, (err, user) => {
        if(err){
            res.status(400).json({
                error: "Data wrong!!"
            })
            console.error("Error when read object from db!!");
        }
        else{
            if (user) {
                //return tokenRegister if user is admin
                if(user.isAdmin){
                    res.status(200).json({
                        tokenRegister: tokenRegister
                    })
                }
                else {
                    res.status(403).json({
                        error: "You aren't admin!!"
                    })
                }
            } else {
                res.status(403).json({
                    error: "User not exist!!"
                })
            }
        }
    });
}

//register
global.register = (userData, res) => {
    //check the tokenRegister
    if (userData.tokenRegister == tokenRegister) {
        User.findOne({
            userName: userData.userName
        }, (err, data) => {
            if (!data) {
                //save the new user
                User.create({
                    userName: userData.userName,
                    passWord: sha1(userData.passWord),
                    isAdmin: false
                }, (err, user) => {
                    //return tokenLogin
                    res.status(200).json({
                        tokenLogin: user._id.toString()
                    })
                });
            } else {
                res.status(403).json({
                    error: "User exist!!"
                })
            }
        });
    } else {
        res.status(403).json({
            error: "tokenRegister wrong!!"
        })
    }
}

//login
global.login = (userData, res) => {
    //check user
    User.findOne({
        userName: userData.userName,
        passWord: sha1(userData.passWord)
    }, (err, user) => {
        if (user) {
            //return tokenLogin
            res.status(200).json({
                tokenLogin: user._id.toString(),
                isAdmin: user._id.isAdmin
            })
        } else {
            res.status(403).json({
                error: "username or password wrong!!"
            })
        }
    });
}

//add a new admin from user
global.addAdmin = (userData, res) => {
    User.findById(new ObjectID(userData.tokenLogin), (err, admin) => {
        if (admin) {
            if(!admin.isAdmin){
                res.json({error: "You are not admin!!"})
            }
            else{
                User.findByIdAndUpdate(new ObjectID(userData.tokenAccount), {isAdmin : true}, (err, user) => {
                    if(err||!user){
                        res.status(403).json({error: "tokenLogin wrong!!"})
                    }
                    else{
                        res.status(200).json({suggest: "Add admin suggested!!"})
                    }
                });
            }
        } else {
            res.status(403).json({
                error: "username or password wrong!!"
            })
        }
    });
}

module.exports = router;
