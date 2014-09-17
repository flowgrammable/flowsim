
(funciton(){

var fs = require('fs');

function Packet(sec, len, caplen, buf, nsec) {
  this.sec    = sec;
  this.nsec   = nsec ? nsec : 0;
  this.len    = len;
  this.caplen = caplen;
  this.buf    = buf;
}
exports.Packet = Packet;

function Header() {
  this.magicNumber  = null;
  this.majorVersion = null;
  this.minorVersion = null;
  this.gmtOffset    = null;
  this.tsAccuracy   = null;
  this.maxCapture   = null;
  this.netLink      = null;
  this.mode         = null;
}

Header.prototype.bytes = function() {
  return 24;
}

Header.prototype.decode = function(buf) {
}

function PcapFile(name) {
  this.name = name;
  this.buf = new Buffer(2048);
  this.fd = fs.open(name, 'rs');
  this.ops = {};

  fs.readSync(this.fd, buf, 0, 24);
}
exports.PcapFile = PcapFile;

PcapFile.prototype.getPacket = function(callback) {

};

PcapFile.prototype.close = function() {
  fs.closeSync(this.fd);
}

})();

