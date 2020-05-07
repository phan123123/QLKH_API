var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var User = require('../models/User');
var Producer = require('../models/Producer');
var ObjectID = require('mongoose').Types.ObjectId;

//control the request
router.all('/', function(req, res) {
    //get the action and call
    let action = req.body.action.trim()
    if (action in global && typeof global[action] === "function") {
        global[action](req.body, res).catch(error => {
            res.status(400).json({error: "Data error!!"})
            console.error(error);
    });
    }
    // function ís not exist
    else {
        res.status(400).json({
            error: "Don't have this feature!!"
        })
    }
});

//add new producer
global.createProducer = async (data, res) => {
    // check is admin?
    var admin = await User.findById(new ObjectID(data.tokenLogin))
    if (admin) {
        if (admin.isAdmin) {
            let productions = []
            // console.log(data.production)
            for (let i in data.production){
                productions.push(new ObjectID(data.production[i]))
                // console.log(data.production[i]);
            }
            await Producer.create({
                producerName: data.producerName,
                detail: data.detail,
                production: productions
            })
            res.status(200).json({
                suggest: "Created this producer!!"
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

//delete a producer
global.deleteProducer = async (data, res) => {
    // check is admin?
    var admin = await User.findById(new ObjectID(data.tokenLogin))
    if (admin) {
        if (admin.isAdmin) {
            var obj = await Producer.findByIdAndDelete(new ObjectID(data.producer))
            if (obj) {
                res.status(200).json({
                    suggest: "Deleted this producer!!"
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
global.findAProducer = async (data, res) => {
    var user = await User.findById(new ObjectID(data.tokenLogin))
    if (user) {
        var obj = await Producer.findById(new ObjectID(data.producer))
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

//show all producer
global.findAllProducer = async (data, res) => {
    var user = await User.findById(new ObjectID(data.tokenLogin))
    if (user) {
        var objs = await Producer.find({})
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
