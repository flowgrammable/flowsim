'use strict';

angular.module('flowsimUiApp')
  .factory('ARP', function(fgConstraints, fgUI, ETHERNET, IPV4, UInt) {

var NAME = 'ARP';
var BYTES = 28;

var Payloads = {
  'Payload': 0x0000
};

function ARP(arp, opcode, sha, spa, tha, tpa){
  if(_.isObject(arp)){
    this._opcode  = new UInt.UInt(arp._opcode);
    this._sha     = new ETHERNET.MAC(arp._sha);
    this._spa     = new IPV4.Address(arp._spa);
    this._tha     = new ETHERNET.MAC(arp._tha);
    this._tpa     = new IPV4.Address(arp._tpa);
  } else {
    this._opcode  = mkOpcode(opcode);
    this._sha     = ETHERNET.mkMAC(sha);
    this._spa     = IPV4.mkAddress(spa);
    this._tha     = ETHERNET.mkMAC(tha);
    this._tpa     = IPV4.mkAddress(tpa);
  }
  this.bytes = BYTES;
  this.name = NAME;
}

ARP.Opcode = UInt.UInt;
ARP.Opcode.Match = UInt.Match;
ARP.MAC = ETHERNET.MAC;
ARP.MAC.Match = ETHERNET.MAC.Match;


function mkARP(opcode, sha, spa, tha, tpa) {
  return new ARP(null, opcode, sha, spa, tha, tpa);
}

ARP.prototype.clone = function() {
  return new ARP(this);
};

ARP.prototype.opcode = function(opcode) {
  if(opcode) {
    if(opcode instanceof UInt.UInt){
      this._opcode = new UInt.UInt(opcode);
    } else {
      this._opcode = new UInt.UInt(null, opcode, 2);
    }
  } else {
    return this._opcode;
  }
};

function mkOpcode(op){
  return new UInt.UInt(null, op, 2);
}

function mkOpcodeMatch(value, mask) {
  var tmp = new UInt.Match(null, mkOpcode(value), mkOpcode(mask));
  tmp.summarize = function() {
    return 'arp';
  };
  return tmp;
}

ARP.prototype.sha = function(sha) {
  if(sha) {
    this._sha = new ETHERNET.MAC(null, sha);
  } else {
    return this._sha;
  }
};


function mkSha(sha){
  return new ETHERNET.mkMAC(sha);
}

function mkShaMatch(value, mask){
  var tmp = ETHERNET.mkMACMatch(value, mask);
  tmp.summarize = function() {
    return 'arp';
  };
  return tmp;
}

ARP.prototype.spa = function(spa) {
  if(spa) {
    this._spa = new IPV4.mkAddress(spa);
  } else {
    return this._spa;
  }
};

function mkSpa(ip){
  return new IPV4.mkAddress(ip);
}

function mkSpaMatch(value, mask){
  var tmp = IPV4.mkAddressMatch(value, mask);
  tmp.summarize = function() {
    return 'arp';
  };
  return tmp;
}


ARP.prototype.tha = function(tha) {
  if(tha) {
    this._tha = new ETHERNET.mkMAC(tha);
  } else {
    return this._tha;
  }
};

function mkTha(mac){
  return new ETHERNET.mkMAC(mac);
}

function mkThaMatch(value, mask){
  var tmp = ETHERNET.mkMACMatch(value, mask);
  tmp.summarize = function() {
    return 'arp';
  };
  return tmp;
}

ARP.prototype.tpa = function(tpa) {
  if(tpa) {
    this._tpa = new IPV4.mkAddress(tpa);
  } else {
    return this._tpa;
  }
};

function mkTpa(ip){
  return new IPV4.mkAddress(ip);
}

function mkTpaMatch(value, mask){
  var tmp = new IPV4.Address.Match(null, value, mask);
  tmp.summarize = function() {
    return 'arp';
  };
  return tmp;
}

ARP.prototype.toString = function() {
  return 'opcode: '+this._opcode.toString(16)+'\n'+
         'sha: '+this._sha.toString()+'\n'+
         'spa: '+this._spa.toString()+'\n'+
         'tha: '+this._tha.toString()+'\n'+
         'spa: '+this._tpa.toString();
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
  spa: IPV4.Address.is,
  tha: ETHERNET.MAC.is,
  tpa: IPV4.Address.is
};

function ARP_UI(arp) {
  arp = arp ? new ARP(arp) : new ARP();
  this.name = NAME;
  this.bytes = arp.bytes;
  this.attrs = [{
    name: 'Opcode',
    value: arp.opcode().toString(16),
    test: UInt.is(16),
    tip: TIPS.opcode
  }, {
    name: 'SHA',
    value: arp.sha().toString(),
    test: ETHERNET.MAC.is,
    tip: TIPS.sha
  }, {
    name: 'SPA',
    value: arp.spa().toString(),
    test: IPV4.Address.is,
    tip: TIPS.spa
  }, {
    name: 'THA',
    value: arp.tha().toString(),
    test: ETHERNET.MAC.is,
    tips: TIPS.tha
  }, {
    name: 'TPA',
    value: arp.tpa().toString(),
    test: IPV4.Address.is,
    tip: TIPS.tpa
  }];
}


ARP_UI.prototype.toBase = function() {
  return new ARP(null, this.attrs[0].value, this.attrs[1].value,
      this.attrs[2].value, this.attrs[3].value, this.attrs[4].value);
};

ARP_UI.prototype.setPayload = function() {

};

ARP.prototype.clone = function() {
  return new ARP(this);
};


return {
  name:           NAME,
  ARP:            ARP,
  opcode:         '_opcode',
  sha:            '_sha',
  spa:            '_spa',
  tha:            '_tha',
  tpa:            '_tpa',
  mkARP:          mkARP,
  mkOpcode:       mkOpcode,
  mkOpcodeMatch:  mkOpcodeMatch,
  mkSha:          mkSha,
  mkShaMatch:     mkShaMatch,
  mkSpa:          mkSpa,
  mkSpaMatch:     mkSpaMatch,
  mkTha:          mkTha,
  mkThaMatch:     mkThaMatch,
  mkTpa:          mkTpa,
  mkTpaMatch:     mkTpaMatch,
  ARP_UI:         ARP_UI,
  create:         function(arp)   { return new ARP(arp); },
  createUI:       function(arp)   { return new ARP_UI(arp); },
  Payloads:       Object.keys(Payloads),
  TESTS:          TESTS,
  TIPS:           TIPS
};

});
