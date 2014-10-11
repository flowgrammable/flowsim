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
  } else {
    validateProtocolStructure(packet.protocols, cb);
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
  }
}

exports.validatePacket = validatePacket;
