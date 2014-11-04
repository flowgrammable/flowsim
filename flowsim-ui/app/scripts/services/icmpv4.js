'use strict';

angular.module('flowsimUiApp')
  .service('ICMPV4', function(fgUI, fgConstraints){

var NAME = 'ICMPv4';

function _ICMPV4() {
  this.name = NAME;
  this.bytes = 4;
  this.fields = {
    type: 0,
    code: 0
  };
}

function _ICMPV4_UI(icmpv4){
  icmpv4 = icmpv4 === undefined ? new _ICMPV4() : icmpv4;
  this.name = NAME;
  this.bytes = 4;
  this.attrs = _.map(icmpv4.fields, function(value, key){
    switch(key){
      case 'type':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,0xff),
                                        'ICMP message type');
      case 'code':
        return mkLabelInput(key, value, fgConstraints.isUInt(0, 0xff),
                                        'ICMP message code');
      default:
        return mkLabelInput(key, value, function(){return true;}, 'Unknown');
    }
  });
}

_ICMPV4_UI.prototype.toBase = function() {
  var result = new _ICMPV4();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

_ICMPV4_UI.prototype.setPayload = function() {
  return true;
};

this.name = NAME;

this.create = function() {
  return new _ICMPV4();
};

this.createUI = function(icmpv4){
  return new _ICMPV4_UI(icmpv4);
};


});
