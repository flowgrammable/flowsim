'use strict';

angular.module('flowsimUiApp')
  .factory('UDP', function(fgUI, fgConstraints){

var NAME = 'UDP';
var BYTES = 8;

var Payloads = {
 'Payload': 0
};

function UDP(){
  this.name = NAME;
  this.bytes = BYTES;
}

function UDP_UI(udp){
  udp = udp === undefined ? new UDP() : udp;
  this.name = NAME;
  this.bytes = BYTES;
  this.attrs = [{
    name: 'Src',
    value: udp.src().toString(),
    tip: 'Source port',
    test: fgConstraints.isUInt(0,0xffff)
  }, {
    name: 'Dst',
    value: udp.dst().toString(),
    tip: 'Destination port',
    test: fgConstraints.isUInt(0,0xffff)
  }];
}

UDP_UI.prototype.toBase = function() {
  var result = new UDP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

UDP_UI.prototype.setPayload = function() {
  //FIXME
  return true;
};

return {
  name: NAME,
  Payloads: _.keys(Payloads),
  create: function() { return new UDP(); },
  createUI: function(UDP) { return new UDP_UI(UDP); }
};

});
