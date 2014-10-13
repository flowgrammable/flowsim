
function validEcn(ecn){
  return true;
}

function validDscp(dscp){
  return true;
}

function validate(protocols, cb){
  var ipv4 = protocols[0];
  protocols.shift();
  if(ipv4.bytes !== 20){
    cb(msg.badValue('IPv4 Bytes'));
  } else if(!ipv4.fields[0].dscp){
    cb(msg.missingField('ipv4 dscp'));
  } else if(!validDscp(ipv4.fields[0].dscp)){
    cb(msg.badValue('IPv4 dscp'));
  } else if(!ipv4.fields[1].ecn){
    cb(msg.missingField('IPv4 ecn'));
  } else if(!validEcn(ipv4.fields[1].ecn)){
    cb(msg.badValue('IPv4 ecn'));
  } else if(!ipv4.fields[2].proto){
    cb(msg.missingField('IPv4 proto'));
  } else if(!validProto(ipv4.fields[2].proto)){
    cb(msg.badValue('IPv4 Proto'));
  } else if(!ipv4.fields[3].src){
    cb(msg.missingField('IPv4 Source'));
  } else if(!validIP(ipv4.fields[3].src)){
    cb(msg.badValue('IPv4 Source'));
  } else if(!ipv4.fields[4].dst){
    cb(msg.missingField('IPv4 Dst'));
  } else if(!validIP(ipv4.fields[4].dst)){
    cb(msg.badValue('IPv4 Destination'));
  } else if(protocols.length >= 1){
    switch(protocols[0].name){
      case 'TCP':
        tcp.validate(protocols, cb);
        break;
      default:
        cb(msg.badProtocolSequence(sequenceMessage));
        break;
    }
  } else {
    cb(null, msg.success());
  }
}
exports.validate = validate;
