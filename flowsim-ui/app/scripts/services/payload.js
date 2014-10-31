'use strict';

angular.module('flowsimUiApp')
  .service('PAYLOAD', function(fgUI, fgConstraints){

var NAME = 'Payload';

function _Payload() {
  this.name = NAME;
  this.bytes = 0;
  this.fields = {
    bytes: 0
  };
}

function _Payload_UI(payload){
  payload = payload === undefined ? new _Payload() : payload;
  this.name = NAME;
  this.bytes = 0;
  this.attrs = _.map(payload.fields, function(value, key){
    switch(key){
      case 'bytes':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,0xffff),
                                        'Arbitrary payload size in bytes');
      default:
        return mkLabelInput(key, value, function(){return true;}, 'Unknown');
    }
  });
}

_Payload_UI.prototype.toBase = function() {
  var result = new _Payload();
  result.name = this.name;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  result.bytes = result.fields.bytes;
  return result;
}

this.name = NAME;

this.create = function() {
  return new _Payload();
};

this.createUI = function(payload){
  return new _Payload_UI(payload);
};

});
