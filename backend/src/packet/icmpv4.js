(function(){
var validator = require('validator');

var typePattern = /^0x[a-fA-F0-9]{2}$/;

exports.istype = function(addr) {
  return dscpPattern.test(addr);
};

exports.icmpv4 = function(){
  return {
        bytes: 4,
        fields: {
          'type' : this.istype,
          'code' : this.istype
          },
        sequence: []
  };
};

})();
