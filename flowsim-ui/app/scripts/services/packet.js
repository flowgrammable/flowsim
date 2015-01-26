'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */

angular.module('flowsimUiApp')
  .factory('Packet', function(Ethernet, Protocols, UInt, Errors) {

function createProtocol(proto){
  var noProto;
  if(_(proto).isString()){
    noProto = _(Protocols.Protocols).find(function(protocol){
      return protocol.name === proto;
    });
    noProto = noProto.clone();
    return new Protocol(null, noProto.name, noProto.bytes, noProto.fields);
  } else {
    return new Protocol(proto);
  }
}

function Protocol(proto, name, bytes, fields){
  if(_.isObject(proto)){
    _.extend(this, proto);
    this.fields = _(proto.fields).map(function(f){
      var field = new Field(f);
      field.getFieldUtils(this.name);
      return field;
    },this);
  } else {
    this.name = name;
    this.bytes = bytes;
    this.fields = _(fields).map(function(f){
      var field = new Field(null, f.name);
      field.getFieldUtils(this.name);
      field.mkDefaultValue();
      return field;
    }, this);
  }
}

Protocol.prototype.getProtoUtils = function(){
  // set field utils
  _(this.fields).every(function(field){
    field.getFieldUtils(this.name);
  }, this);
  //
  var noProtoUtils = Protocols.getProtocol(this.name);
  this.pushable = noProtoUtils.pushable;
  this.popable = noProtoUtils.popable;
};

Protocol.prototype.setField = function(fieldName, value){
  var field = this.getField(fieldName);
  field.setValue(value);
};

Protocol.prototype.getField = function(fieldName){
  return _(this.fields).findWhere({name: fieldName});
};

Protocol.prototype.clone = function(){
  return new Protocol(this);
};

Protocol.prototype.toBase = function(){
  return {
    name: this.name,
    bytes: this.bytes,
    fields: _(this.fields).map(function(field){
      return field.toBase();
    })
  };
};

Protocol.prototype.toView = function(){
  return {
    name: this.name,
    bytes: this.bytes,
    fields: _(this.fields).map(function(field){
      return field.toView();
    })
  };
};

function Field(fld, name){
  if(_.isObject(fld)){
    _.extend(this, fld);
    this.value = new UInt.UInt(fld.value);
  } else {
    this.name = name;
    this.value = '';
  }
}

Field.prototype.valueToString = function(){
    return this.dispStr(this.value.value);
};

Field.prototype.getFieldUtils = function(protoName){
  var noProtoField = Protocols.getField(protoName, this.name);
  this.bitwidth = noProtoField.bitwidth;
  this.dispStr = noProtoField.dispStr;
  this.consStr = noProtoField.consStr;
  this.testStr = noProtoField.testStr;
  this.tip = noProtoField.tip;
  this.payloadField = noProtoField.payloadField;
};

Field.prototype.mkDefaultValue = function(){
  this.value = new UInt.UInt(null, 0, Math.ceil(this.bitwidth/8));
};

Field.prototype.setValue = function(value){
  if(_.isString(value)){
    value = this.consStr(value);
    this.value.value = value;
  } else if(_.isObject(value)) {
    this.value = value;
  } else {
    throw 'Bad field value format ' + value;
  }
};

Field.prototype.toBase = function(){
  return {
    name: this.name,
    value: this.value
  };
};

Field.prototype.toView = function(){
  return {
    name: this.name,
    value: this.valueToString()
  };
};

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
    this.bytes = this.protocols[0].bytes;
  }
}

Packet.prototype.setField = function(protoName, fieldName, value){
  //TODO rework
  var field = this.getField(protoName, fieldName);
  if(_.isString(value)){
    value = Protocols.mkFieldUInt(protoName, fieldName, value);
  }
  field.value = value;
};

Packet.prototype.getField = function(protoName, fieldName){
  var proto, field;
  proto = _(this.protocols).find(function(proto){
    return protoName === proto.name;
  });
  if(!proto){
    throw Errors.missingProtocol(protoName);
  }
  field = _(proto.fields).find(function(field){
    return fieldName === field.name;
  });
  if(!field){
    throw Errors.missingField(protoName, fieldName);
  }
  return field;
};

// Gets number of protoName in packet
Packet.prototype.getActiveProtos = function(protoName){
  return _(this.protocols).filter(function(proto){
    return proto.name === protoName;
  }).length;
};

function pushVLAN(packet, actVTags){
  // TODO rework ugly
  var vlanTag;
  if(actVTags){
    vlanTag = packet.protocols[1].clone();
    packet.insertProtocol(vlanTag, 1);
  } else {
    vlanTag = createProtocol('VLAN');
    // set vlan tag type value
    vlanTag.setField('Type',packet.protocols[0].fields[2].value);
    // set eth to vlan value
    packet.protocols[0].fields[2].setValue('0x8100');
    packet.insertProtocol(vlanTag, 1);
  }
}

function pushMPLS(packet, actVTags, actMTags){
  // TODO rework ugly
  var mplsTag;
  if(actMTags){
    mplsTag = packet.protocols[1+actVTags].clone();
    packet.insertProtocol(mplsTag, 1+actVTags);
  } else {
    mplsTag = createProtocol('MPLS');
    var priorval = Protocols.mkFieldUInt('Ethernet', 'Type', '0x8847');
    packet.protocols[actVTags].fields[2].value = priorval;
    packet.insertProtocol(mplsTag, actVTags+1);
  }
}

