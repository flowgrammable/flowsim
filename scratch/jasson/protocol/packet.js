
var formatter = require('./formatter');

function Packet(name) {
  this.name = name;
  this.protocols = [];
  this.bytes = 0;
}
exports.Packet = Packet;

Packet.prototype.pushProtocol = function(p) {
  this.protocols.push(p);
  this.bytes += p.bytes();
}

Packet.prototype.popProtocol = function() {
  if(this.protocols.length > 0) {
    this.bytes -= this.protocols[this.protocols.length-1].bytes();
    this.protocols.splice(this.protocols.length-1, 1);
  }
}

Packet.prototype.labels = function() {
  var result = [];
  for(var i=0; i<this.protocols.length; ++i) {
    result.push(this.protocols[i].labels());
  }
  return {
    name: this.name,
    bytes: this.bytes,
    protocols: result
  }
}

function Payload(bytes) {
  this._bytes = bytes;
}
exports.Payload = Payload;

Payload.prototype.toFormatter = function(f) {
  f.begin('Payload');
  f.addPair('Bytes', this._bytes);
  f.end();
}

Payload.prototype.toString = function() {
  var f = new formatter.Formatter();
  this.toFormatter(f);
  var result = f.toString();
  delete f;
  return result;
}

Payload.prototype.labels = function() {
  return {
    name: 'Payload',
    bytes: this.bytes(),
    fields: []
  };
}

Payload.prototype.bytes = function() {
  return this._bytes;
}
