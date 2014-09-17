
var buffer = require('./buffer');

var b0 = new buffer.Buffer(1024);

buffer.writeUInt32('BE')(b0, parseInt('0x0a01010a', 16));
var x = buffer.readUInt32('BE')(b0);

console.log(x);
console.log(x.toString(16));
