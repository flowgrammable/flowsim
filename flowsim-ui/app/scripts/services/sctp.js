'use strict';

angular.module('flowsimUiApp')
  .service('SCTP', function(fgUI, fgConstraints){

var NAME = 'SCTP';

var Payloads = {
 'Payload': 0
};

function _SCTP(){
  this.name = NAME;
  this.bytes = 20;
  this.fields = {
    src: 0,
    dst: 0
  };
}

function _SCTP_UI(sctp){
  sctp = sctp === undefined ? new _SCTP() : sctp;
  this.name = NAME;
  this.bytes = 20;
  this.attrs = _.map(sctp.fields, function(value, key){
    switch(key) {
      case 'src':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,0xffff),
                                        'Source port');
      case 'dst':
        return mkLabelInput(key, value, fgConstraints.isUInt(0,0xffff),
                                        'Destination Port');
      default:
        return mkLabelInput(key, value, function(){return true;}, 'Unknown');

    }
  });
}

_SCTP_UI.prototype.toBase = function() {
  var result = new _SCTP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
}

this.name = NAME;
this.Payloads = Object.keys(Payloads);
this.create = function() {
    return new _SCTP();
};

this.createUI = function(sctp){
  return new _SCTP_UI(sctp);
};

});
