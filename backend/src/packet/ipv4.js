(function(){
var validator = require('validator');

var dscpPattern = /^0x[0-3][a-fA-F0-9]$/;


exports.isdscp = function(addr) {
  return dscpPattern.test(addr);
};

var ecnPattern = /^0x0[0-3]$/;

exports.isecn = function(type) {
  return ecnPattern.test(type);
};

var protoPattern = /^0x[a-fA-F0-9]{2}$/;

exports.isProto = function(proto){
  return protoPattern.test(proto);
};

exports.isIPaddress = function(address){
  return validator.isIP(address, 4);
};

exports.ipv4 = function(){
  return {
        bytes: 20,
        fields: {
          'dscp' : this.isdscp,
          'ecn' : this.isecn,
          'proto': this.isProto,
          'src' : this.isIPaddress,
          'dst' : this.isIPaddress
          },
        sequence: ['ICMPv4', 'TCP', 'UDP', 'SCTP']
  };
};

})();
