'use strict';

angular.module('flowsimUiApp')
  .factory('ICMPV6', function(fgUI, fgConstraints, UInt){

var NAME = 'ICMPv6';
var BYTES = 4; //FIXME this isn't correct
// why this is not correct? - Muxi

var Payloads = {
  'Payload': 0
};

function ICMPv6(icmpv6, type, code) {
  if(_.isObject(icmpv6)) {
    this._type = new UInt.UInt(icmpv6.type);
    this._code = new UInt.UInt(icmpv6.code);
  } else {
    this._type = new UInt.UInt(null, type, 1);
    this._code = new UInt.UInt(null, code, 1);
  }

  this.name = NAME;
  this.bytes = BYTES;
}

function mkICMPv6(type, code) {
  return new ICMPv6(null, type, code);
}

ICMPv6.prototype.type = function(type) {
  if (type) {
    this._type = mkType(type);
  } else {
    return this._type;
  }
};

ICMPv6.prototype.code = function(code) {
  if (code) {
    this._code = mkCode(code);
  } else {
    return this._code;
  }
};

function mkType(type) {
  if (type instanceof UInt.UInt) {
    return new UInt.UInt(type);
  } else {
    return new UInt.UInt(null, type, 1);
  }
}

function mkCode(code) {
  if (code instanceof UInt.UInt) {
    return new UInt.UInt(code);
  } else {
    return new UInt.UInt(null, code, 1);
  }
}

function ICMPv6_UI(icmpv6){
  icmpv6 = icmpv6 === undefined ? new ICMPv6() : icmpv6;
  this.name = NAME;
  this.bytes = 4;
  this.attrs = [{
    name: 'Type',
    value: icmpv6.type().toString(),
    tip: 'ICMP message type',
    test: fgConstraints.isUInt(0,0xff)
  }, {
    name: 'Code',
    value: icmpv6.code().toString(),
    tip: 'ICMP message code',
    test: fgConstraints.isUInt(0,0xff)
  }];
}

ICMPv6_UI.prototype.toBase = function() {
  var result = new ICMPv6();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

ICMPv6_UI.prototype.setPayload = function() {
  return true;
};

return {
  name: NAME,
  create: function() { return new ICMPv6(); },
  createUI: function(icmpv6) { return new ICMPv6_UI(icmpv6); }
};

});
