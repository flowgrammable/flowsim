
(function(){

var view = require('../binary/view');

function getModeFromMagic(mode, value) {
  var magic = parseInt('0xa1b2c3d4', 16);
  if(value !== magic && mode === view.MSBF) {
    return view.LSBF;
  } else if(value !== magic && mode === view.LSBF) {
    return view.MSBF;
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
exports.Header = Header;

Header.prototype.bytes = function() {
  return 24;
};

Header.prototype._fromView = function(v) {
  var mode = view.MSBF;
  this.magicNumber  = view.readUInt32(mode)(v);
  this.mode = getModeFromMagic(mode, this.magicNumber);

  this.majorVersion = view.readUInt16(this.mode)(v, 4);
  this.minorVersion = view.readUInt16(this.mode)(v, 6);
  this.gmtOffset    = view.readUInt32(this.mode)(v, 8);
  this.tsAccuracy   = view.readUInt32(this.mode)(v, 12);
  this.snaplen      = view.readUInt32(this.mode)(v, 16);
  this.datalink     = view.readUInt32(this.mode)(v, 20);
};

Header.prototype._toView = function(v) {
  view.writeUInt32(this.mode)(v, this.magicNumber);
  view.writeUInt16(this.mode)(v, this.magorVersion, 4);
  view.writeUInt16(this.mode)(v, this.minorVersion, 6);
  view.writeUInt32(this.mode)(v, this.gmtOffset, 8);
  view.writeUInt32(this.mode)(v, this.tsAccuracy, 12);
  view.writeUInt32(this.mode)(v, this.snaplen, 16);
  view.writeUInt32(this.mode)(v, this.datalink, 20);
};

Header.prototype.fromView = view.decode;
Header.prototype.toView   = view.encode;

})();

