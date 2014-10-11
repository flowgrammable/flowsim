var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');

function validatePacket(packet, cb){
  validateStructure(packet, function(err, result){
    if(err){
      cb(err);
    } else {
      validateProtocols(packet.protocols, function(err, result){
        if(err){
          cb(err);
        } else {
          cb(null, packet);
        }
      });
    }
  });
}


function validateStructure(packet, cb){
  if(!packet.name){
    cb(msg.missingPacketName());
  } else if(typeof packet.name !== 'string'){
    cb(msg.invalidPacketName());
  } else if(!packet.bytes){
    cb(msg.missingBytes());
  } else if(typeof packet.bytes !== 'number'){
    cb(msg.invalidBytes());
  } else if(!packet.protocols){
    cb(msg.missingProtocols());
  } else if(!validateProtocolStructure(packet.protocols, cb)){
    cb(null, packet);
  }
}

function validateProtocolStructure(protocols, cb){
  protocols.every(function(protocol){
    if(!protocol.name){
      cb(msg.missingProtocolName());
      return false;
    } else if(typeof protocol.name !== 'string'){
      cb(msg.invalidProtocolName());
      return false;
    } else if(!protocol.bytes){
      cb(msg.missingProtocolBytes());
      return false;
    } else if(typeof protocol.bytes !== 'number'){
      cb(msg.invalidProtocolBytes());
      return false;
    } else if(!protocol.fields || protocol.fields.length === 0){
      cb(msg.missingProtocolFields());
      return false;
    } else {
      return validateFieldStructure(protocol.fields, cb);
    }
  });
}

function validateFieldStructure(fields, cb){
  return fields.every(function(field){
    if(typeof _.pairs(field)[0][1] !== 'string'){
      cb(msg.invalidFieldType());
      return false;
    } else {
      return true;
    }
  });
}

function validateProtocols(protocols, cb){
  if(protocols[0].name !== 'Ethernet'){
    cb(msg.badProtocolSequence());
  } else{
    //handle protocol validation
    validateEthernet(protocols, cb);
  }
}

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;
function validMac(address){
  return macPattern.test(address);
}


var types = ["0x8100", "0x8847", "0x0806", "0x0800", "0x86dd"];
function validType(type){
  return types.indexOf(type) > -1;
}

function validateEthernet(protocols, cb){
  // need to check that all fields are present
  var bytes = protocols[0].bytes;
  var src = protocols[0].fields[0].Src;
  var dst = protocols[0].fields[1].Dst;
  var type = protocols[0].fields[2].Typelen;
  if(bytes != 14){
    cb(msg.badValue('ethernet bytes ' + bytes));
  }else if(!validMac(src)){
    cb(msg.badValue('Ethernet Src Address ' + src));
  } else if(!validMac(dst)){
    cb(msg.badValue('Ethernet Dst Address ' + dst));
  } else if(!validType(type)){
    cb(msg.badValue('Ethernet Typelen ' + type));
  }

}

exports.validatePacket = validatePacket;
