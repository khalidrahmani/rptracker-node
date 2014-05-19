
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PhoneSchema = new Schema({
    number:     			{type: String }
   ,destinationNumber:     	{type: String }
   ,site:             		{type: Schema.ObjectId, ref: 'Site'}
})


mongoose.model('Phone', PhoneSchema)