(function(){
var validator = require('validator');

var opcodePattern = /^[0-1]$/;

exports.isOpcode = function(opcode) {
  return opcodePattern.test(opcode);
};

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;

exports.isMac = function(mac) {
  return macPattern.test(mac);
};

exports.isIPaddress = function(address){
  return validator.isIP(address, 4);
};


exports.arp = function(){
  return {
        bytes: 28,
        fields: {
          'opcode' : this.isOpcode,
          'sha' : this.isMac,
          'spa': this.isIPaddress,
          'tha': this.isMac,
          'tpa': this.isIPAddress
          },
        sequence: []
  };
};

})();
