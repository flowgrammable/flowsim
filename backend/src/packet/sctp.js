(function(){
var validator = require('validator');

exports.isPort = function(port){
  var num = parseInt(port);
  return num >= 0 && num <= 65535;
};

exports.sctp = function(){
  return {
        bytes: 12,
        fields: {
          'src' : this.isPort,
          'dst' : this.isPort
          },
        sequence: []
  };
};

})();
