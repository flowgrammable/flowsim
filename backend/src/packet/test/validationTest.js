var utils = require('../utils');

console.log('started test');
var requestBody = "{\"name\": \"packet1\", " +
                  " \"bytes\": 3, " +
                  "  \"protocols\": ["+
                  "   {\"name\": \"Ehernet\", "+
                  "    \"bytes\": 12, "+
                  "    \"fields\": [{\"Src\": \"ff:ff:ff:ff:ff:ff\" }, "+
                  "     {\"Dst\": \"aa:aa:aa:aa:aa:aa\" }, "+
                  "     {\"Typelen\": \"0x8100\"} ] }"+
                  "   ]}";

//var p = JSON.parse(requestBody);

var p = {name: "packet1",
        bytes: 3,
        protocols: [
        {name: "Ethernet",
        bytes: 12,
        fields: [{
          Src: "ff:ff:ff:ff:ff:ff"
        },{
          Dst: "aa:aa:aa:aa:aa:aa"
        }, {
          Typelen: "8100"
        }]}
        ]};

var errMsg = utils.validatePacket(p, function(err, result){
  if(err){
    console.log(err);
  } else {
    console.log('valid packet');
  }
});
