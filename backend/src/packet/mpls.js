(function(){

var labelPattern = /^0x0[a-fA-F0-9]{5}$/;

exports.isLabel = function(label) {
  return labelPattern.test(label);
};

var tcPattern = /^[0-7]$/;

exports.isTc = function(tc) {
  return tcPattern.test(tc);
};

var bosPattern = /^[0-1]$/;

exports.isBos = function(bos){
  return bosPattern.test(bos);
};


exports.mpls = function(){
  return {
        bytes: 4,
        fields: {
          'label' : this.isLabel,
          'tc' : this.isTc,
          'bos': this.isBos
          },
        sequence: ['VLAN', 'MPLS', 'ARP', 'IPv4', 'IPv6']
  };
};

})();
