
var view = require('./view');

var b0 = new view.View(1024);

view.writeUInt32(view.MSBF)(b0, parseInt('0x0a01010a', 16));
var x = view.readUInt32(view.MSBF)(b0);

console.log(x);
console.log(x.toString(16));
