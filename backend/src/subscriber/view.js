
(function(){

var validator = require('validator');

var pass = require('../utils/password');

var util      = require('../server/utils');
var msg       = require('./msg');

function isValidPassword(p) {
  //var pat = /[0-9a-zA-Z_\(\){\}\[\]\^\$\.\+\-\*\/\|\!\\:;?<>='"`~@#%&,]{8,}/;
  return pass.validate(p);
}

function authorize(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    // if there is an access token attempt validation
    if(req.headers['x-access-token']) {
      view.controller.authorize(req.headers['x-access-token'],
        function(err, succ) {
          if(err) {
            responder(err);
          } else {
            // set the appropriate credentials and call the next
            // handler in the chain
            req.subscriber_id = succ.subscriber_id;
            req.session_id    = succ.session_id;
            view.logger.info('[Authorized] sub: %s, sess: %s', succ.subscriber_id, succ.session_id);
            next();
          }
        });
    } else {
      // set the request as unauthorized adn call the next
      // handler in the chain
      return next();
    }
  };
}

function login(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.malformedEmail());
    } else if(!req.body.password) {
      responder(msg.missingPassword());
    } else {
      view.controller.login(req.body.email, req.body.password, function(err, succ) {
        responder(err, {"x-access-token": succ});
      });
    }
  };
}

function logout(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    view.controller.logout(req.session_id, responder);
  };
}

function mailerSignup(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.malformedEmail());
    } else {
      view.controller.mailerSignup(req.body.email, 
        req.connection.remoteAddress, responder);
    }
  };
}

function register(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.malformedEmail());
    } else if(!req.body.password) {
      responder(msg.missingPassword());
    } else if(!isValidPassword(req.body.password)) {
      responder(msg.malformedPassword());
    } else {
      view.controller.register(req.body.email, req.body.password,
        req.connection.remoteAddress, responder);
    }
  };
}

function verify(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    if(!req.body.token) {
      responder(msg.missingToken());
    } else {
      view.controller.verify(req.body.token, responder);
    }
  };
}

function forgot(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.malformedEmail());
    } else {
      view.controller.forgot(req.body.email, responder);
    }
  };
}

function reset(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    if(!req.body.token) {
      responder(msg.missingToken());
    } else if(!req.body.password) {
      responder(msg.missingPassword());
    } else if(!isValidPassword(req.body.password)) {
      responder(msg.malformedPassword());
    } else {
      view.controller.reset(req.body.token, req.body.password, responder);
    }
  };
}

function update(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    if(!req.body.oldPassword) {
      responder(msg.missingPassword());
    } else if(!isValidPassword(req.body.oldPassword)) {
      responder(msg.malformedPassword());
    } else if(!req.body.newPassword) {
      responder(msg.missingNewPassword());
    } else if(!isValidPassword(req.body.newPassword)) {
      responder(msg.malformedNewPassword());
    } else {
      view.controller.update(req.subscriber_id,
          req.body.oldPassword, req.body.newPassword, responder);
    }
  };
}

function View(c, subscriberLogger) {

  this.controller = c;

  this.logger = subscriberLogger.child({component: 'view'});

  this.services = [
    {
      method: '*',
      path: '/*',
      handler: authorize(this)
    }, {
      method: 'post',
      path: 'login',
      handler: login(this)
    }, {
      method: 'post',
      path: 'logout',
      handler: util.requiresAuth(logout(this))
    }, {
      method: 'post',
      path: 'register',
      handler: register(this)
    }, {
      method: 'post',
      path: 'verify',
      handler: verify(this)
    }, {
      method: 'post',
      path: 'forgot',
      handler: forgot(this)
    }, {
      method: 'post',
      path: 'reset',
      handler: reset(this)
    }, {
      method: 'post',
      path: 'update',
      handler: util.requiresAuth(update(this))
    }, {
      method: 'post',
      path: 'mailersignup',
      handler: mailerSignup(this)
    }
  ];
}
exports.View = View;

})();
