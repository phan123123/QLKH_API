let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  userName: String,
  passWord: String,
  isAdmin: Boolean
})

module.exports = mongoose.model('User', userSchema)
