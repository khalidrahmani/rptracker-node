var mongoose = require('mongoose')
  , Site = mongoose.model('Site')
  , extend = require('util')._extend

exports.index = function (req, res) {   
  Site.find({owner: req.user._id}, function (err, sites) {
    res.render('sites/index', {
       sites: sites      
    })
  })  
}

exports.new = function (req, res) {
  res.render('sites/new', {    
    site: new Site()
  })
}

exports.create = function (req, res) {
  var site = new Site(req.body)  
  site.owner = req.user
  site.save(function (err) {
    if (err) {     
      return res.render('sites/new', {
         error: {type: "error", errors: site.errors}
        ,params: req.body
        ,site: site
      })
    }    
    else return res.redirect('/')    
  })
}

exports.edit = function (req, res) {  
  Site.findOne({ _id : req.param('id') }).lean().exec(function (err, site) {  
    if (site) {      
      return res.render('sites/edit', {        
         site: site
        ,params: site
      })
    } else {
      req.session.messages = {type: 'error', message: 'Error! The site was not found !!'}  
      return res.redirect('/')     
    }    
  })
}

exports.update = function(req, res){

  Site.findOne({ _id : req.param('id') }).exec(function (err, site) {  
    if (site) {      
      site = extend(site, req.body)
      site.save(function (err) {
        if (err) {     
          return res.render('sites/edit', {
             error: {type: "error", errors: site.errors}
            ,params: req.body
            ,site: site
          })
        }    
        req.session.messages = {type: 'success', message: 'Site updated'}
        return res.redirect('/')    
      })    

    } else {
      req.session.messages = {type: 'error', message: 'Error! The site was not found !!'}  
      return res.redirect('/')     
    }    
  })

}

exports.destroy = function (req, res) {  
  Site.remove({ _id : req.param('id') }, function (err, site) {    
    if (site) {      
      req.session.messages = {type: 'success', message: 'Site deleted'}
    } else {
      req.session.messages = {type: 'error', message: 'Error! The site was not found !!'}
    }
    return res.redirect('/')    
  })
}

exports.activate = function(req, res){ 
  Site.findOne({ _id : req.query.id }).exec(function (err, site) {  
    Site.update({ _id : req.query.id }, { active: !site.active }, {}, function (err, numAffected) {
       if (err) {     
            res.send({status : "error"})
          }    
          else{  res.send({status : "updated", message: site.status}) }
        })
  })


}