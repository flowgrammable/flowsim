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

var ipv6Pattern = /^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}$/;

exports.isIPv6 = function(addr) {
  return ipv6Pattern.test(addr);
};

exports.ipv6 = function(){
  return {
        bytes: 40,
        fields: {
          'dscp' : this.isdscp,
          'ecn' : this.isecn,
          'proto': this.isProto,
          'src' : this.isIPv6,
          'dst' : this.isIPv6,
          'flabel' : this.isIPv6,
          'exthdr' : this.isIPv6
          },
        sequence: ['ICMPv6', 'TCP', 'UDP', 'SCTP']
  };
};

})();
