
(function(){

var validator = require('validator');

var util      = require('../server/utils');
var msg       = require('./msg');

function isValidPassword(p) {
  var pat = /[0-9a-zA-Z_\(\){\}\[\]\^\$\.\+\-\*\/\|\!\\:;?<>='"`~@#%&,]{8,}/;
  return pat.test(p);
}

function authorize(view) {
  return function(req, res, next) {
    var responder = util.Responder(res);

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
            console.log('sub: %s, sess: %s', succ.subscriber_id, succ.session_id);
            next();
          }
        });
    } else {
      // set the request as unauthorized adn call the next 
      // handler in the chain
      req.subscriber_id = -1;
      req.session_id    = -1;
      return next();
    }
  };
}

function login(view) {
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.badEmail());
    } else if(!req.body.password) {
      responder(msg.missingPwd());
    } else if(!isValidPassword(req.body.password)) {
      responder(msg.badPwd());
    } else {
      view.controller.login(req.body.email, req.body.password, function(err, succ) {
        responder(err, {"x-access-token": succ});
      });
    }
  };
}

function logout(view) {
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(req.headers['x-access-token']) {
      view.controller.logout(req.headers['x-access-token'], responder);
    } else {
      responder(msg.missingAccessToken());
    }
  };
}

function register(view) {
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.badEmail());
    } else if(!req.body.password) {
      responder(msg.missingPwd());
    } else if(!isValidPassword(req.body.password)) {
      responder(msg.badPwd());
    } else {
      view.controller.register(req.body.email, req.body.password,
        req.connection.remoteAddress, responder);
    }
  };
}

function verify(view) {
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(!req.body.token) {
      responder(msg.missingVerificationToken());
    } else {
      view.controller.verify(req.body.token, responder);
    }
  };
}

function forgot(view) {
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.badEmail());
    } else {
      view.controller.forgot(req.body.email, responder);
    }
  };
}

function update(view) {
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(!req.body.oldPassword) {
      responder(msg.missingPwd());
    } else if(!isValidPassword(req.body.oldPassword)) {
      responder(msg.badPwd());
    } else if(!req.body.newPassword) {
      responder(msg.missingPwd());
    } else if(!isValidPassword(req.body.newPassword)) {
      responder(msg.badPwd());
    } else {
      view.controller.update(req.subscriber_id, req.session_id, req.body.oldPassword,
                             req.body.newPassword, responder);
    }
  };
}

function View(c) {

  this.controller = c;

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
      path: 'update',
      handler: util.requiresAuth(update(this))
    } 
  ];
}
exports.View = View;

})();

