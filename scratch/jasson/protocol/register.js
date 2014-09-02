
var formatter = require('./formatter');
var key = require('./key');

function Register(port, pkt) {
  this.packet = pkt;
  this.key = new key.Key(port);
  this.actionSet = [];
}
exports.Register = Register;

Register.prototype.toFormatter = function(f) {
  f.begin('Register');

  f.end();
}

Register.prototype.toString = function() {
  var f = new formatter.Formatter();
  this.toFormatter(f);
  var result = f.toString();
  delete f;
  return result;
}

