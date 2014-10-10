var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');

function validPacket(packet, cb){
  if(!packet.name){
    cb(msg.missingPacketName());
  } else if(typeof packet.name !== 'string'){
    cb(msg.invalidPacketName());
  } else if(!packet.bytes){
    cb(msg.missingBytes())
  } else if(typeof packet.bytes !== 'number'){
    cb(msg.invalidBytes());
  } else if(!packet.protocols){
    cb(msg.missingProtocols());
  }
  validateProtocolData(packet.protocols, cb);
}

function validateProtocolData(protocols, cb){
  _.each(protocols, function(protocol){
    if(!protocol.name){
      cb(msg.missingProtocolName());
    } else if(typeof protocol.name !== 'string'){
      cb(msg.invalidProtocolName());
    } else if(!protocol.bytes){
      cb(msg.missingProtocolBytes());
    } else if(typeof protocol.bytes !== 'number'){
      cb(msg.invalidProtocolBytes());
    } else if(!protocol.fields || protocol.fields.length === 0){
      cb(msg.missingProtocolFields());
    }
    validateFieldData(protocol.fields, cb);
  });
}

function validateFieldData(fields, cb){
  _.each(fields, function(field){
    if(typeof (_.pairs(field)[0][1]) !== 'string'){
      cb(msg.invalidFieldType());
    }
  })
}

exports.validPacket = validPacket;
