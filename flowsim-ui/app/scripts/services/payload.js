'use strict';

angular.module('flowsimUiApp')
  .factory('PAYLOAD', function(fgUI, fgConstraints){

var NAME = 'Payload';

function Payload() {
  this.name = NAME;
  this.fields = {
    bytes: 0
  };
  this.bytes = this.fields.bytes;
}

function Payload_UI(payload){
  payload = payload === undefined ? new Payload() : payload;
  this.name = NAME;
  this.attrs = [{
      name: 'bytes',
      value: payload.fields.bytes,
      test: function(){return fgConstraints.isUInt(0, 0xffff); },
      tip: 'Payload bytes'}];
  this.bytes = this.attrs[0].value;
}

Payload_UI.prototype.toBase = function() {
  var result = new Payload();
  result.name = this.name;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  result.bytes = parseInt(this.attrs[0].value);
  return result;
};

return {
  name: NAME,
  create: function() { return new Payload(); },
  createUI: function(payload) { return new Payload_UI(payload); }
};

});
