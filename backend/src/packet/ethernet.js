(function(){

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;

exports.isMac = function(addr) {
  return macPattern.test(addr);
};

var typePattern = /^0x[a-fA-F0-9]{4}$/;

exports.isTypelen = function(type) {
  return typePattern.test(type);
};

exports.ethernet = function(){
  return {
        bytes: 14,
        fields: {
          'src' : this.isMac,
          'dst' : this.isMac,
          'typelen': this.isTypelen
          },
        sequence: ['VLAN', 'MPLS', 'ARP', 'IPv4', 'IPv6']
  };
};

})();
