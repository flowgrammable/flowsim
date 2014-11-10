'use strict';

angular.module('flowsimUiApp')
  .factory('VLAN', function VLAN(fgConstraints, fgUI, UInt) {

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

function Vlan(vlan, pcp, dei, vid, typelen){
  if(_.isObject(vlan)){
    _.extend(this, vlan);
    this._pcp     = new UInt.UInt(vlan._pcp);
    this._dei     = new UInt.UInt(vlan._dei);
    this._vid     = new UInt.UInt(vlan._vid);
    this._typelen = new UInt.UInt(vlan._typelen);
  } else {
    this._pcp     = new UInt.UInt(pcp);
    this._dei     = new UInt.UInt(dei);
    this._vid     = new UInt.UInt(vid);
    this._typelen = new UInt.UInt(typelen);
  }
  this.bytes = BYTES;
  this.name = NAME;
}

function mkVLAN(pcp, dei, vid, typelen){
  return new Vlan(null, pcp, dei, vid, typelen);
}

Vlan.prototype.pcp = function(pcp){
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


Vlan.prototype.dei = function(dei){
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

Vlan.prototype.vid = function(vid){
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

Vlan.prototype.typelen = function(typelen){
  if(typelen) {
    if(typelen instanceof UInt.UInt){
      this._typelen = new UInt.UInt(typelen);
    } else {
      this._typelen = new UInt.UInt(null, typelen, 2);
    }
  } else {
    return this._typelen;
  }
};

function mkTypelen(input){
  return new UInt.UInt(null, input, 2);
}

function mkTypelenMatch(value, mask) {
  return new UInt.Match(null, mkTypelen(value), mkTypelen(mask));
}

var TIPS = {
  pcp: 'VLAN Priority Code Point',
  dei: '',
  vid: 'VLAN Tag Identifier',
  typelen: 'Ethernet type or length of payload'
};

var TESTS = {
  pcp: UInt.is(3),
  dei: UInt.is(1),
  vid: UInt.is(12),
  typelen: UInt.is(16)
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
    value: vlan.typelen().toString(16),
    test: TESTS.typelen,
    tip: TIPS.typelen
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
  VLAN:           Vlan,
  pcp:            '_pcp',
  dei:            '_dei',
  vid:            '_vid',
  typelen:        '_typelen',
  mkVLAN:         mkVLAN,
  mkPcp:          mkPcp,
  mkPcpMatch:     mkPcpMatch,
  mkDei:          mkDei,
  mkDeiMatch:     mkDeiMatch,
  mkVid:          mkVid,
  mkVidMatch:     mkVidMatch,
  mkTypelenMatch: mkTypelenMatch,
  VLAN_UI:        VLAN_UI,
  create:         function(vlan) { return new Vlan(vlan); },
  createUI:       function(vlan) { return new VLAN_UI(vlan); },
  Payloads:       Object.keys(Payloads),
  TESTS:          TESTS,
  TIPS:           TIPS
};

});
