'use strict';

angular.module('flowsimUiApp')
  .factory('VLAN', function(fgConstraints, fgUI, UInt, ETHERNET) {

var NAME = 'VLAN';
var BYTES = 4;

var Payloads = {
 'VLAN': 0x8100,
 'MPLS': 0x8847,
 'ARP':  0x0806,
 'IPv4': 0x0800,
 'IPv6': 0x86dd,
 'Payload': 0
};

function VLAN(vlan, pcp, dei, vid, type){
  if(_.isObject(vlan)){
    _.extend(this, vlan);
    this._pcp     = new UInt.UInt(vlan._pcp);
    this._dei     = new UInt.UInt(vlan._dei);
    this._vid     = new UInt.UInt(vlan._vid);
    this._type = new UInt.UInt(vlan._type);
  } else {
    this._pcp     = mkPcp(pcp);
    this._dei     = mkDei(dei);
    this._vid     = mkVid(vid);
    this._type = mkType(type);
  }
  this.bytes = BYTES;
  this.name = NAME;
}

function mkVLAN(pcp, dei, vid, type){
  return new VLAN(null, pcp, dei, vid, type);
}

VLAN.prototype.pcp = function(pcp){
  if(pcp) {
    if(pcp instanceof UInt.UInt){
      this._pcp = new UInt.UInt(pcp);
    } else {
      this._pcp = new UInt.UInt(null, pcp, 1);
    }
  } else {
    return this._pcp;
  }
};

function mkPcp(input){
  return new UInt.UInt(null, input, 1);
}

function mkPcpMatch(value, mask) {
  return new UInt.Match(null, mkPcp(value), mkPcp(mask));
}


VLAN.prototype.dei = function(dei){
  if(dei) {
    if(dei instanceof UInt.UInt){
      this._dei = new UInt.UInt(dei);
    } else {
      this._dei = new UInt.UInt(null, dei, 1);
    }
  } else {
    return this._dei;
  }
};

function mkDei(input){
  return new UInt.UInt(null, input, 1);
}

function mkDeiMatch(value, mask) {
  return new UInt.Match(null, mkDei(value), mkDei(mask));
}

VLAN.prototype.vid = function(vid){
  if(vid) {
    if(vid instanceof UInt.UInt){
      this._vid = new UInt.UInt(vid);
    } else {
      this._vid = new UInt.UInt(null, vid, 2);
    }
  } else {
    return this._vid;
  }
};

function mkVid(input){
  return new UInt.UInt(null, input, 2);
}

function mkVidMatch(value, mask) {
  return new UInt.Match(null, mkVid(value), mkVid(mask));
}

VLAN.prototype.type = function(type){
  if(type) {
    if(type instanceof UInt.UInt){
      this._type = new UInt.UInt(type);
    } else {
      this._type = new UInt.UInt(null, type, 2);
    }
  } else {
    return this._type;
  }
};

function mkType(input){
  return new UInt.UInt(null, input, 2);
}

function mkTypeMatch(value, mask) {
  return new UInt.Match(null, mkType(value), mkType(mask));
}

VLAN.prototype.insertHere = function(protocol) {
  if(protocol.name !== ETHERNET.name) {
    return true;
  } else {
    return false;
  }
};

VLAN.prototype.setDefaults = function(protocols, index) {
  if(protocols[index].name === this.name) {
    this._vid = protocols[index].vid();
    this._pcp = protocols[index].pcp();
    this._dei = mkDei();
    this._type = mkType('0x8100');
  } else {
    this._vid = mkVid();
    this._pcp = mkPcp();
    this._dei = mkDei();
    this._type = mkType(protocols[index-1].type().toString(16));
  }
};

VLAN.prototype.popHere = function(protocol){
  if(protocol.name === NAME){
    return true;
  }
  return false;
};

VLAN.prototype.setPayload = function(name){
  this._type = new UInt.UInt(null, Payloads[name], 2);
};

VLAN.prototype.clone = function() {
  return new VLAN(this);
};

VLAN.prototype.toString = function() {
  return 'pcp: '+this._pcp.toString(16)+'\n'+
         'dei: '+this._dei.toString(16)+'\n'+
         'vid: '+this._vid.toString(16)+'\n'+
         'type: '+this._type.toString(16);
};

var TIPS = {
  pcp: 'VLAN Priority Code Point',
  dei: '',
  vid: 'VLAN Tag Identifier',
  type: 'Ethernet type or length of payload'
};

var TESTS = {
  pcp: UInt.is(3),
  dei: UInt.is(1),
  vid: UInt.is(12),
  type: UInt.is(16)
};


function VLAN_UI(vlan) {
  vlan = vlan ? new VLAN(vlan) : new VLAN();
  this.name = NAME;
  this.bytes = vlan.bytes;
  this.attrs = [{
    name: 'PCP',
    value: vlan.pcp().toString(16),
    test: TESTS.pcp,
    tip: TIPS.pcp
  },{
    name: 'DEI',
    value: vlan.dei().toString(16),
    test: TESTS.dei,
    tip: TIPS.dei
  },{
    name: 'VID',
    value: vlan.vid().toString(16),
    test: TESTS.vid,
    tip: TIPS.vid
  },{
    name: 'Typelen',
    value: vlan.type().toString(16),
    test: TESTS.type,
    tip: TIPS.type
  }];
}

VLAN_UI.prototype.toBase = function() {
  return new VLAN(null, this.attrs[0].value, this.attrs[1].value,
      this.attrs[2].value, this.attrs[3].value);
};

VLAN_UI.prototype.setPayload = function(name) {
  this.attrs[3].value = '0x' + (Payloads[name] || 0).toString(16);
};

VLAN_UI.prototype.clearPayload = function() {
  this.attrs[3].value = '0x0000';
};

return {
  name:           NAME,
  VLAN:           VLAN,
  pcp:            '_pcp',
  dei:            '_dei',
  vid:            '_vid',
  type:           '_type',
  mkVLAN:         mkVLAN,
  mkPcp:          mkPcp,
  mkPcpMatch:     mkPcpMatch,
  mkDei:          mkDei,
  mkDeiMatch:     mkDeiMatch,
  mkVid:          mkVid,
  mkVidMatch:     mkVidMatch,
  mkType:         mkType,
  mkTypeMatch: mkTypeMatch,
  VLAN_UI:        VLAN_UI,
  create:         function(vlan) { return new VLAN(vlan); },
  createUI:       function(vlan) { return new VLAN_UI(vlan); },
  Payloads:       Object.keys(Payloads),
  TESTS:          TESTS,
  TIPS:           TIPS
};

});
