var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var User = require('../models/Export');
var ObjectID = require('mongoose').Types.ObjectId;

//control the request
router.all('/export', function(req, res) {
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

//add new export event
global.addNewExport = (data, res) => {
    // check tokenLogin
    User.findOne({
        _id: new ObjectID(data.tokenLogin)
    }, (err, user) => {
        if(err){
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

module.exports = router;
