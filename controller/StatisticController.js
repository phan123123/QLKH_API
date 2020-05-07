var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var User = require('../models/User');
var Import = require('../models/Import');
var Export = require('../models/Export');
var Production = require('../models/Production');
var ObjectID = require('mongoose').Types.ObjectId;

//control the request
router.all('/', function(req, res) {
    //get the action and call
    let action = req.body.action.trim()
    if (action in global && typeof global[action] === "function") {
        global[action](req.body, res).catch(error => {
            res.status(400).json({
                error: "Data error!!"
            })
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

//get a statistic of a production in a time
global.getStatisticProduct = async (data, res) => {
    var user = await User.findById(new ObjectID(data.tokenLogin))
    if (user) {
        if (user.isAdmin){
            let production = await Production.findById(new ObjectID(data.production), 'productionName detail')
            if (production){
                let result = {
                    _id: data.production,
                    productionName : production.productionName,
                    detail : production.detail
                }
                let from = new Date(data.from.toString().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                let to = new Date(data.to.toString().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                // from.setDate(from.getDate()+1)
                to.setDate(to.getDate()+1)
                let dataArray = await Import.find({
                    time: {
                        $gte: from,
                        $lt: to
                    }
                }, '_id time detail user')
                let importArray = []
                let sumImport = 0
                let totalImport = 0
                for (let i in dataArray){
                    let dat = dataArray[i].detail
                    for (let j in dat){
                        if (dat[j].production == data.production){
                            importArray.push({
                                _id: dataArray[i]._id,
                                time: dataArray[i].time,
                                number: dat[j].number,
                                price: dat[j].price
                            })
                            sumImport += dat[j].number
                            totalImport += (dat[j].number*dat[j].price)
                            break
                        }
                    }
                }
                result.imports = importArray
                result.sumImport = sumImport
                result.totalImport = totalImport

                let dataEArray = await Export.find({
                    time: {
                        $gte: from,
                        $lt: to
                    }
                }, '_id time detail user')
                let exportArray = []
                let sumExport = 0
                let totalExport =0
                for (let i in dataEArray){
                    let dat = dataEArray[i].detail
                    for (let j in dat){
                        if (dat[j].production == data.production){
                            exportArray.push({
                                _id: dataEArray[i]._id,
                                number: dat[j].number,
                                price: dat[j].price
                            })
                            sumExport += dat[j].number
                            totalExport += (dat[j].number*dat[j].price)
                            break
                        }
                    }
                }
                result.exports = exportArray
                result.totalExport = totalExport
                result.sumExport = sumExport
                // console.log(result);
                res.status(200).json(result)
            }else{
                res.status(403).json({error: `Production ${data.production} is not exist!!`})
            }
        }
        else{
            res.status(403).json({error: "You are not admin!!"})
        }
    } else {
        res.status(403).json({
            error: "tokenLogin wrong!!"
        })
    }
}

module.exports = router;
