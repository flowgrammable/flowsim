var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');

var eth = require('./ethernet');

function validatePacket(packet, reqPacketName, cb){
  if(!packet.name){
    cb(msg.missingPacketName());
  } else if(typeof packet.name !== 'string'){
    cb(msg.invalidPacketName());
  } else if(packet.name.length < 2 ){
    cb(msg.badValue('Packet name must be atleast 2 chars'));
  } else if(packet.name !== reqPacketName){
    cb(msg.badValue('Packet url name must equal packet body name'));
  } else if(!packet.bytes){
    cb(msg.missingBytes());
  } else if(typeof packet.bytes !== 'number'){
    cb(msg.invalidBytes());
  } else if(!packet.protocols){
    cb(msg.missingProtocols());
  } else if(validateProtocolStructure(packet.protocols, cb)){
    validateProtocols(packet.protocols, cb);
  }
}

function validateProtocolStructure(protocols, cb){
   return protocols.every(function(protocol){
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
      cb(msg.invalidBytes());
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
  } else {
    eth.validate(protocols, cb);
  }
}

exports.validatePacket = validatePacket;
