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
        protocols: [{
          name: "Ethernet",
          bytes: 14,
          fields: {
            src: "ff:ff:ff:ff:ff:ff",
            dst: "aa:aa:aa:aa:aa:aa",
            typelen: "0x8100"
          }},{
          name: "IPv4",
          bytes: 20,
          fields: {
            dscp: '0x3f',
            ecn: '0x03',
            proto: '0xffff',
            src: '10.0.0.1',
            dst: '10.0.0.2'
          }
        },{
          name: "TCP",
          bytes: 8,
          fields: {
            src: "100",
            dst: "200"
        }}]};

var errMsg = utils.validatePacket(p, function(err, packet){
  if(err){
    console.log(err);
  } else {

    console.log('valid packet');
    console.log(packet.protocols);
  }
});
