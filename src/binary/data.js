
(function(){

function Data(param) {
  if(param === undefined) {
    this.buf = new Buffer(256);
  } else if(param instanceof Buffer) {
    this.buf = param;
  } else if(typeof param === 'number') {
    this.buf = new Buffer(param);
  } else {
    throw "Unknown Data param: " + typeof param;
  }
}
exports.Data = Data;

Data.prototype.bytes = function() {
  return this.buf.length;
};

Data.prototype.getBuffer = function() {
  return this.buf;
};

})();

