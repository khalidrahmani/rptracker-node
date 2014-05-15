var mongoose = require('mongoose')
  , Site = mongoose.model('Site')
  , Phone = mongoose.model('Phone')
  , extend = require('util')._extend

exports.index = function (req, res) {  

    res.render('phones/index', {
    
    }) 
}

exports.new = function (req, res) {  
    Site.find({owner: req.user._id}, function (err, sites) {
    res.render('phones/new', {
      sites: sites          
    })
  }) 
}

exports.create = function (req, res) {  
     
}