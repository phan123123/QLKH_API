let mongoose = require('mongoose')


var detailSchema = mongoose.Schema({
    production: {type : mongoose.Schema.Types.ObjectId, ref: 'Production'},
    number: Number,
    price: Number
},{ _id : false },{versionKey: false })

let importSchema = new mongoose.Schema({
    time: Date,
    detail: [detailSchema],
    user: {type : mongoose.Schema.Types.ObjectId, ref: 'User'}
},{versionKey: false })

module.exports = mongoose.model('Import', importSchema)
