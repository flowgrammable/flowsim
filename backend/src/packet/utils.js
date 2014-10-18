var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');

var eth = require('./ethernet');
var ip4 = require('./ipv4');
var tcp = require('./tcp');

function validatePacket(reqBody, cb){
  var packet = {};
  if(!reqBody.name){
    cb(msg.missingPacketName());
  } else if(typeof reqBody.name !== 'string'){
    cb(msg.invalidPacketName());
  } else if(reqBody.name.length < 2 ){
    cb(msg.badValue('Packet name must be atleast 2 chars'));
  } else if(!reqBody.bytes){
    cb(msg.missingBytes());
  } else if(typeof reqBody.bytes !== 'number'){
    cb(msg.invalidBytes());
  } else if(!reqBody.protocols){
    cb(msg.missingProtocols());
  } else {
    packet.name = reqBody.name;
    packet.bytes = reqBody.bytes;
    packet.protocols = [];
    validateProtocol(reqBody, packet, cb);
  }
}

function validateProtocol(reqBody, packet, cb){
  var validProto = {name: '', bytes: 0, fields:[]};
  var errMsg;
  errMsg = validateProtoHeader(reqBody.protocols[0], validProto, packet);
  if(errMsg){
    cb(errMsg);
  } else {
    errMsg = validateProtoFields(reqBody.protocols[0].fields, validProto);
    if(errMsg){
      cb(errMsg);
    } else {
      packet.protocols.push(validProto);
      reqBody.protocols.shift();
      if(reqBody.protocols.length >= 1){
        validateProtocol(reqBody, packet, cb);
      } else {
        cb(null, packet);
      }
    }
  }

}

function validSequence(protoName, packet){
  if(packet.protocols.length >= 1){
  var previousProtocolIndex = packet.protocols.length - 1;
  var previousProtocol = packet.protocols[previousProtocolIndex].name;
  return protocols[previousProtocol].sequence.indexOf(protoName) > -1;
  }
  return true;
}

function validateProtoHeader(proto, validProto, packet){
  var protoCheck = protocols[proto.name];
  if(typeof protoCheck === 'undefined'){
    return msg.badValue(proto.name + ' is not a valid protocol');
  } else if(!proto.name){
    return msg.missingprotocolName();
  } else if(typeof proto.name !== 'string'){
    return msg.invalidProtocolName();
  } else if(packet.protocols.length === 0 && proto.name !== 'Ethernet'){
    return msg.badProtocolSequence('First protocol must be Ethernet');
  } else if(!validSequence(proto.name, packet)){
    var seqMsg = 'Protocol['+packet.protocols.length+'] must be one of the following: ' +
    protocols[packet.protocols[packet.protocols.length - 1].name].sequence;
    return msg.badProtocolSequence(seqMsg);
  } else if(!proto.bytes){
    return msg.missingProtocolBytes(proto.name);
  } else if(typeof proto.bytes !== 'number'){
    return msg.invalidProtocolBytes(proto.name);
  } else if(!proto.fields){
    return msg.missingProtocolsFields(proto.name);
  } else if(typeof proto.fields !== 'object'){
    return msg.invalidProtocolFields(proto.name);
  } else if(_.size(proto.fields) !== _.size(protoCheck.fields)){
    return msg.missingProtocolNumber(protoName, _.size(protoCheck.fields));
  } else if(proto.bytes !== protoCheck.bytes){
    return msg.badValue('Protocol bytes for ' + proto.name + ' must be '+protoCheck.bytes );
  } else {
    validProto.name = proto.name;
    validProto.bytes = proto.bytes;
    return false;
  }
}


function validateProtoFields(reqBodyFields, validProto){
  var fieldCheck = protocols[validProto.name].fields;
  var fieldErrMsg;
  validProto.fields = {};
  for (var field in fieldCheck){
    if(!reqBodyFields[field]){
      fieldErrMsg = msg.missingField(validProto.name, field);
      break;
    } else if(typeof reqBodyFields[field] !== 'string'){
      fieldErrMsg = msg.invalidFieldType(validProto.name, field);
      break;
    } else if(!fieldCheck[field](reqBodyFields[field])){
      fieldErrMsg = msg.badValue(validProto.name + ' ' + field +' field' +
      'has a bad value');
      break;
    }
    validProto.fields[field] = reqBodyFields[field];
  }
  return fieldErrMsg;
}

var protocols = {
    'Ethernet':eth.ethernet(),
    'IPv4': ip4.ipv4(),
    'TCP': tcp.tcp()
};

exports.validatePacket = validatePacket;
