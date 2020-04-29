var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Export = require('../models/Export');
var User = require('../models/User');
var Production = require('../models/Production');
var ObjectID = require('mongoose').Types.ObjectId;

//control the request
router.all('/', function(req, res) {
    //get the action and call
    let action = req.body.action.trim()
    if (action in global && typeof global[action] === "function") {
        global[action](req.body, res);
    }
    // function is not exist
    else {
        res.status(400).json({
            error: "Don't have this feature!!"
        })
    }
});

//add new export event
global.addNewExportation = (data, res) => {
    // check tokenLogin
    User.findById(new ObjectID(data.tokenLogin), (err, user) => {
        if (err) {
            res.status(400).json({
                error: "Data wrong!!"
            })
            console.error("Error when read object from db!!");
        } else {
            if (user) {
                var dataArray = []
                var suggested = true
                for (let i in data.detail) {
                    Production.findById(new ObjectID(i.production), (err, production) => {
                        if (err || !production) {
                            res.status(403).json({
                                error: "Data wrong!!"
                            })
                            suggested = false
                            break
                        } else {
                            dataArray.pust({
                                production: production._id,
                                number: i.number,
                                price: production.price
                            });
                        }
                    })
                }
                if (suggested) {
                    Export.create({
                        detail: dataArray,
                        user: new ObjectID(data.tokenLogin)
                    }, (err, user) => {
                        if (err) {
                            res.status(403).json({
                                error: "Create error!!"
                            })
                        } else {
                            res.status(200).json({
                                suggest: "Create suggested!!"
                            })
                        }
                    })
                }
            } else {
                res.status(403).json({
                    error: "tokenLogin wrong!!"
                })
            }
        }
    });
}

//find exportation
global.findExportation = (data, res) => {
    User.findById(new ObjectID(data.tokenLogin), (err, user) => {
        if (err) {
            res.status(400).json({
                error: "Data wrong!!"
            })
        } else {
            if (user) {
                Export.find({
                    time: {
                        $gte: data.from,
                        $lte: data.to
                    }
                }, '_id time detail', (err, exportations) => {
                    if (err) {
                        res.status(400).json({
                            error: "Data wrong!!"
                        })
                    } else {
                        res.status(200).json({data: exportations.toJSON()})
                    }
                })
            } else {
                res.status(403).json({
                    error: "tokenLogin wrong!!"
                })
            }
        }
    });
}

global.statisticsExport = (data, res) => {

}
module.exports = router;
