
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

  this.majorVersion = buffer.readUInt16(mode)(view, 4);
  this.minorVersion = buffer.readUInt16(mode)(view, 6);
  this.gmtOffset    = buffer.readUInt32(mode)(view, 8);
  this.tsAccuracy   = buffer.readUInt32(mode)(view, 12);
  this.maxCapture   = buffer.readUInt32(mode)(view, 16);
  this.netLink      = buffer.readUInt32(mode)(view, 20);
};

Header.prototype.decode = buffer.decode;

Header.prototype.toView = function(view) {
  this.magicNumber  = buffer.writeUInt32(mode)(view, this.magicNumber);
  this.majorVersion = buffer.writeUInt16(mode)(view, this.magorVersion, 4);
  this.minorVersion = buffer.writeUInt16(mode)(view, this.minorVersion, 6);
  this.gmtOffset    = buffer.writeUInt32(mode)(view, this.gmtOffset, 8);
  this.tsAccuracy   = buffer.writeUInt32(mode)(view, this.tsAccuracy, 12);
  this.maxCapture   = buffer.writeUInt32(mode)(view, this.maxCapture, 16);
  this.netLink      = buffer.writeUInt32(mode)(view, this.netLink, 20);
};

Header.prototype.encode = buffer.encode;

})();

