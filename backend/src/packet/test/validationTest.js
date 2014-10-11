var pktValidator = require('../utils');

console.log('started test');
var requestBody = "{\"name\": \"packet1\", " +
                  " \"bytes\": 3, " +
                  "  \"protocols\": ["+
                  "   {\"name\": \"Ethernet\", "+
                  "    \"bytes\": 14, "+
                  "    \"fields\": [{\"ip\": \"3\" }, {\"ip2\": \"4\" }] },"+
                  "   {\"name\": \"Ethernet\"}]}";

var p = JSON.parse(requestBody);
pktValidator.validatePacket(p, function(err, result){
  if(err){
  console.log('invalid packet');
  } else {
  console.log('valid packet');
  }
});
