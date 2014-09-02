
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
    this.value |= 0x00000000 & result[3]
  } else if(typeof value == 'number') {
    this.value = value;
  } else if(value instanceof Address) {
    this.value = value.value;
  } else {
    throw 'Invalid IPv4 Address';
  }
}
