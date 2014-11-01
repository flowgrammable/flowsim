'use strict';

angular.module('flowsimUiApp')
  .service('MPLS', function MPLS(fgConstraints, fgUI){

var NAME = 'MPLS';

var Payloads = {
 'MPLS': 0x8847,
 'ARP':  0x0806,
 'IPv4': 0x0800,
 'IPv6': 0x86dd,
 'Payload': 0
};

function _MPLS() {
  this.name = NAME;
  this.bytes = 4;
  this.fields = {
    label: 0,
    tc: 0,
    bos: 0
  };
}

function _MPLS_UI(mpls){
  mpls = mpls === undefined ? new _MPLS() : mpls;
  this.name = NAME;
  this.bytes = mpls.bytes;
  this.attrs = _.map(mpls.fields, function(value, key){
    switch(key) {
      case 'label':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 0x0fffff),
          tip: 'MPLS Label'
        };
      case 'tc':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 7),
          tip: 'Traffic Control'
        };
      case 'bos':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 0x0fffff),
          tip: 'Bottom of Stack'
        };
      default:
        return {
          name: key,
          value: value,
          test: function() { return true; },
          tip: 'Unknown'
        };
    }
  });
}

_MPLS_UI.prototype.toBase = function () {
  var result = new _MPLS();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

_MPLS_UI.prototype.setPayload = function(name) {

};

_MPLS_UI.prototype.clearPayload = function() {

};

this.name = NAME;

this.create = function () {
  return new _MPLS();
};

this.createUI = function(mpls) {
  return new _MPLS_UI(mpls);
};

this.Payloads = Object.keys(Payloads);

});
