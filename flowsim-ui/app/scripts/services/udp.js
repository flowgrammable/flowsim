'use strict';

angular.module('flowsimUiApp')
  .factory('UDP', function(UInt, fgUI, fgConstraints){

var NAME = 'UDP';
var BYTES = 8;

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

function mkUDP(src, dst) {
  return new UDP(null, src, dst);
}

UDP.prototype.clone = function() {
  return new UDP(this);
};

function mkPort(port){
  if(port instanceof UInt.UInt) {
    return new UInt.UInt(port);
  } else {
    return new UInt.UInt(null, port, 2);
  }
}

function mkPortMatch(value, mask) {
  var tmp = new UInt.Match(null, mkPort(value), mkPort(mask));
  tmp.summarize = function() {
    return 'udp';
  };
  return tmp;
}

UDP.prototype.src = function(src) {
  if(src) {
    if(src instanceof UInt.UInt) {
      this._src = new UInt.UInt(src);
    } else {
      this._src = new UInt.UInt(null, src, 2);
    }
  } else {
    return this._src;
  }
};

UDP.prototype.dst = function(dst) {
  if(dst) {
    if(dst instanceof UInt.UInt) {
      this._dst = new UInt.UInt(dst);
    } else {
      this._dst = new UInt.UInt(null, dst, 2);
    }
  } else {
    return this._dst;
  }
};

UDP.prototype.toString = function() {
  return 'src: '+this._src.toString()+'\n'+
         'dst: '+this._dst.toString();
};

// UI Interface:
var TIPS = {
  src: 'UDP source port',
  dst: 'UDP destination port'
};

var TESTS = {
  src:     UInt.is(16),
  dst:     UInt.is(16)
};

function UDP_UI(udp){
  udp = udp === undefined ? new UDP() : udp;
  this.name = NAME;
  this.bytes = BYTES;
  this.attrs = [{
    name: 'Src',
    value: udp.src().toString(),
    tip: 'Source port',
    test: fgConstraints.isUInt(0,0xffff)
  }, {
    name: 'Dst',
    value: udp.dst().toString(),
    tip: 'Destination port',
    test: fgConstraints.isUInt(0,0xffff)
  }];
}

UDP_UI.prototype.toBase = function() {
  return new UDP(null, this.attrs[0].value, this.attrs[1].value);
};

UDP_UI.prototype.setPayload = function() {
  // do nothing
};

return {
  name: NAME,
  Payloads: _.keys(Payloads),
  UDP: UDP,
  src: '_src',
  dst: '_dst',
  mkPort: mkPort,
  mkPortMatch: mkPortMatch,
  mkUDP: mkUDP,
  create: function(udp) { return new UDP(udp); },
  createUI: function(udp) { return new UDP_UI(udp); },
  TESTS: TESTS,
  TIPS: TIPS
};

});
