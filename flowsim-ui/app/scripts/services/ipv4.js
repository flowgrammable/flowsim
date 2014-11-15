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

function IPv4(ipv4, dscp, ecn, proto, ttl, src, dst) {
  if(_.isObject(ipv4)) {
    this._dscp = new UInt.UInt(ipv4._dscp);
    this._ecn  = new UInt.UInt(ipv4._ecn);
    this._proto = new UInt.UInt(ipv4._proto);
    this._src   = new Address(ipv4._src);
    this._dst   = new Address(ipv4._dst);
    this._ttl   = new UInt.UInt(ipv4._ttl);
  } else {
    this._dscp = mkDscp(dscp);
    this._ecn  = mkEcn(ecn);
    this._proto = mkProto(proto);
    this._src   = mkAddress(src);
    this._dst   = mkAddress(dst);
    this._ttl   = mkTtl(ttl);
  }
  this.name = NAME;
  this.bytes = BYTES;
}

function mkIPv4(dscp, ecn, proto, ttl, src, dst){
  return new IPv4(null, dscp, ecn, proto, ttl, src, dst);
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

function mkDscpMatch(value, mask){
  var tmp =  new UInt.Match(null, mkDscp(value), mkDscp(mask));
  tmp.summarize = function() {
    return 'ipv4';
  };
  return tmp;
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

function mkEcnMatch(value, mask){
  var tmp =  new UInt.Match(null, mkEcn(value), mkEcn(mask));
  tmp.summarize = function() {
    return 'ipv4';
  };
  return tmp;
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

function mkProtoMatch(value, mask){
  var tmp =  new UInt.Match(null, mkProto(value), mkProto(mask));
  tmp.summarize = function() {
    return 'ipv4';
  };
  return tmp;
}

IPv4.prototype.ttl = function(ttl) {
  if(ttl){
    if(ttl instanceof UInt.UInt) {
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

IPv4.prototype.decTTL = function(){
  if(this._ttl.value > 1){
    this._ttl = mkTtl(this._ttl.value - 1);
  } else {
    this._ttl = mkTtl(1);
  }
};

IPv4.prototype.src = function(src) {
  if(src) {
    this._src = mkAddress(src);
  } else {
    return this._src;
  }
};

function mkSrc(src){
  return new Address(null, src);
}

function mkSrcMatch(value, mask){
  return new Address.Match(null, value, mask);
}

IPv4.prototype.dst = function(dst) {
  if(dst) {
    this._dst = mkAddress(dst);
  } else {
    return this._dst;
  }
};

function mkDst(dst){
  return new Address(null, dst);
}

function mkDstMatch(value, mask){
  return new Address.Match(null, value, mask);
}

IPv4.prototype.clone = function() {
  return new IPv4(this);
};

IPv4.prototype.toString = function(){
  return 'dscp: '+this._dscp.toString(16)+'\n'+
         'ecn:  '+this._ecn.toString(16)+'\n'+
         'proto:'+this._proto.toString(16)+'\n'+
         'ttl:  '+this._ttl.toString(16)+'\n'+
         'src:  '+this._src.toString()+'\n'+
         'dst:  '+this._dst.toString()+'\n';
};

var TIPS = {
  dscp: 'Differentiated Services Code Type',
  ecn: 'Explicit Congestion Notification',
  proto: 'Protocol',
  src: 'Source Address',
  dst: 'Destination Address',
  ttl: 'Time To Live'
};

var ipv4Pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

function dot2num(dot){
    var d = dot.split('.');
    return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

function Address(ip, input){
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

Address.prototype.clone = function() {
  return new Address(this);
};

function mkAddress(ip) {
  if(_.isObject(ip)){
    return new Address(ip);
  } else {
    return new Address(null, ip);
  }
}

Address.equal = function(lhs, rhs){
  return UInt.equal(lhs._ip, rhs._ip);
};

Address.prototype.equal = function(addr){
  return this._ip.equal(addr._ip);
};

Address.prototype.toString = function() {
    return [(this._ip.value >> 24) & 255, (this._ip.value >> 16) & 255,
            (this._ip.value >> 8) & 255, this._ip.value & 255].join('.');
};

Address.Pattern = ipv4Pattern;

Address.is = function(ip) {
  return ipv4Pattern.test(ip);
};

Address.Match = function(match, addr, mask){
  if(_.isObject(match)){
    this._match = new UInt.Match(match._match);
  } else {
    this._match = new UInt.Match(null, mkAddress(addr)._ip, mkAddress(mask)._ip);
  }
};

Address.Match.prototype.match = function(addr) {
  return this._match.match(addr._ip);
};

Address.Match.prototype.clone = function() {
  return new Address.Match(this);
};

Address.Match.prototype.summarize = function() {
  return 'ipv4';
};

Address.Match.prototype.equal = function(addr){
  return this._match.equal(addr._match);
};

function mkAddressMatch(value, mask){
  return new Address.Match(null, value, mask);
}

var TESTS = {
  dscp: UInt.is(6),
  ecn: UInt.is(2),
  proto: UInt.is(8),
  src: Address.is,
  dst: Address.is,
  ttl: UInt.is(8)
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
    name: 'TTL',
    value: ipv4.ttl().toString(16),
    test: TESTS.ttl,
    tip: TIPS.ttl
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
  name:           NAME,
  IPv4:           IPv4,
  dscp:           '_dscp',
  ecn:            '_ecn',
  proto:          '_proto',
  src:            '_src',
  dst:            '_dst',
  ttl:            '_ttl',
  IPv4_UI:        IPv4_UI,
  create:         function(ipv4)    { return new IPv4(ipv4); },
  createUI:       function(ipv4)    { return new IPv4_UI(ipv4); },
  Payloads:       Object.keys(Payloads),
  Address:        Address,
  mkAddress:      mkAddress,
  mkAddressMatch: mkAddressMatch,
  mkIPv4:         mkIPv4,
  mkDscp:         mkDscp,
  mkDscpMatch:    mkDscpMatch,
  mkEcn:          mkEcn,
  mkEcnMatch:     mkEcnMatch,
  mkProto:        mkProto,
  mkProtoMatch:   mkProtoMatch,
  mkTtl:          mkTtl,
  mkSrc:          mkSrc,
  mkSrcMatch:     mkSrcMatch,
  mkDst:          mkDst,
  mkDstMatch:     mkDstMatch,
  dot2num:        dot2num,
  TESTS:          TESTS,
  TIPS:           TIPS
};

});
