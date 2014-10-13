var msg = require('./msg');
var ipv4 = require('./ipv4');

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;
function validMac(address){
  return macPattern.test(address);
}


var types = ["0x8100", "0x8847", "0x0806", "0x0800", "0x86dd"];
function validType(type){
  return types.indexOf(type) > -1;
}

var sequenceMessage = 'Ethernet must be followed by one of the following ' +
                      'VLAN, MPLS, ARP, IPv4, IPv6';

function validate(protocols, cb){
  // need to check that all fields are present
  var ethernet = protocols[0];
  protocols.shift();
  console.log('after shift');
  console.log('ethernet', ethernet);
  if(ethernet.bytes != 14){
    cb(msg.badValue('Ethernet Bytes'));
  } else if(!ethernet.fields[0].Src){
    cb(msg.missingField('Ethernet Src'));
  } else if(!validMac(ethernet.fields[0].Src)){
    cb(msg.badValue('Ethernet Src Address'));
  } else if(!ethernet.fields[1].Dst){
    cb(msg.missingField('Ethernet Dst'));
  } else if(!validMac(ethernet.fields[1].Dst)){
    cb(msg.badValue('Ethernet Dst Address'));
  } else if(!ethernet.fields[2].Typelen){
    cb(msg.missingField('Ethernet Typelen'));
  } else if(!validType(ethernet.fields[2].Typelen)){
    cb(msg.badValue('Ethernet Typelen'));
  } else if(protocols.length >= 1){
    console.log('in last elef');
    switch(protocols[1].name){
      case 'VLAN':
        vlan.validate(protocols, cb);
        break;
      case 'MPLS':
        mpls.validate(protocols, cb);
        break;
      case 'ARP':
        arp.validate(protocols, cb);
        break;
      case 'IPv4':
        ipv4.validate(protocols, cb);
        break;
      case 'IPv6':
        ipv6.validate(protocols, cb);
        break;
        default:
          cb(msg.badProtocolSequence(sequenceMessage));
          break;
    }
  } else {
    console.log('hit callback');
    cb(null, msg.success());
  }

}

exports.validate = validate;
