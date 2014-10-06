
var f = require('../file');
var g = require('../global');
var p = require('../packet');

var p0 = new f.File('test.pcap');
var gHdr = new g.Header();
gHdr.fromView(p0.read(24));
console.log(gHdr);

var pkt = new p.Packet(gHdr);
// how to you pass in view without reading too much / to little?
pkt.fromView(p0.read(16));
console.log(pkt);

p0.close();
