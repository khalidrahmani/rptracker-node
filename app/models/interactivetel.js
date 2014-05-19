
var mongoose = require('mongoose')
  , Schema = mongoose.Schema  
  , validate = require('mongoose-validator').validate


require('mongoose-validator').extend('isPhoneNumber', function () {    
    str = this.str.replace(/[()-]/g, "")
    return validator.isNumeric(str) && str.length == 10
}, 'invalid phone')

var InteractiveTelSchema = new Schema({
   site:                    {type: String, required: "please select website"}  
  ,quantity:                {type: Number, required: "please select quantity" } 
  ,destination_number:      {type: String, required: "can't be blank", validate: validate('isPhoneNumber') }
  ,activate_immediately:    {type: Boolean, default : false }
})

mongoose.model('InteractiveTel', InteractiveTelSchema)