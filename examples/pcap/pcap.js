
(function(){

var buffer = require('./buffer');

function getModeFromMagic(mode, value) {
  var magic = parseInt('0xa1b2c3d4', 16);
  if(value !== magic && mode === buffer.msbf) {
    mode = buffer.lsbf;
  } else if(value !== magic && mode === buffer.lsbf) {
    mode = buffer.msbf;
  }
}

function Header() {
  this.magicNumber  = null;
  this.majorVersion = null;
  this.minorVersion = null;
  this.gmtOffset    = null;
  this.tsAccuracy   = null;
  this.maxCapture   = null;
  this.netLink      = null;
}

Header.prototype.bytes = function() {
  return 24;
};

Header.prototype.fromView = function(view) {
  var mode = buffer.msbf;
  this.magicNumber  = view.readUInt32(mode)(view);
  mode = getModeFromMagic(mode, this.magicNumber);

  this.majorVersion = view.readUInt16(mode)(view, 4);
  this.minorVersion = view.readUInt16(mode)(view, 6);
  this.gmtOffset    = view.readUInt32(mode)(view, 8);
  this.tsAccuracy   = view.readUInt32(mode)(view, 12);
  this.maxCapture   = view.readUInt32(mode)(view, 16);
  this.netLink      = view.readUInt32(mode)(view, 20);
};

Header.prototype.decode = function(view) {
  if(view.bytes() < this.bytes()) {
    throw 'Too few bytes for Pcap Header: ' + view.bytes();
  }
  this.fromView(view);
  return buffer.advance(view, this.bytes());
};

Header.prototype.toView = function(view) {
  this.magicNumber  = view.writeUInt32(mode)(view, this.magicNumber);
  this.majorVersion = view.writeUInt16(mode)(view, this.magorVersion, 4);
  this.minorVersion = view.writeUInt16(mode)(view, this.minorVersion, 6);
  this.gmtOffset    = view.writeUInt32(mode)(view, this.gmtOffset, 8);
  this.tsAccuracy   = view.writeUInt32(mode)(view, this.tsAccuracy, 12);
  this.maxCapture   = view.writeUInt32(mode)(view, this.maxCapture, 16);
  this.netLink      = view.writeUInt32(mode)(view, this.netLink, 20);
};

Header.prototype.encode = function(view) {
  if(view.bytes() < this.bytes()) {
    throw 'Too few bytes for Pcap Header: ' + view.bytes();
  }
  this.toView(view);
  return buffer.advance(view, this.bytes());
};

})();

