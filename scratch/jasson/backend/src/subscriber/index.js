
(function(){

var validator = require('validator');
var fmt       = require('../utils/formatter');
var msg       = require('./msg');
var ctlr      = require('./controller');

var name = 'subscriber';

function isValidPassword(p) {
  var pat = /[0-9a-zA-Z_\(\)\^\[\]\{\}\.\$,!\+\*\\\|/:;\'"?<>`\-=~@#%&]{8,}/;
  return pat.test(p);
}

function login(_server, _controller) {
  var server     = _server;
  var controller = _controller;
  return function(req, res, next) {
    var dispatch = server.responder(res);
    if(!req.body.email) {
      dispatch(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      dispatch(msg.badEmail());
    } else if(!req.body.pwd) {
      dispatch(msg.missingPwd());
    } else if(!isValidPassword(req.body.pwd)) {
      dispatch(msg.badPwd());
    } else {
      controller.login(req.body.email, req.body.pwd, dispatch);
    }
  };
}

function logout(_server, _controller) {
  var server     = _server;
  var controller = _controller;
  return function(req, res, next) {
    var dispatch = server.responder(res);
    controller.logout(dispatch);
  };
}

function register(_server, _controller) {
  var server     = _server;
  var controller = _controller;
  return function(req, res, next) {
    var dispatch = server.responder(res);
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
    var dispatch = server.responder(res);
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
    var dispatch = server.responder(res);
    if(!req.body.email) {
      dispatch(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      dispatch(msg.badEmail());
    } else {
      controller.reset(req.body.email, dispatch);
    }
  };
}
  
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
  return server.rootPath() + '/' + name + '/' + path;
};

Subscriber.prototype.load = function(server) {

  // Add the handlers
  server.addHandler(
    'post',
    this._getPathName(server, 'login'), 
    login(server, this.controller)
  );

  server.addHandler(
    'post',
    this._getPathName(server, 'logout'), 
    logout(server, this.controller)
  );

  server.addHandler(
    'post',
    this._getPathName(server, 'register'), 
    register(server, this.controller)
  );

  server.addHandler(
    'post',
    this._getPathName(server, 'verify'), 
    verify(server, this.controller)
  );

  server.addHandler(
    'post',
    this._getPathName(server, 'reset'),
    reset(server, this.controller)
  );

};

})();

