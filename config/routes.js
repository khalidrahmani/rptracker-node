
var async = require('async')
  , users_controller = require('../app/controllers/users_controller')
  , sites_controller = require('../app/controllers/sites_controller')
  , phones_controller = require('../app/controllers/phones_controller')
  , auth = require('./middlewares/authorization')

module.exports = function (app, passport) {

  app.get('/login', users_controller.login)
  app.get('/signup', users_controller.signup)
  app.get('/logout', users_controller.logout)
  app.post('/users', users_controller.create)

  app.post('/users/session', saveRequestBody(),
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users_controller.session)
  
  app.get('/users/edit', auth.requiresLogin, users_controller.edit)
  app.post('/users/update', auth.requiresLogin, users_controller.update)  
  
  app.get('/users/settings', auth.requiresLogin, users_controller.settings)
  app.post('/users/settings', auth.requiresLogin, users_controller.updateSettings) 

  app.get('/', auth.requiresLogin, sites_controller.index)
  app.get('/sites/new', auth.requiresLogin, sites_controller.new)
  app.post('/sites', auth.requiresLogin, sites_controller.create)
  app.get('/sites/:id/edit', auth.requiresLogin, sites_controller.edit)
  app.post('/sites/:id', auth.requiresLogin, sites_controller.update)  
  app.delete('/sites/:id', auth.requiresLogin, sites_controller.destroy)
  app.get('/sites/activate', auth.requiresLogin, sites_controller.activate)  

  app.get('/phones', auth.requiresLogin, phones_controller.index)
  app.get('/phones/new', auth.requiresLogin, phones_controller.new)  
  app.post('/phones/create', auth.requiresLogin, phones_controller.create)  

  app.get('*', function(req, res, next) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      })
  })
}

function saveRequestBody() {   // save user email in login form 
   return function(req, res, next) {
          req.session['email'] = req.body.email
          next()
    }
}