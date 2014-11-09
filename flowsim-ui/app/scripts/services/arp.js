'use strict';

angular.module('flowsimUiApp')
  .factory('ARP', function ARP(fgConstraints, fgUI, ETHERNET, IPV4, UInt) {

var NAME = 'ARP';

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;
var ipv4Pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

function isMAC(addr) {
  return macPattern.test(addr);
}

function isIPv4(ipv4) {
  return ipv4Pattern.test(ipv4) &&
         _.every(ipv4.split('.'), fgConstraints.isUInt(0, 255));
}

function ARP(arp, opcode, sha, spa, tha, tpa){
  this.bytes = 28;
  this.name = NAME;
  if(arp instanceof ARP || _.isObject(arp)){
    _.extend(this, arp);
    this._opcode  = new UInt.UInt(arp._opcode, 2);
    this._sha     = new ARP.MAC(arp._sha);
    this._spa     = new ARP.IP(arp._spa);
    this._tha     = new ARP.MAC(arp._tha);
    this._tpa     = new ARP.IP(arp._tpa);
  } else {
    this._opcode  = new UInt.UInt(opcode, 2);
    this._sha     = new ARP.MAC(sha);
    this._spa     = new ARP.IP(spa);
    this._tha     = new ARP.MAC(tha);
    this._tpa     = new ARP.IP(tpa);
  }
}

ARP.Opcode = UInt.UInt;
ARP.Opcode.Match = UInt.UInt.Match;
ARP.MAC = ETHERNET.MAC;
ARP.MAC.Match = ETHERNET.MAC.Match;
ARP.IP = IPV4;

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


var Payloads = {
  'Payload': 0x0000
};

return {
  name:     NAME,
  ARP:      ARP,
  ARP_UI:   ARP_UI,
  create:   function(arp)   { return new ARP(arp); },
  createUI: function(arp)   { return new ARP_UI(arp); },
  Payloads: Object.keys(Payloads)
};

});
