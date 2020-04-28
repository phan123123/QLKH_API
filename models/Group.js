let mongoose = require('mongoose')

let groupSchema = new mongoose.Schema({
    groupName: String,
    detail: String,
    production: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Production' }]
},{versionKey: false })

module.exports = mongoose.model('Group', groupSchema)
