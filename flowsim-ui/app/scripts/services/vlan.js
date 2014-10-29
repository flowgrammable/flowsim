'use strict';

(function(){

var Payloads = {
 'VLAN': 0x8100,
 'MPLS': 0x8847,
 'ARP':  0x0806,
 'IPv4': 0x0800,
 'IPv6': 0x86dd,
 'Payload': 0
};

function VLAN(name) {
  this.name = name;
  this.bytes = 4;
  this.fields = {
    pcp: 0,
    dei: 0,
    vlan_id: 0,
    typelen: 0
  };
}

function VLAN_UI(name, vlan) {
  this.name = name;
  this.bytes = 4;
  this.attrs = _.map(vlan.fields, function(value, key) {
    switch(key) {
      case 'pcp':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,7), 
                            'VLAN Priority Code Point');
      case 'dei':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,3), 
                            '');
      case 'vlan_id'
        return mkLabelInput(key, value, fgConstraints.isUInt(0, 0x0fff), 
                            'VLAN Tag Identifier');
      case 'typelen'
        return mkLabelInput(key, value, fgConstraints.isUInt(0, 0xffff), 
                            'Ethernet type or length of payload');

  });
}

VLAN_UI.prototype.toBase = function() {
  var result = new VLAN(this.name);
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
}

VLAN_UI.prototype.setPayload = function(name) {
  this.attrs[3].value = '0x' + (Payloads[name] || 0).toString(16);
};

VLAN_UI.prototype.clearPayload = function() {
  this.attrs[3].value = '0x0000';
};

/**
 * @ngdoc service
 * @name flowsimUiApp.VLAN
 * @description
 * # VLAN
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('VLAN', function() {
    this.name = 'VLAN';
    this.Payloads = Object.keys(Payloads);
    this.create = function() {
      return new VLAN();
    };
    this.createUI = function(){
      return new VLAN();
    };
  });

})();
