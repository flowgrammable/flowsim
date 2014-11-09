'use strict';

angular.module('flowsimUiApp')
  .factory('ARP', function ARP(fgConstraints, fgUI, ETHERNET, IPV4, UInt) {

var NAME = 'ARP';
var BYTES = 28;

var Payloads = {
  'Payload': 0x0000
};

function ARP(arp, opcode, sha, spa, tha, tpa){
  if(_.isObject(arp)){
    _.extend(this, arp);
    this._opcode  = new UInt.UInt(arp._opcode);
    this._sha     = new ARP.MAC(arp._sha);
    this._spa     = new ARP.IP(arp._spa);
    this._tha     = new ARP.MAC(arp._tha);
    this._tpa     = new ARP.IP(arp._tpa);
  } else {
    this._opcode  = new UInt.UInt(null, opcode, 2);
    this._sha     = new ETHERNET.mkMAC(sha);
    this._spa     = new ARP.IP(spa);
    this._tha     = new ETHERNET.mkMAC(tha);
    this._tpa     = new ARP.IP(tpa);
  }
  this.bytes = BYTES;
  this.name = NAME;
}

ARP.Opcode = UInt.UInt;
ARP.Opcode.Match = UInt.Match;
ARP.MAC = ETHERNET.MAC;
ARP.MAC.Match = ETHERNET.MAC.Match;
ARP.IP = IPV4.IP;
ARP.IP.Match = IPV4.IP.Match;

ARP.prototype.opcode = function(opcode) {
  if(opcode) {
    this._opcode = new UInt.UInt(opcode);
  } else {
    return this._opcode;
  }
};

ARP.prototype.sha = function(sha) {
  if(src) {
    this._sha = new ARP.MAC(sha);
  } else {
    return this._sha;
  }
};

ARP.prototype.spa = function(spa) {
  if(src) {
    this._spa = new ARP.IP(spa);
  } else {
    return this._spa;
  }
};

ARP.prototype.tha = function(tha) {
  if(tha) {
    this._tha = new ARP.MAC(tha)
  } else {
    return this._tha;
  }
};

ARP.prototype.tpa = function(tpa) {
  if(tpa) {
    this._tpa = new ARP.IP(tpa);
  } else {
    return this._tpa;
  }
};

var TIPS = {
  opcode: 'ARP Message Type',
  sha: 'Source Hardware Address',
  spa: 'Source Protocol Aaddress',
  tha: 'Target Hardware Address',
  tpa: 'Target Protocol Address'
};

var TESTS = {
  opcode: UInt.is(2),
  sha: ETHERNET.MAC.is,
  spa: IPV4.IP.is,
  tha: ETHERNET.MAC.is,
  tpa: IPV4.IP.is
};

var opPattern = /^[1-2]$/;


/* ARP.Opcode.Match = function(opcode){
  if(opcode instanceof ARP.Opcode.Match || _.isObject(opcode)){
    this._opcode = new ARP.Opcode(opcode);
  } else {
    this._opcode =
  }
} */

/*function ARP() {
  this.name = NAME;
  this.bytes = 28;
  this.fields = {
    opcode: 0,
    sha: '00:00:00:00:00:00',
    spa: '0.0.0.0',
    tha: '00:00:00:00:00:00',
    tpa: '0.0.0.0'
  };
} */

function ARP_UI(arp) {
  arp = arp === undefined ? new ARP() : arp;
  this.name = NAME;
  this.bytes = arp.bytes;
  this.attrs = _.map(arp.fields, function(value, key) {
    switch(key){
      case 'opcode':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(1,2),
          tip: 'ARP message type'
        };
      case 'sha':
        return {
          name: key,
          value: value,
          test: isMAC,
          tip: 'Source hardware address'
        };
      case 'spa':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Source Protocol Address'
        };
      case 'tha':
        return {
          name: key,
          value: value,
          test: isMAC,
          tip: 'Target hardware address'
        };
      case 'tpa':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Target protocol address'
        };
      default:
        return {
          name: key,
          value: value,
          test: function() { return true; },
          tip: 'Unknown'
        };
    }
  });
}

ARP_UI.prototype.toBase = function() {
  var result = new ARP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

ARP_UI.prototype.setPayload = function() {

};




return {
  name:       NAME,
  ARP:        ARP,
  ARP_UI:     ARP_UI,
  create:     function(arp)   { return new ARP(arp); },
  createUI:   function(arp)   { return new ARP_UI(arp); },
  Payloads:   Object.keys(Payloads),
  TESTS:      TESTS,
  TIPS:       TIPS
};

});
