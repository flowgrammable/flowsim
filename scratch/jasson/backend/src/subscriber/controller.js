
(function(){

var fmt = require('../utils/formatter');
var msg = require('./msg');
var stg = require('./storage');

function Controller(context) {
  this.storage  = new stg.Storage(context.database);
  this.mailer   = context.mailer;
  this.template = context.template;
}
exports.Controller = Controller;

Controller.prototype.toFromatter = function(f) {
  f.begin('Controller');
  this.storage.toFormatter(f);
  this.mailer.toFormatter(f);
  this.template.toFormatter(f);
  f.end();
};

Controller.prototype.toString = fmt.toString;

Controller.prototype.login = function(email, pwd, delgate) {
  delegate();
};

Controller.prototype.logout = function(delegate) {
  delegate();
  console.log('blah');
};

Controller.prototype.register = function(delegate) {
  delegate();
};

Controller.prototype.verify = function(delegate) {
  delegate();
};

Controller.prototype.reset = function(delegate) {
  delegate();
};

})();

