'use strict';

angular.module('flowsimUiApp')
  .factory('SCTP', function(fgUI, fgConstraints, UInt){

var NAME = 'SCTP';
var BYTES = 20;

var Payloads = {
  'Payload': 0
};

function SCTP(sctp, src, dst){
  if(_.isObject(sctp)) {
    this._src = new UInt.UInt(sctp._src);
    this._dst = new UInt.UInt(sctp._dst);
  } else {
    this._src = new UInt.UInt(null, src, 2);
    this._dst = new UInt.UInt(null, dst, 2);
  }
  this.name = NAME;
  this.bytes = BYTES;
}

SCTP.prototype.src = function(src) {
  if(src) {
    this._src = mkPort(src);
  } else {
    return this._src;
  }
};

SCTP.prototype.dst = function(dst) {
  if(dst) {
    this._dst = mkPort(dst);
  } else {
    return this._dst;
  }
};

function mkSCTP(src, dst) {
  return new SCTP(null, src, dst);
}

SCTP.prototype.setPayload = function() {};

SCTP.prototype.clone = function() {
  return new SCTP(this);
};

SCTP.prototype.toString = function() {
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
    return 'sctp';
  };
  return match;
}

var TIPS = {
  src: 'SCTP source port',
  dst: 'SCTP destination port'
};

var TESTS = {
  src: UInt.is(16),
  dst: UInt.is(16)
};

function SCTP_UI(sctp){
  sctp = sctp ? new SCTP(sctp) : new SCTP();
  this.name = NAME;
  this.bytes = BYTES;
  this.attrs = [{
    name: 'Src',
    value: sctp.src().toString(),
    test: fgConstraints.isUInt(0,0xffff),
    tip: 'Source port'
  }, {
    name: 'Dst',
    value: sctp.dst().toString(),
    test: fgConstraints.isUInt(0,0xffff),
    tip: 'Destination port'
  }];
}

SCTP_UI.prototype.toBase = function() {
  return new SCTP(null, this.attrs[0].value, this.attrs[1].value);
};

SCTP_UI.prototype.setPayload = function() {};
SCTP_UI.prototype.clearPayload = function() {};

return {
  name: NAME,
  src: '_src',
  dst: '_dst',
  SCTP: SCTP,
  SCTP_UI: SCTP_UI,
  create: function(sctp) {return new SCTP(sctp); },
  createUI: function(sctp) {return new SCTP_UI(sctp); },
  Payloads: _(Payloads).keys(),
  mkPort: mkPort,
  mkPortMatch: mkPortMatch,
  mkSCTP: mkSCTP,
  TESTS: TESTS,
  TIPS: TIPS
};

});
