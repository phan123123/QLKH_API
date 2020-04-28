let mongoose = require('mongoose')

let productionSchema = new mongoose.Schema({
    productionName: String,
    detail: String,
    price: Number
},{versionKey: false })

module.exports = mongoose.model('Production', productionSchema)
