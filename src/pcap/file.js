
(function(){

var fs   = require('fs');
var path = require('path');
var view = require('../utils/view');

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
  fs.readSync(this.fd, buf, 0, amount);
  return new view.View(buf);
};

File.prototype.close = function() {
  if(this.fd) {
    fs.closeSync(this.fd);
  }
};

})();

