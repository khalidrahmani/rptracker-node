var mongoose        = require('mongoose')
  , Site            = mongoose.model('Site')
  , Phone           = mongoose.model('Phone')
  , InteractiveTel  = mongoose.model('InteractiveTel')    
  , soap            = require('soap')
  , _               = require('underscore')

exports.index = function (req, res) {  
  Site.find({owner: req.user._id}).select('_id').exec(function (err, sites) {   
    Phone.find({site: {$in : sites }}).populate('site').exec(function (err, phones) {
      res.render('phones/index', {
        phones: phones
      })
    })  
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
  var phoneForm = new InteractiveTel(req.body)  
  phoneForm.validate(function (err) {
    if (err) {     
      Site.find({owner: req.user._id}, function (err, sites) { 
        return res.render('phones/new', {
             error: {type: "error", errors: phoneForm.errors}
            ,params: req.body  
            ,sites: sites       
          })
      })
    }    
    else {
      var   url     = 'https://api.interactivetel.com/v3_1/ProvisioningService.asmx?WSDL'      
          , apiKey  = "a4974af9-b8ad-423b-8669-e10ab9fbbf1e"        

      soap.createClient(url, function(err, client) {      
          client.GetTollFreeNumbers({apiKey: apiKey}, function(err, result) {
              if (err) {
                req.session.messages = {type: 'error', message: 'Error! InteractiveTel API error !!'} 
                console.log(err)
              }
              else {
                req.session.messages = {type: 'success', message: 'Phone created !!'} 
                phones = result.GetTollFreeNumbersResult.string 
                _.each(_.first(phones, phoneForm.quantity), function(phone, index, list){
                  newPhone = new Phone({number: phone, destinationNumber: phoneForm.destination_number, site: phoneForm.site})
                  newPhone.save(function (err) {
                  if (err) {     
                    console.log(err)
                  }    
                })
                client.SetNumberDestination({iatNumber: phone, destinationNumber: phoneForm.destination_number, apiKey: apiKey }, function(err, result) {
                  if (err) {
                    console.log(err)
                  } 
                  else {
                    if(phoneForm.activate_immediately){
                        client.ActivateNumber({phoneNumber: phone, apiKey: apiKey }, function(err, result) {
                          console.log("activate_immediately")    
                        })                        
                      }                    
                  }                    
                })
                
              })
            }
            return res.redirect('/phones') 
          })
      })    
   }
  })
   
}