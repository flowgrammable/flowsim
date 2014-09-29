
/**
 * @module subscriber
 * @requires module:utils~Formatter module:controller
 */

(/** @lends module:subscriber */function(){

var validator = require('validator');
var fmt       = require('../utils/formatter');
var msg       = require('../utils/msg');
var util      = require('../server/utils');
var ctlr      = require('./controller');

var name = 'subscriber';

function isValidPassword(p) {
  var pat = /[0-9a-zA-Z_\(\){\}\[\]\^\$\.\+\-\*\/\|\!\\:;?<>='"`~@#%&,]{8,}/;
  return pat.test(p);
}

/**
 * The authorize service attempts to obtain the x-access-token from the HTTP
 * request headers. If the token is present then the controller will be asked to
 * authenticate and authorize the token. If no token is present the request is
 * unauthenticated.
 *
 * @param {Object} controller - instance of the subscriber controller
 * @returns {Function} a valid Restify HTTP request handler function
 */
function authorize(controller) {
  var _controller = controller;
  return function(req, res, next) {
    var responder = util.Responder(res);
    // if there is an access token attempt validation
    if(req.headers['x-access-token']) {
      controller.authorize(
        req.headers['x-access-token'],
        function(err, succ) {
          if(err) {
            responder(err);
          } else {
            // set the appropriate credentials and call the next 
            // handler in the chain
            req.subscriber_id = succ.subscriber_id;
            req.session_id    = succ.session_id;
            next();
          }
        }
      );
    } else {
      // set the request as unauthorized adn call the next 
      // handler in the chain
      req.subscriber_id = 0;
      req.session_id    = 0;
      return next();
    }
  };
}

function login(controller) {
  var _controller = controller;
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(!req.body.email) {
      responder(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      responder(msg.badEmail());
    } else if(!req.body.pwd) {
      responder(msg.missingPwd());
    } else if(!isValidPassword(req.body.pwd)) {
      responder(msg.badPwd());
    } else {
      controller.login(req.body.email, req.body.pwd, function(err, succ) {
        if(err) {
          responder(err);
        } else {
          responder(null, {"x-access-token": succ});
        }
      });
    }
  };
}

function logout(controller) {
  var _controller = controller;
  return function(req, res, next) {
    var responder = util.Responder(res);
    if(req.headers['x-access-token']) {
      controller.logout(req.headers['x-access-token'], function(err, succ) {
        if(err) {
          responder(err);
        } else {
          responder(null, {});
        }
      });
    } else {
      responder(msg.missingAccessToken());
    }
  };
}

function register(_server, _controller) {
  var server     = _server;
  var controller = _controller;
  return function(req, res, next) {
    var dispatch = util.Delegate(res);
    if(!req.body.email) {
      dispatch(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      dispatch(msg.badEmail());
    } else if(!req.body.pwd) {
      dispatch(msg.missingPwd());
    } else if(!isValidPassword(req.body.pwd)) {
      dispatch(msg.badPwd());
    } else {
      controller.register(req.body.email, req.body.pwd, dispatch);
    }
  };
}

function verify(_server, _controller) {
  var server     = _server;
  var controller = _controller;
  return function(req, res, next) {
    var dispatch = util.Delegate(res);
    if(!req.body.token) {
      dispatch(msg.missingVerificationToken());
    } else if(invalid(req.body.token)) {
      // FIXME: figure out how invali token works
      dispatch(msg.badVerificationToken());
    } else {
      controller.verify(dispatch);
    }
  };
}


function reset(_server, _controller) {
  return function(req, res, next) {
    var dispatch = util.Delegate(res);
    if(!req.body.email) {
      dispatch(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      dispatch(msg.badEmail());
    } else {
      controller.reset(req.body.email, dispatch);
    }
  };
}

/**
 * A subscriber object manages all aspects of subscriber lifecycle on the
 * server: registration, verification, login, logout, password reset, etc. This
 * subscriber object manages all aspects of interacting with the HTTP server and
 * subscriber controller (location of business logic).
 *
 * @constructor
 * @param {Object} context          - wrapper of necessary services
 * @param {Object} context.database - database engine
 * @param {Object} context.mailer   - SMTP engine
 * @param {Object} context.template - template engine
 */
function Subscriber(context) {
  // Set the context references
  this.config     = context.configuration[name];
  this.controller = new ctlr.Controller(context);
}
exports.Subscriber = Subscriber;

Subscriber.prototype.toFormatter = function(f) {
  f.begin('Subscriber');
  this.controller.toFormatter(f);
  f.end();
};

Subscriber.prototype.toString = fmt.toString;

Subscriber.prototype._getPathName = function(server, path) {
  return name + '/' + path;
};

/**
 * The load method is called by a server when it is ready to load
 * the module. The module uses this event as a signal to establish any
 * necessary preconditions to successful operation that haven't already been
 * established.
 *
 * @param {Object} server - a well constructed server object
 */
Subscriber.prototype.load = function(server) {

  // Add the authorization handler first and ensure it sees all method and paths
  server.addHandler(
    '*', 
    server.rootPath() + '/*', 
    authorize(server, this.controller)
  );

  // Add the login handler for subscriber login requests
  server.addHandler(
    'post',
    this._getPathName(server, 'login'), 
    login(server, this.controller)
  );

  // Add the logout handler for subscriber logout requests
  server.addHandler(
    'post',
    this._getPathName(server, 'logout'), 
    logout(server, this.controller)
  );

  // Add the register handler for new subscriber registration requests
  server.addHandler(
    'post',
    this._getPathName(server, 'register'), 
    register(server, this.controller)
  );

  // Add the verify handler for subscriber veification requests
  server.addHandler(
    'post',
    this._getPathName(server, 'verify'), 
    verify(server, this.controller)
  );

  // Add the reset handler for subscriber password reset requests
  server.addHandler(
    'post',
    this._getPathName(server, 'reset'),
    reset(server, this.controller)
  );

};

})();

