
var formatter = require('./formatter');

function Packet() {
  this.protocols = [];
  this.bytes = 0;
}
exports.Packet = Packet;

Packet.prototype.pushProtocol = function(p) {
  this.protocols.push(p);
  this.bytes += p.bytes();
}

Packet.prototype.popProtocol = function() {
  if(this.protocols.length > 0)
    this.protocols.splice(this.protocols.length-1, 1);
}

Packet.prototype.labels = function() {
  var result = [];
  for(var i=0; i<this.protocols.length; ++i) {
    result.push(this.protocols[i].labels());
  }
  return result;
}
