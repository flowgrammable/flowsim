(function(){
var validator = require('validator');



exports.isPort = function(port){
  var num = parseInt(port);
  return num >= 0 && num <= 65535;
}

exports.tcp = function(){
  return {
        bytes: 8,
        fields: {
          'src' : this.isPort,
          'dst' : this.isPort
          },
        sequence: ['ICMPv4', 'TCP', 'UDP', 'SCTP']
  };
};

})();
