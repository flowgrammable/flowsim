'use strict';

angular.module('flowsimUiApp')
  .factory('UDP', function(fgUI, fgConstraints, UInt){

var NAME = 'UDP';
var BYTES = 20;

var Payloads = {
  'Payload': 0
};

function UDP(udp, src, dst){
  if(_.isObject(udp)) {
    this._src = new UInt.UInt(udp._src);
    this._dst = new UInt.UInt(udp._dst);
  } else {
    this._src = new UInt.UInt(null, src, 2);
    this._dst = new UInt.UInt(null, dst, 2);
  }
  this.name = NAME;
  this.bytes = BYTES;
}

UDP.prototype.src = function(src) {
  if(src) {
    this._src = mkPort(src);
  } else {
    return this._src;
  }
};

UDP.prototype.dst = function(dst) {
  if(dst) {
    this._dst = mkPort(dst);
  } else {
    return this._dst;
  }
};

function mkUDP(src, dst) {
  return new UDP(null, src, dst);
}

UDP.prototype.setPayload = function() {};

UDP.prototype.clone = function() {
  return new UDP(this);
};

UDP.prototype.toString = function() {
  return 'src: '+this._src.toString()+'\n'+
         'dst: '+this._dst.toString();
};

function mkPort(port) {
  if (port instanceof UInt.UInt) {
    return new UInt.UInt(port);
  } else {
    return new UInt.UInt(null, port, 2);
  }
}

function mkPortMatch(value, mask) {
  var match = new UInt.Match(null, mkPort(value), mkPort(mask));
  match.summarize = function () {
    return 'udp';
  };
  return match;
}

var TIPS = {
  src: 'UDP source port',
  dst: 'UDP destination port'
};

var TESTS = {
  src: UInt.is(16),
  dst: UInt.is(16)
};

function UDP_UI(udp){
  udp = udp ? new UDP(udp) : new UDP();
  this.name = NAME;
  this.bytes = BYTES;
  this.attrs = [{
    name: 'Src',
    value: udp.src().toString(),
    test: fgConstraints.isUInt(0,0xffff),
    tip: 'Source port'
  }, {
    name: 'Dst',
    value: udp.dst().toString(),
    test: fgConstraints.isUInt(0,0xffff),
    tip: 'Destination port'
  }];
}

UDP_UI.prototype.toBase = function() {
  return new UDP(null, this.attrs[0].value, this.attrs[1].value);
};

UDP_UI.prototype.setPayload = function() {};
UDP_UI.prototype.clearPayload = function() {};

return {
  name: NAME,
  src: '_src',
  dst: '_dst',
  UDP: UDP,
  UDP_UI: UDP_UI,
  create: function(udp) {return new UDP(udp); },
  createUI: function(udp) {return new UDP_UI(udp); },
  Payloads: _(Payloads).keys(),
  mkPort: mkPort,
  mkPortMatch: mkPortMatch,
  mkUDP: mkUDP,
  TESTS: TESTS,
  TIPS: TIPS
};

});
