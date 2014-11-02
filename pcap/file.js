
(function(){

var fs   = require('fs');
var path = require('path');
var view = require('../binary/view');

function File(name) {
  if(path.extname(name) !== '.pcap') {
    throw 'Expecting .pcap extension on: ' + name;
  }
  this.name = name;
  this.fd = fs.openSync(name, 'rs');
}
exports.File = File;

File.prototype.read = function(amount) {
  var buf = new Buffer(amount);
  var bytesRead = fs.readSync(this.fd, buf, 0, amount);
  if (bytesRead === 0) {
    return null;
  }
  var v = new view.View(buf);
  //console.log('bytesRead: ' + bytesRead);
  v.constrain(amount-bytesRead);  // for when the bytesRead != bytes desired
  // I don't think v.constrain() is working when bytesRead==0.
  //console.log('constrained by: ' + (amount-bytesRead));
  return v;
};

File.prototype.close = function() {
  if(this.fd) {
    fs.closeSync(this.fd);
  }
};

})();

