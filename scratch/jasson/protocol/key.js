
var formatter = require('./formatter');

Key = function() {
  table_id = 0;
  inport = null;
  eth_src = null;
  eth_dst = null;
  eth_type = null;
}
exports.Key = Key;

Key.prototype.toFormatter = function(f) {
  f.begin('Key');
  for(var prop in this) {
    if(this.hasOwnProperty(prop) && this[prop] !== null) {
      f.addPair(prop, this[prop]);
    }
  }
  f.end();
}

Key.prototype.toString = function() {
  var f = new formatter.Formatter();
  this.toFormatter(f);
  var result = f.toString();
  delete f;
  return result;
}

