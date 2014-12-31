'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */

angular.module('flowsimUiApp')
  .factory('Packet', function(Ethernet, Protocols, Noproto, UInt) {

function createProtocol(proto){
  var tmp;
  // if new proto build from string, else build from json
  if(_(proto).isString()){
    tmp = _(Protocols.Protocols).find(function(protocol){
      return protocol.name === proto;
    });
    // Clone Noproto protocol and get packet data
    return tmp.clone().getProtocol();
  } else {
    tmp = _(Protocols.Protocols).find(function(protocol){
      return protocol.name === proto.name;
    });
    return tmp.clone().getProtocol(proto.fields);
  }
}

function Packet(pkt) {
  if(_(pkt).isObject()){
    this.name = pkt.name;
    this.bytes = pkt.bytes;
    this.protocols = _(pkt.protocols).map(function(proto){
      return createProtocol(proto);
    }, this);
  } else {
    this.name = pkt;
    this.protocols = [
     createProtocol(Ethernet.Ethernet.name)
    ];
    this.bytes = Ethernet.bytes;
  }
}

Packet.prototype.toBase = function() {
  return this;
}

Packet.prototype.popPayload = function() {
  if(this.protocols.length === 0){
    return;
  }
  this.bytes -= this.protocols[this.protocols.length-1].bytes;
  this.protocols.splice(this.protocols.length-1);

  // Find payload field of last protocol
  var lastProtocol = _(this.protocols).last();
  // find payload field if any
  var payloadField = _(lastProtocol.fields).find(function(field){
    return field.payloadField;
  });
  // if last protocol has a payload field, zero it out
  if(payloadField){
    payloadField.value = new UInt.UInt(null, 0, Math.floor(payloadField.bitwidth/8));
  }
}

// 1. Sets payload type of last protocol in packet
// 2. adds new protocol to packet
// TODO: break this up
Packet.prototype.pushPayload = function(protoValue) {
  // get last protocol in protocols[]
  var lastProtocol = _(this.protocols).last();
  // find field that indicates payload
  var payloadField = _(lastProtocol.fields).find(function(field){
    return field.payloadField;
  });
  // if field is found then set payload
  if(payloadField){
    payloadField.value = new UInt.UInt(null, protoValue, Math.floor(payloadField.bitwidth/8));
  }
  // Find new protocol
  var newProtoname = _.values(Protocols.Payloads[lastProtocol.name])[0][protoValue];

  // if new proto found then create and push new protocol
  if(newProtoname){
  var newProto = _(Protocols.Protocols).find(function(proto){
    // Get payload type
    return newProtoname === proto.name;
  });
  newProto = newProto.clone().getProtocol();
  this.protocols.push(newProto);
  this.bytes += newProto.bytes;
  } else {
    throw 'Cant add proto: ' + protoValue;
  }
}

function createUI(pkt){
  return new Packet(pkt);
}

return {
  createUI: createUI
};

});
