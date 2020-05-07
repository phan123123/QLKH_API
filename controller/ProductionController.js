var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var User = require('../models/User');
var Production = require('../models/Production');
var ObjectID = require('mongoose').Types.ObjectId;

//control the request
router.all('/', function(req, res) {
    //get the action and call
    let action = req.body.action.trim()
    if (action in global && typeof global[action] === "function") {
        global[action](req.body, res).catch(error => res.status(400).json({
            error: "Data error!!"
        }));
    }
    // function ís not exist
    else {
        res.status(400).json({
            error: "Don't have this feature!!"
        })
    }
});

//add new production
global.createProduction = async (data, res) => {
    // check is admin?
    var admin = await User.findById(new ObjectID(data.tokenLogin))
    if (admin) {
        if (admin.isAdmin) {
            await Production.create({
                productionName: data.productionName,
                detail: data.detail,
                price: data.price,
                number: data.number
            })
            res.status(200).json({
                suggest: "Created this production!!"
            })
        } else {
            res.status(403).json({
                error: "You are not admin!!"
            })
        }
    } else {
        res.status(400).json({
            error: "tokenLogin wrong!!"
        })
    }
}

//edit a production
global.editProduction = async (data, res) => {
    // check is admin?
    var admin = await User.findById(new ObjectID(data.tokenLogin))
    if (admin) {
        if (admin.isAdmin) {
            var obj = await Production.findByIdAndUpdate(new ObjectID(data.production), {
                productionName: data.productionName,
                detail: data.detail,
                price: data.price,
                number: data.number
            })
            if (obj) {
                res.status(200).json({
                    suggest: "Edited this production!!"
                })
            } else {
                res.status(403).json({
                    error: "Cant't edit!!"
                })
            }
        } else {
            res.status(403).json({
                error: "You are not admin!!"
            })
        }
    } else {
        res.status(400).json({
            error: "tokenLogin wrong!!"
        })
    }
}

//delete a production
global.deleteProduction = async (data, res) => {
    // check is admin?
    var admin = await User.findById(new ObjectID(data.tokenLogin))
    if (admin) {
        if (admin.isAdmin) {
            var obj = await Production.findByIdAndDelete(new ObjectID(data.production))
            if (obj) {
                res.status(200).json({
                    suggest: "Deleted this production!!"
                })
            } else {
                res.status(403).json({
                    error: "Cant't delete!!"
                })
            }
        } else {
            res.status(403).json({
                error: "You are not admin!!"
            })
        }
    } else {
        res.status(400).json({
            error: "tokenLogin wrong!!"
        })
    }
}

//find production
global.findAProduction = async (data, res) => {
    var user = await User.findById(new ObjectID(data.tokenLogin))
    if (user) {
        var obj = await Production.findById(new ObjectID(data.production))
        if (obj) {
            res.status(200).json({
                data: obj
            })
        } else {
            res.status(403).json({
                error: "Not found!!"
            })
        }
    } else {
        res.status(400).json({
            error: "tokenLogin wrong!!"
        })
    }
}

//show all production
global.findAllProduction = async (data, res) => {
    var user = await User.findById(new ObjectID(data.tokenLogin))
    if (user) {
        var objs = await Production.find({})
        res.status(200).json({
            data: objs
        })
    } else {
        res.status(400).json({
            error: "tokenLogin wrong!!"
        })
    }
}

module.exports = router;
