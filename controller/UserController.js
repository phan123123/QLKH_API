var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../models/User');

//generate ramdom token
var token           = '';
const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let charactersLength = characters.length;
for ( var i = 0; i < 16; i++ ) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
}

//control the request
router.all('/', function (req, res) {
    //get the action and call
    let action = req.body.action.trim()
    if (action in global && typeof global[fn] === "function") {
        global[action](req.body, res);
    }
    // function ís not exist
    else {
        res.status(400).json({error : "Don't have this feature!!"})
    }
});

//get token for register
global.getAcceptToken = (adminData, res) => {
    User.findOne({userName : adminData.userName, passWord : adminData.passWord}, (err,user)=>{
        if(user.isAdmin){
            res.status(200).json({token : token})
        }
        else{
            res.status(403).json({error: "You aren't admin!!"})
        }
    });
}

module.exports = router;
