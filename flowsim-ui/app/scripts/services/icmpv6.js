'use strict';

angular.module('flowsimUiApp')
  .factory('ICMPV6', function(fgUI, fgConstraints, UInt){

var NAME = 'ICMPv6';
var BYTES = 8; 

var Payloads = {};

function ICMPv6(icmpv6, type, code) {
  if(_.isObject(icmpv6)) {
    this._type = new UInt.UInt(icmpv6._type);
    this._code = new UInt.UInt(icmpv6._code);
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

ICMPv6.prototype.clone = function () {
  return new ICMPv6(this);
};

ICMPv6.prototype.toString = function () {
  return 'type: ' + this._type.toString() + '\n' +
         'code: ' + this._code.toString();
};

ICMPv6.prototype.setPayload = function () {};

function mkType(type) {
  if (type instanceof UInt.UInt) {
    return new UInt.UInt(type);
  } else {
    return new UInt.UInt(null, type, 1);
  }
}

function mkTypeMatch(value, mask) {
  var match = new UInt.Match(null, mkType(value), mkType(mask));
  match.summarize = function () {
    return 'icmpv6';
  };
  return match;
}

function mkCode(code) {
  if (code instanceof UInt.UInt) {
    return new UInt.UInt(code);
  } else {
    return new UInt.UInt(null, code, 1);
  }
}

function mkCodeMatch(value, mask) {
  var match = new UInt.Match(null, mkCode(value), mkCode(mask));
  match.summarize = function () {
    return 'icmpv6';
  };
  return match;
}

var TIPS = {
  type: 'ICMPv6 Type',
  code: 'ICMPv6 Code'
};

var TESTS = {
  type: UInt.is(8),
  code: UInt.is(8)
};

function ICMPv6_UI(icmpv6){
  icmpv6 = icmpv6 ? new ICMPv6(icmpv6) : new ICMPv6();
  this.name = NAME;
  this.bytes = BYTES;
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
  return new ICMPv6(null, this.attrs[0].value, this.attrs[1].value);
};

ICMPv6_UI.prototype.setPayload = function() {};

return {
  name: NAME,
  type: '_type',
  code: '_code',
  ICMPv6: ICMPv6,
  mkICMPv6: mkICMPv6,
  ICMPv6_UI: ICMPv6_UI,
  create: function(icmpv6) {return new ICMPv6(icmpv6);},
  createUI: function(icmpv6ui) { return new ICMPv6_UI(icmpv6ui); },
  Payloads: _(Payloads).keys(),
  mkType: mkType,
  mkTypeMatch: mkTypeMatch,
  mkCode: mkCode,
  mkCodeMatch: mkCodeMatch,
  TESTS: TESTS,
  TIPS: TIPS
};

});
