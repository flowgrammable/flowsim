
(function(){

var view = require('../utils/view');
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

Header.prototype._fromView = function(v) {
  this.sec    = view.readUInt32(mode)(v);
  this.usec   = view.readUInt32(mode)(v, 4);
  this.caplen = view.readUInt32(mode)(v, 8);
  this.len    = view.readUInt32(mode)(v, 12);
};

Header.prototype._toView = function(v) {
  view.writeUInt32(mode)(v, this.sec);
  view.writeUInt32(mode)(v, this.usec, 4);
  view.writeUInt32(mode)(v, this.caplen, 8);
  view.writeUInt32(mode)(v, this.len, 12);
};

Header.prototype.fromView = view.decode;
Header.prototype.toView = view.encode;

function Packet() {
  this.header = new Header();
  this.packet = new Data();
}
exports.Packet = Packet;

Packet.prototype.bytes = function(){
  return this.header.bytes() + this.packet.bytes();
};

Packet.prototype.fromView = function(v) {
  v = this.header.fromView(v);
  this.packet = new data.Data(this.header.caplen);  
  return this.packet.fromView(v);
};

Packet.prototype.toView = function(v) {
  v = this.header.toView(v);
  return this.packet.toView(v);
};

})();

