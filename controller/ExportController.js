var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var User = require('../models/User');
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


//add new Exportation
global.createExportation = async (data, res) => {
    var user = await User.findById(new ObjectID(data.tokenLogin))
    if (user) {
        var detail = []
        var flag = true
        var details = data.detail
        for (i in details) {
            let dat = details[i]
            let production = await Production.findById(new ObjectID(dat.production))
            if (production) {
                detail.push({
                    production: new ObjectID(dat.production),
                    number: dat.number,
                    price: production.price
                });
                if(production.numer < dat.number){
                    flag = false
                    res.status(403).json({
                        error: `Production ${dat.production} is not enough!!`
                    })
                    break
                }
            } else {
                flag = false
                res.status(403).json({
                    error: `Production ${dat.production} not exist!!`
                })
                break
            }
        }
        if (flag) {
            await Export.create({
                detail: detail,
                user: new ObjectID(data.tokenLogin)
            });
            for (let i in details) {
                let dat = data.detail[i]
                Production.findByIdAndUpdate(new ObjectID(dat.production), {
                    $dec: {
                        number: dat.number
                    }
                }, (err, obj) => {
                    if (err) {
                        console.error(err);
                    }
                })
            }
            res.status(200).json({
                suggest: "Created Exportation!!"
            })
        }
    } else {
        res.status(403).json({
            error: "tokenLogin wrong!!"
        })
    }
}

//get a statistic in a time
global.findExportation = async (data, res) => {
    var user = await User.findById(new ObjectID(data.tokenLogin))
    if (user) {
        let field ='_id time detail'
        if (user.isAdmin){
             field = '_id time detail user'
        }
        let from = new Date(data.from.toString().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        let to = new Date(data.to.toString().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        // from.setDate(from.getDate()+1)
        to.setDate(to.getDate()+1)
        let dataArray = await Export.find({
            time: {
                $gte: from,
                $lt: to
            }
        }, field)
        var total = 0
        for (let i in dataArray){
            let dat = dataArray[i].detail
            let tmp = 0
            for (let j in dat){
                tmp += (dat[j].price*dat[j].number)
            }
            total += tmp
            if (user.isAdmin){
                dataArray[i].user = await User.findById(new ObjectID(dataArray[i].user),'userName')
            }
            // console.log(dataArray[i])
        }
        // res.status(200).json(JSON.parse(JSON.stringify(dataArray)))
        res.status(200).json({data: dataArray, sum: total})
    } else {
        res.status(403).json({
            error: "tokenLogin wrong!!"
        })
    }
}

module.exports = router;
