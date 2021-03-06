let mongoose = require('mongoose')

var detailSchema = mongoose.Schema({
    production: {type : mongoose.Schema.Types.ObjectId, ref: 'Production'},
    number: Number,
    price: Number
},{ _id : false },{versionKey: false })

let exportSchema = new mongoose.Schema({
    time: {type: Date, default: Date.now},
    detail: [detailSchema],
    user: {type : mongoose.Schema.Types.ObjectId, ref: 'User'}
},{versionKey: false })

module.exports = mongoose.model('Export', exportSchema)
