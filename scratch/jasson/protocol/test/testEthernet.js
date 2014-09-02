
var eth = require('../ethernet');

var e = new eth.Header('01:11:22:33:44:55', 'ff:ff:ff:ff:ff:ff', 0x8100);
console.log(e.toString());
console.log('broadcast: ' + e.dst.isBroadcast());
console.log('multicast: ' + e.dst.isMulticast());
console.log('broadcast: ' + e.src.isBroadcast());
console.log('multicast: ' + e.src.isMulticast());

