'use strict';

angular.module('flowsimUiApp')
  .factory('UDP', function(UInt, fgUI, fgConstraints){

var NAME = 'UDP';
var BYTES = 8;

var Payloads = {};

function UDP(udp, src, dst){
  if(_.isObject(udp)) {
    this._src = mkPort(udp._src);
    this._dst = mkPort(udp._dst);
  } else {
    this._src = mkPort(src);
    this._dst = mkPort(dst);
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
  var result = new UDP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

UDP_UI.prototype.setPayload = function() {
  //FIXME
  return true;
};

return {
  name: NAME,
  Payloads: _.keys(Payloads),
  UDP: UDP,
  mkPort: mkPort,
  mkUDP: mkUDP,
  src: '_src',
  dst: '_dst',
  create: function() { return new UDP(); },
  createUI: function(UDP) { return new UDP_UI(UDP); },
  TESTS:       TESTS,
  TIPS:        TIPS
};

});
