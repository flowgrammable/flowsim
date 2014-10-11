var pktValidator = require('../utils');

console.log('started test');
var requestBody = "{\"name\": \"packet1\", " +
                  " \"bytes\": 3, " +
                  "  \"protocols\": ["+
                  "   {\"name\": \"Ethernet\", "+
                  "    \"bytes\": 12, "+
                  "    \"fields\": [{\"Src\": \"ff:ff:ff:ff:ff:ff\" }, "+
                  "     {\"Dst\": \"aa:aa:aa:aa:aa:aa\" }, "+
                  "     {\"Typelen\": \"0x8101\"} ] }"+
                  "   ]}";

var p = JSON.parse(requestBody);
pktValidator.validatePacket(p, function(err, result){
  if(err){
  console.log('invalid packet');
  } else {
  console.log('valid packet');
  }
});
