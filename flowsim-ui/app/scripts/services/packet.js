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
  var noProto;
  if(_(proto).isString()){
    noProto = _(Protocols.Protocols).find(function(protocol){
      return protocol.name === proto;
    });
    noProto = noProto.clone();
    return new Protocol(null, noProto.name, noProto.bytes, noProto.fields);
  } else {
    noProto = _(Protocols.Protocols).find(function(protocol){
      return protocol.name === proto.name;
    });
    noProto = noProto.clone();
    _(noProto.fields).each(function(field){
      field.value = proto.fields.shift().value;
    });
    return new Protocol(noProto);
  }
}

function Protocol(proto, name, bytes, fields){
  if(_.isObject(proto)){
    _.extend(this, proto);
    this.fields = _(proto.fields).map(function(f){
      return new Field(f);
    },this);
  } else {
    this.name = name;
    this.bytes = bytes;
    this.fields = _(fields).map(function(f){
      return new Field(null, f.name, f.bitwidth, f.payloadField);
    }, this);
  }
}

function Field(fld, name, bitwidth, payloadField){
  if(_.isObject(fld)){
    _.extend(this, fld);
    this.value = new UInt.UInt(fld.value);
  } else {
    this.name = name;
    this.bitwidth = bitwidth;
    this.payloadField = payloadField;
    this.value = new UInt.UInt(null, 0, Math.ceil(bitwidth/8));
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

Packet.prototype.popPayload = function() {
  if(this.protocols.length === 1){
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
    payloadField.value = new UInt.UInt(null, 0, Math.ceil(payloadField.bitwidth/8));
  }
};

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
    payloadField.value = new UInt.UInt(null, protoValue, Math.ceil(payloadField.bitwidth/8));
  }
  // Find new protocol
  var newProtoname = _.values(Protocols.Payloads[lastProtocol.name])[0][protoValue];
  var newProto = createProtocol(newProtoname);
  this.protocols.push(newProto);
  this.bytes += newProto.bytes;
};

Packet.prototype.clone = function(){
  return new Packet(this);
};

Packet.prototype.toBase = function(){
  return this;
};

Packet.prototype.toView = function(){

};

function createUI(pkt){
  return new Packet(pkt);
}

return {
  createUI: createUI,
  Packet: Packet,
  Field: Field,
  Protocol: Protocol
};

});
