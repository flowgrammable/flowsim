
(function(){

var buffer = require('../utils/buffer');
var data   = require('../utils/data');

function Header() {
  this.sec    = null;
  this.usec   = null;
  this.caplen = null;
  this.len    = null;
}
exports.Header = Header;

Header.prototype.bytes = function() {
  return 16;
};

Header.prototype._fromView = function(view) {
  this.sec    = buffer.readUInt32(mode)(view);
  this.usec   = buffer.readUInt32(mode)(view, 4);
  this.caplen = buffer.readUInt32(mode)(view, 8);
  this.len    = buffer.readUInt32(mode)(view, 12);
};

Header.prototype._toView = function(view) {
  buffer.writeUInt32(mode)(view, this.sec);
  buffer.writeUInt32(mode)(view, this.usec, 4);
  buffer.writeUInt32(mode)(view, this.caplen, 8);
  buffer.writeUInt32(mode)(view, this.len, 12);
};

Header.prototype.fromView = buffer.decode;
Header.prototype.toView = buffer.encode;

function Packet() {
  this.header = new Header();
  this.packet = new Data();
}
exports.Packet = Packet;

Packet.prototype.bytes = function(){
  return this.header.bytes() + this.packet.bytes();
};

Packet.prototype.fromView = function(view) {
  view = this.header.fromView(view);
  this.packet = new data.Data(this.header.caplen);  
  return this.packet.fromView(view);
};

Packet.prototype.toView = function(view) {
  view = this.header.toView(view);
  return this.packet.toView(view);
};

})();

