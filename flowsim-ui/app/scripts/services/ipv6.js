'use strict';

angular.module('flowsimUiApp')
  .factory('IPV6', function(fgConstraints, UInt){

var NAME = 'IPv6';
var BYTES = 40;

var Payloads = {
  'ICMPv6': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132,
  'Payload' : 0
};


function IPv6(ipv6, flabel, ttl, src, dst) {
  if(_.isObject(ipv6)) {
    this._flabel = new UInt.UInt(ipv6._flabel);
    this._ttl    = new UInt.UInt(ipv6._ttl);
    this._src    = new Address(ipv6._src);
    this._dst    = new Address(ipv6._dst);
  } else {
    this._flabel = mkFlabel(flabel);
    this._ttl    = mkTtl(ttl);
    this._src    = mkAddress(src);
    this._dst    = mkAddress(dst);
  }
  this.name = NAME;
  this.bytes = BYTES;
}

function mkIPv6(flabel, ttl, src, dst){
  return new IPv6(null, flabel, ttl, src, dst);
}

IPv6.prototype.flabel = function(flabel) {
  if(flabel) {
    if(flabel instanceof UInt.UInt) {
      this._flabel = new UInt.UInt(flabel);
    } else {
      this._flabel = new UInt.UInt(null, flabel, 3);
    }
  } else {
    return this._flabel;
  }
};

function mkFlabel(flabel) {
  return new UInt.UInt(null, flabel, 3);
}

function mkFlabelMatch(value, mask){
  var tmp =  new UInt.Match(null, mkFlabel(value), mkFlabel(mask));
  tmp.summarize = function() {
    return 'ipv6';
  };
  return tmp;
}

IPv6.prototype.ttl = function(ttl){
  if(ttl) {
    if(ttl instanceof UInt.UInt){
      this._ttl = new UInt.UInt(ttl);
    } else {
      this._ttl = new UInt.UInt(null, ttl, 1);
    }
  } else {
    return this._ttl;
  }
};

function mkTtl(ttl){
  return new UInt.UInt(null, ttl, 1);
}

IPv6.prototype.src = function(src) {
  if(src) {
    this._src = mkAddress(src);
  } else {
    return this._src;
  }
};

function mkSrc(src){
  return new Address(null, src);
}

IPv6.prototype.dst = function(dst) {
  if(dst) {
    this._dst = mkAddress(dst);
  } else {
    return this._dst;
  }
};

function mkDst(dst){
  return new Address(null, dst);
}

IPv6.prototype.clone = function() {
  return new IPv6(this);
};

IPv6.prototype.toString = function(){
  return 'flabel: '+this._flabel.toString(16)+'\n'+
         'ttl:    '+this._ttl.toString(16)+'\n'+
         'src:    '+this._src.toString(16)+'\n'+
         'dst:    '+this._dst.toString(16);
};

IPv6.prototype.decTTL = function(){
  if(this._ttl.value > 1){
    this._ttl = mkTtl(this._ttl.value - 1);
  } else {
    this._ttl = mkTtl(1);
  }
};

// Javascript regex patterns that support prefix/infix/postfix :: notation
// prefix/postfix are complete
// infix is not complete, regex have no counting ability, so you must ensure
// that not too many octets are on either side of the :: notation

var qualifiedPattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

var prefixPattern = /^::[0-9a-fA-F](:[0-9a-fA-F]{1,4}){0,6}$/;
var infixPattern = /^(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){0,6})?$/;
var postfixPattern = /^([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}::$/;

function isIPv6(addr) {
  var fixes, prefix, postfix;
  if(qualifiedPattern.test(addr) || prefixPattern.test(addr) ||
     postfixPattern.test(addr)) {
    return true;
  } else if(infixPattern.test(addr)) {
    fixes = addr.split('::');
    prefix = _(fixes[0].split(':')).filter(function(s) {
      return s.length > 0;
    });
    postfix = _(fixes[1].split(':')).filter(function(s) {
      return s.length > 0;
    });
    return prefix.length + postfix.length < 8;
  } else {
    return false;
  }
}

function expandIPv6(string){
  var parts = 8;
  var colonCount, lastColon, part, replacement, replacementCount;
  if (string.indexOf('::') !== string.lastIndexOf('::')) {
    return null;
  }
  colonCount = 0;
  lastColon = -1;
  while ((lastColon = string.indexOf(':', lastColon + 1)) >= 0) {
    colonCount++;
  }
  if (string[0] === ':') {
    colonCount--;
  }
  if (string[string.length - 1] === ':') {
    colonCount--;
  }
  replacementCount = parts - colonCount;
  replacement = ':';
  while (replacementCount--) {
    replacement += '0:';
  }
  string = string.replace('::', replacement);
  if (string[0] === ':') {
    string = string.slice(1);
  }
  if (string[string.length - 1] === ':') {
    string = string.slice(0, -1);
  }
  return (function() {
    var _i, _len, _ref, _results;
    _ref = string.split(':');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      _results.push(parseInt(part, 16));
    }
    return _results;
  })();
}

function Address(ip, input){
  var tmp;
  if(_.isObject(ip)) {
    this._ip = new UInt.UInt(ip._ip);
  } else if(_.isString(input)){
    if(!isIPv6(input)){
      throw 'Not IPv6: ' + input;
    }
    tmp = expandIPv6(input);
    this._ip = new UInt.UInt(null, tmp, tmp.length);
  } else if(_.isArray(input)){
    this._ip = new UInt.UInt(null, input, input.length);
  } else {
    this._ip = new UInt.UInt(null, null, 8);
  }
}

Address.prototype.clone = function() {
  return new Address(this);
};

Address.prototype.toString = function(){
  return _(this._ip.value).map(function(oct2){
    return UInt.padZeros(oct2.toString(16), 0);
  }).join(':');
};

Address.equal = function(lsh, rhs){
  return UInt.equal(lsh._ip, rhs._ip);
};

Address.prototype.equal = function(addr){
  return this._ip.equal(addr._ip);
};

function mkAddress(address){
  if(_.isObject(address)){
    return new Address(address);
  } else {
    return new Address(null, address);
  }
}

Address.is = function(addr){
  return isIPv6(addr);
};

Address.Match = function(match, addr, mask){
  if(_.isObject(match)){
    this._match = new UInt.Match(match._match);
  } else {
    this._match = new UInt.Match(null, mkAddress(addr)._ip, mkAddress(mask)._ip);
  }
};

function mkAddressMatch(addr, mask){
  return new Address.Match(null, addr, mask);
}

Address.Match.prototype.clone = function() {
  return new Address.Match(this);
};

Address.Match.prototype.match = function(addr) {
  return this._match.match(addr._ip);
};

Address.Match.prototype.equal = function(match){
  return this._match.equal(match._match);
};

Address.Match.prototype.summarize = function() {
  return 'ipv6';
};

var TIPS = {
  flabel: 'Flow Label',
  ttl:    'Hop Limit',
  src:    'Source Address',
  dst:    'Destination Address'
};

var TESTS = {
  flabel: UInt.is(20),
  ttl: UInt.is(8),
  src: Address.is,
  dst: Address.is
};

function IPv6_UI(ipv6) {
  ipv6 = ipv6 ? new IPv6(ipv6) : new IPv6();
  this.name = NAME;
  this.bytes = ipv6.bytes;
  this.attrs = [{
    name: 'Flabel',
    value: ipv6.flabel().toString(16),
    test: TESTS.flabel,
    tip: TIPS.flabel
  },{
    name: 'TTL',
    value: ipv6.ttl().toString(16),
    test: TESTS.ttl,
    tip: TIPS.ttl
  },{
    name: 'Source',
    value: ipv6.src().toString(),
    test: TESTS.src,
    tip: TIPS.src
  },{
    name: 'Destination',
    value: ipv6.dst().toString(),
    test: TESTS.dst,
    tip: TIPS.dst
  }];
}

IPv6_UI.prototype.toBase = function() {
  return new IPv6(null, this.attrs[0].value, this.attrs[1].value,
      this.attrs[2].value, this.attrs[3].value);
};

IPv6_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

IPv6_UI.prototype.clearPayload = function() {
  this.attrs[2].value = 0;
};

return {
  name:         NAME,
  IPv6:         IPv6,
  mkIPv6:       mkIPv6,
  Address:      Address,
  mkAddress:    mkAddress,
  mkFlabel:     mkFlabel,
  mkFlabelMatch: mkFlabelMatch,
  mkTtl:        mkTtl,
  mkAddressMatch: mkAddressMatch,
  mkSrc:        mkSrc,
  mkDst:        mkDst,
  flabel:       '_flabel',
  ttl:          '_ttl',
  src:          '_src',
  dst:          '_dst',
  create:       function(v6) { return new IPv6(v6); },
  createUI:     function(v6) { return new IPv6_UI(v6); },
  Payloads:     _(Payloads).keys(),
  TIPS:         TIPS,
  TESTS:        TESTS
};

});
