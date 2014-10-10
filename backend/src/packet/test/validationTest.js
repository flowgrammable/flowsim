var pktValidator = require('../utils');


var requestBody = "{\"name\": \"packet1\", " +
                  " \"bytes\": 3, " +
                  "  \"protocols\": ["+
                  "   {\"name\": \"acoolpacket\", "+
                  "    \"bytes\": 3, "+
                  "    \"fields\": [{\"ip\": 3 }] }]}";

var p = JSON.parse(requestBody);
console.log(p);
pktValidator.validPacket(p, function(err, result){
  if(err){
  console.log(err);
  } else {
  console.log('valid packet');
  }
});