Packet.prototype.pushTag = function(protoName){
  // FIXME  rework all of this...to pushField
  // Determine if tag already exists
  var activeVTags = this.getActiveProtos('VLAN');
  var activeMTags = this.getActiveProtos('MPLS');
  switch(protoName){
    case 'VLAN':
      pushVLAN(this, activeVTags);
      break;
    case 'MPLS':
      pushMPLS(this, activeVTags, activeMTags);
      break;
    default:
      break;
  }
};

Packet.prototype.popTag = function(protoName){
  var activeTags = this.getActiveProtos(protoName);
  if(!activeTags){
    throw Errors.missingProtocol(protoName);
  }
  if(protoName === 'VLAN'){
    // set ethernet type field to vlan type field
    this.setField('Ethernet', 'Type', this.protocols[1].fields[2].value);
    // remove outer vlan tag
    this.protocols.splice(1, 1);
  }
  if(protoName === 'MPLS'){
    // if vlan tags present
    var activeVTags = this.getActiveProtos('VLAN');
    this.protocols.splice(activeVTags + 1,1);
    // If only a single mpls tag, then set vlan/eth type field
    if(activeTags === 1 && this.protocols.length > activeVTags + 1){
      var nextProtoName = this.protocols[activeVTags + 1].name;
      var pack = _.invert(Protocols.Payloads.Ethernet.Type)[nextProtoName];
      this.protocols[activeVTags].fields[2].value = Protocols.mkFieldUInt('Ethernet', 'Type', pack);
    }
    // a packet with multiple mpls fields do not need to update vlan/eth type field 
  }
};

Packet.prototype.insertProtocol = function(proto, idx){
    this.protocols.splice(idx, 0, proto);
};

Packet.prototype.popProtocol = function() {
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
Packet.prototype.pushProtocol = function(protoValue) {
  if(!protoValue){
    return;
  }
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
  if(!newProtoname){
    throw 'Invalid protocol value: ' + protoValue;
  }
  var newProto = createProtocol(newProtoname);
  newProto.getProtoUtils();
  this.protocols.push(newProto);
  this.bytes += newProto.bytes;
};

Packet.prototype.decField = function(protoName, fieldName){
  var field = this.getField(protoName, fieldName);
  if(field.value.value === 0){
    throw 'Cannot Dec Field value 0';
  }
  field.value.subt(new UInt.UInt(null, 1, Math.ceil(field.bitwidth/8)));
};

// Copies TTL outermost to next outermost
// MPLS -> MPLS
// MPLS -> IPv4
// MPLS -> IPv6
// TODO: rework to copyFieldIn
Packet.prototype.copyTTLIn = function(protoName){
  var indx = this.indexOf(protoName);
  if(indx === -1){
    throw Errors.missingProtocol(protoName);
  }
  if(indx+1 === this.protocols.length){
    throw 'Not enough fields to copy into';
  }
  var ttlValue = this.getField(protoName, 'TTL').value;
  var nextProto = this.protocols[indx+1];
  switch(nextProto.name){
    case 'MPLS':
      nextProto.setField('TTL', ttlValue);
      break;
    case 'IPv4':
      nextProto.setField('TTL', ttlValue);
      break;
    case 'IPv6':
      nextProto.setField('TTL', ttlValue);
      break;
    default:
      throw 'Cannot copy TTL to :' + nextProto.name;
  }
};

// Copies TTL innermost to next innermost
// MPLS <- MPLS
// MPLS <- IPv4
// MPLS <- IPv6
// TODO: rework to copyFieldOut
Packet.prototype.copyTTLOut = function(protoName){
  var lstIndx = this.lastIndexOf(protoName);
  if(lstIndx === -1){
    throw Errors.missingProtocol(protoName);
  }
  var ttlValue = this.protocols[lstIndx].getField('TTL').value;
  var nextProto = this.protocols[lstIndx-1];
  switch(nextProto.name){
    case 'MPLS':
      nextProto.setField('TTL', ttlValue);
      break;
    case 'IPv4':
      nextProto.setField('TTL', ttlValue);
      break;
    case 'IPv6':
      nextProto.setField('TTL', ttlValue);
      break;
    default:
      throw 'Cannot copy TTL to :' + nextProto.name;
  }
};

// Finds index of first occurance of proto
Packet.prototype.indexOf = function(protoName){
  return _.indexOf(this.protocols, _(this.protocols)
          .find(function(proto){
            return protoName === proto.name;
          }));
};

// Finds index of last occurance of proto
Packet.prototype.lastIndexOf = function(protoName){
  var activeProtos = this.getActiveProtos(protoName);
  var idx = this.indexOf(protoName);
  if(activeProtos < 2){
    return idx;
  } else {
    return idx + (activeProtos - 1);
  }
};

Packet.prototype.clone = function(){
  return new Packet(this);
};

Packet.prototype.toBase = function(){
  return {
    name: this.name,
    bytes: this.bytes,
    protocols: _(this.protocols).map(function(proto){
      return proto.toBase();
    }, this)
  };
};

Packet.prototype.toView = function(){
  return {
    name: this.name,
    bytes: this.bytes,
    protocols: _(this.protocols).map(function(proto){
      return proto.toView();
    })
  };
};

function createUI(pkt){
  return new Packet(pkt);
}

return {
  createUI: createUI,
  Packet: Packet,
  Field: Field,
  Protocol: Protocol,
  createProtocol: createProtocol
};

});
