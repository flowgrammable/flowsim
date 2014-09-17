
var f = require('../file');
var g = require('../global');

var p0 = new f.File('test.pcap');
var header = new g.Header();
header.fromView(p0.read(24));
console.log(header);
p0.close();
