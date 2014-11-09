'use strict';

angular.module('flowsimUiApp')
  .factory('ETHERNET', function ETHERNET(fgConstraints, fgUI, Utils) {

var NAME = 'Ethernet';

//var Bytes = 14;

var Payloads = {
  'VLAN': 0x8100,
  'MPLS': 0x8847,
  'ARP':  0x0806,
  'IPv4': 0x0800,
  'IPv6': 0x86dd,
  'Payload' : 0x0000
};

function Ethernet(eth, src, dst, type) {
  if(eth instanceof Ethernet || (typeof eth === 'object' && eth !== null)) {
    this._src = new MAC(eth._src);
    this._dst = new MAC(eth._dst);
    this._type = new Utils.UInt(eth._type, 16);
  } else {
    this._src = new MAC(src);
    this._dst = new MAC(dst);
    this._type = new Utils.UInt(type, 16);
  }
  this.bytes = 14;
  this.name = NAME;
}

Ethernet.prototype.src = function(src) {
  if(src) {
    this._src = new MAC(src);
  } else {
    return this._src;
  }
};

Ethernet.prototype.dst = function(dst) {
  if(dst) {
    this._dst = new MAC(dst);
  } else {
    return this._dst;
  }
};

Ethernet.prototype.typelen = function(typelen) {
  if(typelen) {
    this._typelen = new Utils.UInt(typelen, 16);
  } else {
    return this._typelen;
  }
};

Ethernet.Name = NAME;

Ethernet.TIPS = {
  src: 'Ethernet source address',
  dst: 'Ethernet destination address',
  typelen: 'Ethernet payload type or length'
};

var Pattern = /^([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})$/;


function MAC(mac) {
  var tmp;
  if(typeof mac === 'string') {
    tmp = mac.match(Pattern);
    if(!tmp || tmp.length < 12) {
      throw 'Bad MAC Address: ' + mac;
    }
    this.value = _.map(_.range(6), function(i) {
      return parseInt('0x'+tmp[2*i+1]);
    });
  } else if(mac instanceof MAC) {
    this.value = _.clone(mac.value);
  } else if(mac === undefined) {
    this.value = [0, 0, 0, 0, 0, 0];
  } else {
    _.extend(this, mac);
    this.value = _.clone(mac.value);
  }
};

MAC.prototype.equal = function(mac) {
  var i;
  for(i=0; i<6; ++i) {
    if(this.value[i] !== mac.value[i]) {
      return false;
    }
  }
  return true;
};

MAC.prototype.toString = function() {
  return _.map(this.value, function(oct) {
    return Utils.padZeros(oct.toString(16), 2);
  }).join(':');
};

MAC.Broadcast = new MAC('ff:ff:ff:ff:ff:ff');

MAC.Pattern = Pattern;

MAC.is = function(addr) {
  return MAC.Pattern.test(addr);
};

MAC.isBroadcast = function(addr) {
  return MAC.Broadcast.equal(addr);
};

MAC.isMulticast = function(addr) {
  return addr.value[0] & 0x01 ? true : false;
};

MAC.Match = function(addr, mask) {
  if(addr instanceof MAC.Match) {
    this.addr = new MAC(addr.addr);
    this.mask = new MAC(addr.mask);
  } else if(addr && mask === undefined) {
    _.extend(this, addr);
    this.addr = new MAC(addr.addr);
    this.mask = new MAC(addr.mask);
  } else {
    this.addr = new MAC(addr);
    this.mask = new MAC(mask);
  }
};

MAC.Match.prototype.match = function(addr) {
  var i;
  for(i=0; i<6; ++i) {
    if(this.addr.value[i] !== (this.mask.value[i] & addr.value[i])) {
      return false;
    }
  }
  return true;
};

MAC.Match.prototype.toString = function() {
  return this.addr.toString() + '/' + this.mask.toString();
};

TESTS = {
  src:     MAC.is,
  dst:     MAC.is,
  typelen: Utils.UInt.is(16)
};

function Ethernet_UI(eth) {
  eth = eth === undefined ? new Ethernet(NAME) : new Ethernet(eth);
  this.name = NAME;
  this.bytes = eth.bytes;
  this.attrs = [{
    name: 'Src',
    value: eth.src().toString(),
    test: MAC.is,
    tip: TIPS.src
  }, {
    name: 'Dst',
    value: eth.dst().toString(),
    test: MAC.is,
    tip: TIPS.dst
  }, {
    name: 'Type/Length',
    value: eth.typelen().toString(),
    test: Utils.UInt.is(16),
    tip: TIPS.typelen
  }];
}

Ethernet_UI.prototype.toBase = function() {
  return new Ethernet(this);
};

Ethernet_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = '0x' + (Payloads[name] || 0).toString(16);
};

Ethernet_UI.prototype.clearPayload = function() {
  this.attrs[2].value = '0x0000';
};

return {
  name:        NAME,
  Ethernet:    Ethernet,
  Ethernet_UI: Ethernet_UI,
  create:      function(eth)         { return new Ethernet(eth); },
  createUI:    function(eth)         { return new Ethernet_UI(eth); },
  Payloads:    Object.keys(Payloads),
  MAC:         Ethernet.MAC
};

});
