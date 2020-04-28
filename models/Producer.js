let mongoose = require('mongoose')

let producerSchema = new mongoose.Schema({
    producerName: String,
    detail: String,
    production: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Production' }]
},{versionKey: false })

module.exports = mongoose.model('Producer', producerSchema)
