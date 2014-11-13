'use strict';

angular.module('flowsimUiApp')
  .factory('SCTP', function(fgUI, fgConstraints){

var NAME = 'SCTP';
var BYTES = 20;

var Payloads = {
 'Payload': 0
};

function SCTP(){
  this.name = NAME;
  this.bytes = BYTES;
}

function SCTP_UI(sctp){
  sctp = sctp === undefined ? new SCTP() : sctp;
  this.name = NAME;
  this.bytes = 20;
  this.attrs = [{
    name: 'Src',
    value: sctp.src().toString(),
    tip: 'Source port',
    test:  fgConstraints.isUInt(0,0xffff)
  }, {
    name: 'Dst',
    value: sctp.dst().toString(),
    tip: 'Desination port',
    test:  fgConstraints.isUInt(0,0xffff)
  }];
}

SCTP_UI.prototype.toBase = function() {
  var result = new SCTP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

SCTP_UI.prototype.setPayload = function() {
  //FIXME
  return true;
};

return {
  name: NAME,
  Payloads: _.keys(Payloads),
  create: function() { return new SCTP(); },
  createUI: function(sctp){ return new SCTP_UI(sctp); }
};

});
