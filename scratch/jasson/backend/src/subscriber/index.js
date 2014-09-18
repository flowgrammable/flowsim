
(function(){

var validator = require('validator');
var fmt       = require('../utils/formatter');
var msg       = require('./msg');

var controller = require('./controller');

var name = 'subscriber';

function isValidPassword(p) {
  var pat = /[0-9a-zA-Z_\(\)\^\[\]\{\}\.\$,!\+\*\\\|/:;\'"?<>`\-=~@#%&]{8,}/;
  return pat.test(p);
}

function closure(srv, ctrl, f) {
  var server = srv;
  var controller = ctrl;
  return f;
}

function login(req, res, next) {
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
}

function logout(req, res, next) {
  var dispatch = server.responder(res);
  controller.logout(, dispatch);
}

function register(req, res, next) {
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
}

function verify(req, res, next) {
  var dispatch = server.responder(res);
  controller.verify(, dispatch);
}

function reset(req, res, next) {
  var dispatch = server.responder(res);
  if(!req.body.email) {
    dispatch(msg.missingEmail());
  } else if(!validator.isEmail(req.body.email)) {
    dispatch(msg.badEmail());
  } else {
    controller.reset(req.body.email, dispatch);
  }
}
  
function Subscriber(context) {
  // Set the context references
  this.config     = context.configuration[name];
  this.controller = new ctrl.Controller(context);;
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

  // Initialize the database with the local models
  this.database.loadLocalModules(__dirname);

  // Add the handlers
  server.addHandler(
    'post',
    this._getPathName(server, 'login'), 
    closure(server, this.controller, login)
  );

  server.addHandler(
    'post',
    this._getPathName(server, 'logout'), 
    closure(server, this.controller, logout)
  );

  server.addHandler(
    'post',
    this._getPathName(server, 'register'), 
    closure(server, this.controller, register)
  );

  server.addHandler(
    'post',
    this._getPathName(server, 'verify'), 
    closure(server, this.controller, verify)
  ):

  server.addHandler(
    'post',
    this._getPathName(server, 'reset'),
    closure(server, this.controller, reset)
  );

};

})();

