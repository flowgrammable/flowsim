'use strict';

angular.module('flowsimUiApp')
  .service('PAYLOAD', function(fgUI, fgConstraints){

var NAME = 'Payload';

function _Payload() {
  this.name = NAME;
  this.fields = {
    bytes: 0
  };
  this.bytes = this.fields.bytes;
}

function _Payload_UI(payload){
  payload = payload === undefined ? new _Payload() : payload;
  var x = this;
  this.name = NAME;
  this.attrs = [{
      name: 'bytes',
      value: payload.fields.bytes,
      test: function(){return true;},
      tip: 'Payload bytes'}];
  this.bytes = this.attrs[0].value;
}

_Payload_UI.prototype.toBase = function() {
  var result = new _Payload();
  result.name = this.name;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  result.bytes = parseInt(this.attrs[0].value);
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
