'use strict';

angular.module('flowsimUiApp')
  .factory('TCP', function(fgUI, fgConstraints){

var NAME = 'TCP';

var Payloads = {
 'Payload': 0
};

function TCP(){
  this.name = NAME;
  this.bytes = 20;
  this.fields = {
    src: 0,
    dst: 0
  };
}

function TCP_UI(tcp){
  tcp = tcp === undefined ? new _TCP() : tcp;
  this.name = NAME;
  this.bytes = 20;
  this.attrs = _.map(tcp.fields, function(value, key){
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

TCP_UI.prototype.toBase = function() {
  var result = new _TCP();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
}

TCP_UI.prototype.setPayload = function() {
  return true;
}

return {
  name: NAME,
};

});
