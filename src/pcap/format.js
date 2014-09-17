
(function(){

var fs     = require('fs');
var view = require('../utils/view');

function getModeFromMagic(mode, value) {
  var magic = parseInt('0xa1b2c3d4', 16);
  if(value !== magic && mode === view.MSBF) {
    mode = view.LSBF;
  } else if(value !== magic && mode === view.LSBF) {
    mode = view.MSBF;
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

Header.prototype._fromView = function(v) {
  var mode = view.MSBF;
  this.magicNumber  = view.readUInt32(mode)(v);
  mode = getModeFromMagic(mode, this.magicNumber);

  this.majorVersion = view.readUInt16(mode)(v, 4);
  this.minorVersion = view.readUInt16(mode)(v, 6);
  this.gmtOffset    = view.readUInt32(mode)(v, 8);
  this.tsAccuracy   = view.readUInt32(mode)(v, 12);
  this.snaplen      = view.readUInt32(mode)(v, 16);
  this.datalink     = view.readUInt32(mode)(v, 20);
};

Header.prototype._toView = function(v) {
  view.writeUInt32(mode)(v, this.magicNumber);
  view.writeUInt16(mode)(v, this.magorVersion, 4);
  view.writeUInt16(mode)(v, this.minorVersion, 6);
  view.writeUInt32(mode)(v, this.gmtOffset, 8);
  view.writeUInt32(mode)(v, this.tsAccuracy, 12);
  view.writeUInt32(mode)(v, this.snaplen, 16);
  view.writeUInt32(mode)(v, this.datalink, 20);
};

Header.prototype.fromView = buffer.decode;
Header.prototype.toView   = buffer.encode;

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

