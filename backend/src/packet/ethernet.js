var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;

var isMac = function(addr) {
  return macPattern.test(addr);
}

var isTypelen = function(addr) {
  return true;
}

exports.ethernet = function(){
  return {
        bytes: 14,
        fields: {
          'src':isMac,
          'dst':isMac,
          'typelen':isTypelen
          },
        sequence: ['VLAN', 'MPLS', 'ARP', 'IPv4', 'IPv6']
  };
}
