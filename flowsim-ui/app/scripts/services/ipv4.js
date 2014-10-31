'use strict';

angular.module('flowsimUiApp')
  .service('IPV4', function IPV4(fgUI, fgConstraints){

var NAME = 'IPv4';

var ipv4Pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

function isIPv4(ipv4) {
  return ipv4Pattern.test(ipv4) &&
    _.every(ipv4.split('.'), fgConstraints.isUInt(0, 255));
}

var Payloads = {
  'ICMPv4': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132,
  'Payload' : 0
};

function _IPV4() {
  this.name = NAME;
  this.bytes = 20;
  this.fields = {
    dscp: 0,
    ecn: 0,
    proto: 0,
    src: '0.0.0.0',
    dst: '0.0.0.0'
  };
}

function _IPV4_UI(ipv4){
  this.name = NAME;
  this.bytes = ipv4.bytes;
  this.attrs = _.map(ipv4.fields, function(value, key){
    switch(key) {
      case 'dscp':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUint(0, 0x3f),
          tip: 'Differentiated Services Code Type'
        };
      case 'ecn':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUint(0, 0x03),
          tip: 'Explicit Congestion Notification'
        };
      case 'proto':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUint(0, 255),
          tip: 'Protocol'
        };
      case 'src':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Source Address'
        };
      case 'dst':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Destination Address'
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

_IPV4_UI.prototype.toBase = function() {
  var result = new _IPV4();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

_IPV4_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

_IPV4_UI.prototype.clearPayload = function() {
  this.attrs[2].value = 0;
};

this.name = NAME;

this.Payloads = Object.keys(Payloads);

this.create = function() {
  return new _IPV4();
};

this.createUI = function(ipv4) {
  return new _IPV4_UI(ipv4);
};

});
