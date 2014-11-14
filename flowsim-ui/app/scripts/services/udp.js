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
  return new UInt.Match(null, mkPort(value), mkPort(mask));
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
  var result = new UDP();
  //FIXME This is BAD!!!!! you are bypassing the constructor that established an
  //invariant ... so now we can't depend on the invariant ....
  //use the constructor, much like the force ... it will help you!!!
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
  src: '_src',
  dst: '_dst',
  mkPort: mkPort,
  mkPortMatch: mkPortMatch,
  mkUDP: mkUDP,
  create: function() { return new UDP(); },
  createUI: function(UDP) { return new UDP_UI(UDP); },
  TESTS:       TESTS,
  TIPS:        TIPS
};

});
