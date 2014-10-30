'use strict';

angular.module('flowsimUiApp')
  .service('ETHERNET', function ETHERNET(fgConstraints, fgUI) {

var NAME = 'Ethernet';

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;

var Payloads = {
  'VLAN': 0x8100,
  'MPLS': 0x8847,
  'ARP':  0x0806,
  'IPv4': 0x0800,
  'IPv6': 0x86dd,
  'Payload' : 0x0000
};

function isMAC(addr) {
  return macPattern.test(addr);
}

function Ethernet() {
  this.name = NAME;
  this.bytes = 14;
  this.fields = {
    src: '00:00:00:00:00:00',
    dst: '00:00:00:00:00:00',
    typelen: 0
  };
}

function Ethernet_UI(eth) {
  eth = eth === undefined ? new Ethernet() : eth;
  this.name = NAME;
  this.bytes = eth.bytes;
  this.attrs = _.map(eth.fields, function(value, key) {
    switch(key) {
      case 'src':
        return {
          name: key,
          value: value,
          test: isMAC,
          tip: 'Ethernet source MAC address'
        };
      case 'dst':
        return {
          name: key,
          value: value,
          test: isMAC,
          tip: 'Ethernet destination MAC address'
        };
      case 'typelen':
        return {
          name: key,
          value: '0x'+value.toString(16),
          test: fgConstraints.isUInt(0, 0xffff),
          tip: 'Ethernet type/length of payload'
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

Ethernet_UI.prototype.toBase = function() {
  var result = new Ethernet();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

Ethernet_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = '0x' + (Payloads[name] || 0).toString(16);
};

Ethernet_UI.prototype.clearPayload = function() {
  this.attrs[2].value = '0x0000';
};

  
this.name = NAME;
this.create = function() {
  return new Ethernet();
};

this.createUI = function(eth) {
  return new Ethernet_UI(eth);
};
  
this.Payloads = Object.keys(Payloads);

});
