
(function(){

var buffer = require('./buffer');

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
}

Header.prototype.decode = function(buffer) {
}

})();

