'use strict';

angular.module('flowsimUiApp')
  .factory('MPLS', function(fgConstraints, UInt){

var NAME = 'MPLS';
var BYTES = 4;

var Payloads = {
 'MPLS': 0x8847,
 'IPv4': 0x0800,
 'IPv6': 0x86dd,
 'Payload': 0
};

function MPLS(mpls, label, tc, bos, ttl){
  if(_.isObject(mpls)){
    _.extend(this, mpls);
    this._label  = new UInt.UInt(mpls._label);
    this._tc     = new UInt.UInt(mpls._tc);
    this._bos    = new UInt.UInt(mpls._bos);
    this._ttl    = new UInt.UInt(mpls._ttl);
  } else {
    this._label  = mkLabel(label);
    this._tc     = mkTc(tc);
    this._bos    = mkBos(bos);
    this._ttl    = mkTtl(ttl);
  }
  this.bytes = BYTES;
  this.name = NAME;
}

function mkMPLS(label, tc, bos, ttl){
  return new MPLS(null, label, tc, bos, ttl);
}

MPLS.prototype.label = function(label){
  if(label){
    if(label instanceof UInt.UInt){
      this._label = new UInt.UInt(label);
    } else {
      this._label = new UInt.UInt(null, label, 3);
    }
  } else {
    return this._label;
  }
};

function mkLabel(input){
  return new UInt.UInt(null, input, 3);
}

function mkLabelMatch(value, mask){
  return new UInt.Match(null, mkLabel(value), mkLabel(mask));
}

MPLS.prototype.tc = function(tc){
  if(tc){
    if(tc instanceof UInt.UInt){
      this._tc = new UInt.UInt(tc);
    } else {
      this._tc = new UInt.UInt(null, tc, 1);
    }
  } else {
    return this._tc;
  }
};

function mkTc(input){
  return new UInt.UInt(null, input, 1);
}

function mkTcMatch(value, mask){
  return new UInt.Match(null, mkTc(value), mkTc(mask));
}

MPLS.prototype.bos = function(bos){
  if(bos){
    if(bos instanceof UInt.UInt){
      this._bos = new UInt.UInt(bos);
    } else {
      this._bos = new UInt.UInt(null, bos, 1);
    }
  } else {
    return this._bos;
  }
};

function mkBos(input){
  return new UInt.UInt(null, input, 1);
}

function mkBosMatch(value, mask){
  return new UInt.Match(null, mkBos(value), mkBos(mask));
}

MPLS.prototype.ttl = function(ttl){
  if(ttl){
    if(ttl instanceof UInt.UInt){
      this._ttl = new UInt.UInt(ttl);
    } else {
      this._ttl = new UInt.UInt(null, ttl, 1);
    }
  } else {
    return this._ttl;
  }
};

function mkTtl(input){
  return new UInt.UInt(null, input, 1);
}

function mkTtlMatch(value, mask){
  return new UInt.Match(null, mkTtl(value), mkTtl(mask));
}

var TIPS = {
  label: 'MPLS label',
  tc: 'Traffic Class',
  bos: 'Bottom of Stack',
  ttl: 'Time to live'
};

var TESTS = {
  label: UInt.is(20),
  tc: UInt.is(3),
  bos: UInt.is(1),
  ttl: UInt.is(8)
};

function MPLS_UI(mpls){
  mpls = mpls ? new MPLS(mpls) : new MPLS();
  this.name = NAME;
  this.bytes = mpls.bytes;
  this.attrs = [{
    name: 'Label',
    value: mpls.label().toString(16),
    test: TESTS.label,
    tip: TIPS.label
  },{
    name: 'Traffic Class',
    value: mpls.tc().toString(16),
    test: TESTS.tc,
    tip: TIPS.tc
  },{
    name: 'Bottom of Stack',
    value: mpls.bos().toString(16),
    test: TESTS.bos,
    tip: TIPS.bos
  }, {
    name: 'TTL',
    value: mpls.ttl().toString(16),
    test: TESTS.ttl,
    tip: TIPS.ttl
  }];
}

MPLS_UI.prototype.toBase = function () {
  return new MPLS(null, this.attrs[0].value, this.attrs[1].value,
      this.attrs[2].value, this.attrs[3].value);
};

MPLS_UI.prototype.setPayload = function() {

};

MPLS_UI.prototype.clearPayload = function() {

};

return {
  name: NAME,
  MPLS: MPLS,
  label: '_label',
  tc: '_tc',
  bos: '_bos',
  ttl: '_ttl',
  mkMPLS: mkMPLS,
  mkLabel: mkLabel,
  mkLabelMatch: mkLabelMatch,
  mkTc: mkTc,
  mkTcMatch: mkTcMatch,
  mkBos: mkBos,
  mkBosMatch: mkBosMatch,
  mkTtl: mkTtl,
  mkTtlMatch: mkTtlMatch,
  MPLS_UI:   MPLS_UI,
  create: function(mpls) { return new MPLS(mpls); },
  createUI: function(mpls) {return new MPLS_UI(mpls); },
  Payloads: Object.keys(Payloads),
  TESTS: TESTS,
  TIPS: TIPS
};

});
