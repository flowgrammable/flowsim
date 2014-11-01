'use strict';

angular.module('flowsimUiApp')
  .service('ICMPV6', function(fgUI, fgConstraints){

var NAME = 'ICMPv6';

function _ICMPV6() {
  this.name = NAME;
  this.bytes = 4;
  this.fields = {
    type: 0,
    code: 0
  };
}

function _ICMPV6_UI(icmpv6){
  icmpv6 = icmpv6 === undefined ? new _ICMPV6() : icmpv6;
  this.name = NAME;
  this.bytes = 4;
  this.attrs = _.map(icmpv6.fields, function(value, key){
    switch(key){
      case 'type':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,0xff),
                                        'ICMP message type');
      case 'code':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,0xff),
                                        'ICMP message code');
      default:
        return mkLabelInput(key, value, function(){return true;}, 'Unknown');
    }
  });
}

_ICMPV6_UI.prototype.toBase = function() {
  var result = new _ICMPV6();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
}

_ICMPV6_UI.prototype.setPayload = function() {
  return true;
}

this.name = NAME;

this.create = function() {
      return new _ICMPv6();
};

this.createUI = function(icmpv6){
  return new _ICMPV6_UI(icmpv6);
}

});
