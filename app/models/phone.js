
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PhoneSchema = new Schema({
   number:     { type: String }
})


mongoose.model('Phone', PhoneSchema)