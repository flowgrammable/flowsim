'use strict';

angular.module('flowsimUiApp')
  .factory('ICMPV4', function(fgUI, fgConstraints){

var NAME = 'ICMPv4';
var BYTES = 4; //FIXME this isnt correct

function ICMPV4() {
  this.name = NAME;
  this.bytes = BYTES;
  this.fields = {
    type: 0,
    code: 0
  };
}

function ICMPV4_UI(icmpv4){
  icmpv4 = icmpv4 === undefined ? new ICMPV4() : icmpv4;
  this.name = NAME;
  this.bytes = 4;
  this.attrs = [{
    name: 'Type',
    value: icmpv4.type().toString(),
    tip: 'ICMP message type',
    test: fgConstraints.isUInt(0, 0xff)
  }, {
    name: 'Code',
    value: icmpv4.code().toString(),
    tip: 'ICMP message code',
    test: fgConstraints.isUInt(0, 0xff)
  }];
}

ICMPV4_UI.prototype.toBase = function() {
  var result = new ICMPV4();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

ICMPV4_UI.prototype.setPayload = function() {
  return true;
};

return {
  name: NAME,
  create: function() { return new ICMPV4(); },
  createUI: function(icmpv4) { return new ICMPV4_UI(icmpv4); }
};

});
