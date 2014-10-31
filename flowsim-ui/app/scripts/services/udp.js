'use strict';

angular.module('flowsimUiApp')
  .service('UDP', function(fgUI, fgConstraints){

var NAME = 'UDP';

var Payloads = {
 'Payload': 0
};

function _UDP(){
  this.name = NAME;
  this.bytes = 20;
  this.fields = {
    src: 0,
    dst: 0
  };
}

function _UDP_UI(udp){
  udp = udp === undefined ? new _UDP() : udp;
  this.name = NAME;
  this.bytes = 8;
  this.attrs = _.map(udp.fields, function(value, key){
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

_UDP_UI.prototype.toBase = function() {
  var result = new _UDP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
}

this.name = NAME;
this.Payloads = Object.keys(Payloads);
this.create = function() {
    return new _UDP();
};

this.createUI = function(UDP){
  return new _UDP_UI(UDP);
};

});
