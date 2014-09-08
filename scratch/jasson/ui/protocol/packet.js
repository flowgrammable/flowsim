
var fgPacket = (function(){

var _Packet = function(name) {
  this.name = name;
  this.bytes = 0;
  this.data = [];
};

_Packet.prototype.addPayload = function(p) {
  this.data.push(p);
  this.bytes += p.bytes();
};

var _create = function(n) { return new _Packet(n); };

return {
  Packet: _Packet,
  create: _create
};

})();

