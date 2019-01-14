var mongoose = require('mongoose')
var Schema = mongoose.Schema

// User Schema.
var _Users = new Schema({
  id: Number,
  name: String,
  fullname: String,
  email: String,
  password: String,
  token: String,
  cpf: String,
  age: Number,
  address: String,
  updated: { type: Date, default: Date.now()},
  deleted: { type: Date, required: false }
})

/**
 * Find any user by regex inside name
 */
_Users.statics.findByName = function (name, cb){
  return this.find({name: new RegExp(name,'i')}, cb)
}

/**
 * Create many register from given payload
 */
_Users.statics.createMany = function(payload, cb){
  return this.insertMany(cb)
}

var Users = mongoose.model('Users', _Users)

module.exports = Users
