
var packet = require('../packet');
var ethernet = require('../ethernet');

var eth = new ethernet.Header('01:11:22:33:44:55', 'ff:ff:ff:ff:ff:ff', 0x8100);
var pkt = new packet.Packet('broadcast');
var pld = new packet.Payload(1000);

pkt.pushProtocol(eth);
pkt.pushProtocol(pld);

console.log(pkt.labels());
var labels = pkt.labels().protocols[0];
for(var i=0; i<labels.fields.length; ++i) {
  console.log(labels.fields[i].name + ': ' + labels.fields[i].value);
}
