
var formatter = require('./formatter');
var ethernet = require('./ethernet');
var ipv4 = require('./ipv4');

var OpcodeValues = {
  Request: 0,
  Reply: 1
};

ARP = function() {
  this.opcode = null;
  this.sha = ethernet.Address();
  this.spa = ipv4.Address();
  this.tha = ethernet.Address();
  this.tpa = ipv4.Address();
}
exports.ARP = ARP;

ARP.prototype.toFormatter = function(f) {
  f.begin('ARP');
  f.addTriple('Opcode', lookup(this.opcode), this.opcode);
  f.addPair('Sender Hardware Addr', this.sha.toString());
  f.addPair('Sender Protocol Addr', this.spa.toString());
  f.addPair('Target Hardware Addr', this.tha.toString());
  f.addPair('Sender Protocol Addr', this.tpa.toString());
  f.end();
}

ARP.prototype.toString = function() {
  var f = new formatter.Formatter();
  this.toFormatter(f);
  var result = f.toString();
  delete f;
  return result;
}

