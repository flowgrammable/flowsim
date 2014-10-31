'use strict';

angular.module('flowsimUiApp')
  .service('ARP', function ARP(fgConstraints, fgUI) {

var NAME = 'ARP';

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;
var ipv4Pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

function isMAC(addr) {
  return macPattern.test(addr);
}

function isIPv4(ipv4) {
  return ipv4Pattern.test(ipv4) &&
         _.every(ipv4.split('.'), fgConstraints.isUInt(0, 255));
}

function ARP() {
  this.name = NAME;
  this.bytes = 28;
  this.fields = {
    opcode: 0,
    sha: '00:00:00:00:00:00',
    spa: '0.0.0.0',
    tha: '00:00:00:00:00:00',
    tpa: '0.0.0.0'
  };
}

function ARP_UI(arp) {
  arp = arp === undefined ? new ARP() : arp;
  this.name = NAME;
  this.bytes = arp.bytes;
  this.attrs = _.map(arp.fields, function(value, key) {
    switch(key){
      case 'opcode':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0,1),
          tip: 'ARP message type'
        };
      case 'sha':
        return {
          name: key,
          value: value,
          test: isMAC,
          tipe: 'Source hardware address'
        };
      case 'spa':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Source Protocol Address'
        };
      case 'tha':
        return {
          name: key,
          value: value,
          test: isMAC,
          tip: 'Target hardware address'
        };
      case 'tpa':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Target protocol address'
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

ARP_UI.prototype.toBase = function() {
  var result = new ARP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

this.name = NAME;
this.create = function() {
  return new ARP();
};

this.createUI = function(arp) {
  return new ARP_UI(arp);
};

});
