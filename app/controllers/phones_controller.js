var mongoose = require('mongoose')
  , Phone = mongoose.model('Phone')
  , extend = require('util')._extend

exports.index = function (req, res) {  
    console.log(req.url)  
    res.render('phones/index', {
          
    }) 
}

exports.new = function (req, res) {  
    res.render('phones/new', {
          
    }) 
}

exports.create = function (req, res) {  
     
}