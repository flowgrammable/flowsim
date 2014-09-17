
(function(){

var fs     = require('fs');
var buffer = require('../utils/buffer');

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
  this.snaplen      = null;
  this.datalink     = null;
}

Header.prototype.bytes = function() {
  return 24;
};

Header.prototype._fromView = function(view) {
  var mode = buffer.MSBF;
  this.magicNumber  = view.readUInt32(mode)(view);
  mode = getModeFromMagic(mode, this.magicNumber);

  this.majorVersion = buffer.readUInt16(mode)(view, 4);
  this.minorVersion = buffer.readUInt16(mode)(view, 6);
  this.gmtOffset    = buffer.readUInt32(mode)(view, 8);
  this.tsAccuracy   = buffer.readUInt32(mode)(view, 12);
  this.snaplen      = buffer.readUInt32(mode)(view, 16);
  this.datalink     = buffer.readUInt32(mode)(view, 20);
};

Header.prototype._toView = function(view) {
  buffer.writeUInt32(mode)(view, this.magicNumber);
  buffer.writeUInt16(mode)(view, this.magorVersion, 4);
  buffer.writeUInt16(mode)(view, this.minorVersion, 6);
  buffer.writeUInt32(mode)(view, this.gmtOffset, 8);
  buffer.writeUInt32(mode)(view, this.tsAccuracy, 12);
  buffer.writeUInt32(mode)(view, this.snaplen, 16);
  buffer.writeUInt32(mode)(view, this.datalink, 20);
};

Header.prototype.fromView = buffer.decode;
Header.prototype.toView = buffer.encode;

function File(name) {
  this.fd = fs.openSync(name, 'rs');
}
exports.File = File;

File.prototype.close = function() {
  if(this.fd) {
    fs.closeSync(this.fd);
  }
};

})();

