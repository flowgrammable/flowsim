
var formatter = require('./formatter');

Address = function(value) {
  this.value = 0;
  var addr = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
  var octet = /[0-9]{1,3}/g
  if(typeof value == 'string') {
    if(!addr.test(value)) throw 'Invalid IPv4 Address';
    var result = value.match(octet);
    this.value =  0xff000000 & (result[0] << 24);
    this.value |= 0x00ff0000 & (result[1] << 16);
    this.value |= 0x0000ff00 & (result[2] << 8);
    this.value |= 0x000000ff & result[3]
  } else if(typeof value == 'number') {
    this.value = value;
  } else if(value instanceof Address) {
    this.value = value.value;
  } else {
    throw 'Invalid IPv4 Address';
  }
}
exports.Address = Address;

Address.prototype.toString = function() {
  var result = [];
  result.push((this.value >> 24) & 0xff);
  result.push((this.value >> 16) & 0xff);
  result.push((this.value >> 8) & 0xff);
  result.push(this.value & 0xff);
  return result.join('.');
}

Mask = function(mask) {
  this.value = 0;
  if(typeof mask == 'string') {
  } else if(typeof value == 'number') {
    for(var i=0; i<value; ++i) {
      this.value |= 1;
      this.value <<= 1;
    }
    this.value = ~this.value;
  } else if(value instanceof Mask) {
    this.value = value.value;
  } else {
    throw 'Invalid IPv4 Mask';
  }
}
exports.Mask = Mask;

var a = new Address('10.1.1.1');
console.log('ip: ' + a.toString());
