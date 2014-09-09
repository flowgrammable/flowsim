
var fgProtocol = (function(){

function _create(name) {
  switch(name) {
    case 'Ethernet': return fgEthernet.create();
    case 'VLAN': return fgVLAN.create();
    case 'ARP': return fgARP.create();
    case 'MPLS': return fgMPLS.create();
    case 'IPv4': return fgIPv4.create();
    case 'IPv6': return fgIPv6.create();
    case 'ICMPv4': return fgICMPv4.create();
    case 'ICMPv6': return fgICMPv6.create();
    case 'TCP': return fgTCP.create();
    case 'UDP': return fgUDP.create();
    case 'SCTP': return fgSCTP.create();
    default: throw ('create - Unknown protocol: ' + name);
  }
}

return {
  create: _create
};

})();

