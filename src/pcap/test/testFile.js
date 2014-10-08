
var f = require('../file');
var g = require('../global');
var p = require('../packet');

var p0 = new f.File('test.pcap');
var gHdr = new g.Header();
gHdr.fromView(p0.read(24));
console.log(gHdr);

/// BROKEN: reading in a packet from the Packet() interface is not working.
//var pkt = new p.Packet(gHdr);
// how to you pass in view without reading too much / to little?
//pkt.fromView(p0.read(16));
//console.log(pkt);


// Pull out the packet manually:
//do(<until pcap file is done>) {    // not sure how to terminate this...
while (true) {
  var pHdr = new p.Header(gHdr.mode);
  var tmpView = p0.read(16);
  if (tmpView === null) {break;}  // this is a hack to terminate at EOF
  pHdr.fromView(tmpView);
  console.log(pHdr);
  var pktView = p0.read(pHdr.caplen);
  console.log(pktView);
}

p0.close();
