'use strict';

angular.module('flowsimUiApp')
  .factory('ICMPV6', function(fgUI, fgConstraints){

var NAME = 'ICMPv6';
var BYTES = 4; //FIXME this isn't correct

function ICMPv6() {
  this.name = NAME;
  this.bytes = 4;
  this.fields = {
    type: 0,
    code: 0
  };
}

function ICMPV6_UI(icmpv6){
  icmpv6 = icmpv6 === undefined ? new ICMPV6() : icmpv6;
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

ICMPV6_UI.prototype.toBase = function() {
  var result = new ICMPV6();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

ICMPV6_UI.prototype.setPayload = function() {
  return true;
};

return {
  name: NAME,
  create: function() { return new ICMPv6(); },
  createUI: function(icmpv6) { return new ICMPV6_UI(icmpv6); }
};

});
