'use strict';

angular.module('flowsimUiApp')
  .factory('IPV4', function IPV4(fgUI, fgConstraints, UInt){

var NAME = 'IPv4';
var BYTES = 20;

var Payloads = {
  'ICMPv4': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132,
  'Payload' : 0
};

function IPv4(ipv4, dscp, ecn, proto, src, dst) {
  if(_.isObject(ipv4)) {
    this._dscp = new UInt.UInt(ipv4._dscp);
    this._ecn  = new UInt.UInt(ipv4._ecn);
    this._proto = new UInt.UInt(ipv4._proto);
    this._src   = new IP(ipv4._src);
    this._dst   = new IP(ipv4._dst);
  } else {
    this._dscp = new UInt.UInt(null, dscp, 1);
    this._ecn  = new UInt.UInt(null, ecn, 1);
    this._proto = new UInt.UInt(null, proto, 1);
    this._src   = mkIP(src);
    this._dst   = mkIP(dst);
  }
  this.name = NAME;
  this.bytes = BYTES;
}

function mkIPv4(dscp, ecn, proto, src, dst){
  return new IPv4(null, dscp, ecn, proto, src, dst);
}

IPv4.prototype.dscp = function(dscp) {
  if(dscp) {
    if(dscp instanceof UInt.UInt) {
      this._dscp = new UInt.UInt(dscp);
    } else {
      this._dscp = new UInt.UInt(null, dscp, 1);
    }
  } else {
    return this._dscp;
  }
};

function mkDscp(dscp){
  return new UInt.UInt(null, dscp, 1);
}

IPv4.prototype.ecn = function(ecn) {
  if(ecn) {
    if(ecn instanceof UInt.UInt) {
      this._ecn = new UInt.UInt(ecn);
    } else {
      this._ecn = new UInt.UInt(null, ecn, 1);
    }
  } else {
    return this._ecn;
  }
};

function mkEcn(ecn){
  return new UInt.UInt(null, ecn, 1);
}

IPv4.prototype.proto = function(proto) {
  if(proto) {
    if(proto instanceof UInt.UInt) {
      this._proto = new UInt.UInt(proto);
    } else {
      this._proto = new UInt.UInt(null, proto, 1);
    }
  } else {
    return this._proto;
  }
};


function mkProto(proto){
  return new UInt.UInt(null, proto, 1);
}

IPv4.prototype.src = function(src) {
  if(src) {
    this._src = mkIP(src);
  } else {
    return this._src;
  }
};

function mkSrc(src){
  return new IP(null, src);
}

IPv4.prototype.dst = function(dst) {
  if(dst) {
    this._dst = mkIP(dst);
  } else {
    return this._dst;
  }
};

function mkDst(dst){
  return new IP(null, dst);
}

IPv4.prototype.clone = function() {
  return new IPv4(this);
};

var TIPS = {
  dscp: 'Differentiated Services Code Type',
  ecn: 'Explicit Congestion Notification',
  proto: 'Protocol',
  src: 'Source Address',
  dst: 'Destination Address'
};

var ipv4Pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

function dot2num(dot){
    var d = dot.split('.');
    return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

function IP(ip, input){
  var tmp;
  if(_.isObject(ip)) {
    this._ip = new UInt.UInt(ip._ip);
  } else if(_.isString(input)){
    tmp = input.match(ipv4Pattern);
    if(!tmp || !_.every(input.split('.'), fgConstraints.isUInt(0, 255))){
        throw 'Bad IPv4 Address: ' + ip+', '+input;
    }
    this._ip = new UInt.UInt(null, dot2num(input), 4);
  } else if(_.isNumber(input)){
    this._ip = new UInt.UInt(null, input, 4);
  } else {
    this._ip = new UInt.UInt(null, null, 4);
  }
}

IP.prototype.clone = function() {
  return new IP(this);
};

function mkIP(ip) {
  if(_.isObject(ip)){
    return new IP(ip);
  } else {
    return new IP(null, ip);
  }
}

IP.equal = function(lhs, rhs) {
  return UInt.equal(lhs._ip, rhs._ip);
};

IP.prototype.toString = function() {
    return [(this._ip.value >> 24) & 255, (this._ip.value >> 16) & 255,
            (this._ip.value >> 8) & 255, this._ip.value & 255].join('.');
};

IP.Pattern = ipv4Pattern;

IP.is = function(ip) {
  return ipv4Pattern.test(ip);
};

IP.Match = function(match, addr, mask){
  if(_.isObject(match)){
    this._match = new UInt.Match(match._match);
  } else {
    this._match = new UInt.Match(null, mkIP(addr)._ip, mkIP(mask)._ip);
  }
};

IP.Match.prototype.match = function(addr) {
  return this._match.match(addr._ip);
};

IP.Match.prototype.clone = function() {
  return new IP.Match(this);
};

function mkIPMatch(value, mask){
  return new IP.Match(null, value, mask);
}

var TESTS = {
  dscp: UInt.is(6),
  ecn: UInt.is(2),
  proto: UInt.is(8),
  src: IP.is,
  dst: IP.is
};

function IPv4_UI(ipv4){
  ipv4 = ipv4 ? new IPv4(ipv4) : new IPv4();
  this.name = NAME;
  this.bytes = ipv4.bytes;
  this.attrs = [
  {
    name: 'DSCP',
    value: ipv4.dscp().toString(16),
    test: TESTS.dscp,
    tip: TIPS.dscp
  },
  {
    name: 'ECN',
    value: ipv4.ecn().toString(16),
    test: TESTS.ecn,
    tip: TIPS.ecn
  },
  {
    name: 'Proto',
    value: ipv4.proto().toString(16),
    test: TESTS.proto,
    tip: TIPS.proto
  },
  {
    name: 'Src',
    value: ipv4.src().toString(),
    test: TESTS.src,
    tip: TIPS.src
  },
  {
    name: 'Dst',
    value: ipv4.dst().toString(),
    test: TESTS.dst,
    tip: TIPS.dst
  }
  ];
}

IPv4_UI.prototype.toBase = function() {
  return new IPv4(null, this.attrs[0].value, this.attrs[1].value,
      this.attrs[2].value, this.attrs[3].value, this.attrs[4].value);
};

IPv4_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = (Payloads[name] || 0).toString(16);
};

IPv4_UI.prototype.clearPayload = function() {
  this.attrs[2].value = '0x0000';
};


return {
  name:       NAME,
  IPv4:       IPv4,
  dscp:       '_dscp',
  ecn:        '_ecn',
  proto:      '_proto',
  src:        '_src',
  dst:        '_dst',
  IPv4_UI:    IPv4_UI,
  create:     function(ipv4)    { return new IPv4(ipv4); },
  createUI:   function(ipv4)    { return new IPv4_UI(ipv4); },
  Payloads:   Object.keys(Payloads),
  IP:         IP,
  mkIP:       mkIP,
  mkIPMatch:  mkIPMatch,
  mkIPv4:     mkIPv4,
  mkDscp:     mkDscp,
  mkEcn:      mkEcn,
  mkProto:    mkProto,
  mkSrc:      mkSrc,
  mkDst:      mkDst,
  TESTS:      TESTS,
  TIPS:       TIPS
};

});
