
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , validate = require('mongoose-validator').validate
  , uniqueValidator = require('mongoose-unique-validator')
  , validator = require('validator')
  , moment    = require('moment')

defaultPostBackURL = function(length){
  var chars  = '0123456789abcdefghiklmnopqrstuvwxyz',
      string = '';
  for (var i = 0; i < length; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      string += chars.substring(randomNumber, randomNumber + 1);      
    }
  return "http://tracker.redpointrack.com/"+string
}

require('mongoose-validator').extend('isPhoneNumber', function () {    
    str = this.str.replace(/[()-]/g, "")
    return validator.isNumeric(str) && str.length == 10
}, 'invalid phone')

var SiteSchema = new Schema({
   website_url:     { type: String, required: "can't be blank", unique: true, validate: validate('isUrl') }
  ,third_party_url: { type: String, required: "can't be blank", validate: validate('isUrl') }
  ,post_back_url:   { type: String, required: "can't be blank", unique: true, validate: validate('isUrl'), default : defaultPostBackURL(10) } 
  ,third_party_url_enabled: { type: Boolean }
  ,default_phone:   { type: String, required: "can't be blank", validate: validate('isPhoneNumber') }
  ,current_ph:      { type: String, validate: validate('isPhoneNumber') }
  ,default_number_destination: { type: String, required: "can't be blank", validate: validate('isPhoneNumber') }
  ,call_tracking_api_key: { type: String, required: "can't be blank" }
  ,phones_distribution_method: { type: String, required: "can't be blank" }
  ,total_phone_calls: { type: Number, default : 0 }
  ,total_visitors:    { type: Number, default : 0 }
  ,total_visites:     { type: Number, default : 0 }
  ,active:            { type: Boolean, default : true }
  ,owner:             {type : Schema.ObjectId, ref : 'User'}  
  ,createdAt:         { type : Date, default : Date.now }
})


SiteSchema.virtual('formatedDate').get(function () {
  return moment(this.createdAt).format("MMM Do, YYYY")
});

SiteSchema.virtual('status').get(function () {
  return this.active ? "active" : "inactive"
})

SiteSchema.statics.getUserSites = function (id, cb) {
  this.find({ owner: id }, cb)
}

SiteSchema.plugin(uniqueValidator, { message: '{PATH} already in use.' })
mongoose.model('Site', SiteSchema)