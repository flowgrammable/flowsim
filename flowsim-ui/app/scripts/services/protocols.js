'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Protocols
 * @description
 * # Protocols
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Protocols', function(Noproto, Ethernet2) {
 
var Protocols = [
  Ethernet2.Ethernet,
  //VLAN2.VLAN,
  //MPLS2.MPLS,
  //ARP2.ARP,
  //IPv42.IPv4,
  //ICMPv42.ICMPv4
  //IPv62.IPv6,
  //ICMPv62.ICMPv6
];

// Build a listing of all protocols supported
var noprotoProtocols = _(Protocols).map(function(protocol) {
  new Noproto.Protocol(protocol);
});

// Extract the set of protocol match profiles
var MatchProfiles = _(noprotoProtocols).map(function(protocol) {
  return protocol.getMatchProfiles();
});

var ActionProfiles = _(noprotoProtocols).map(function(protocol) {
  return protocol.getActionProfiles();
});

return {
  MatchProfiles: MatchProfiles,
  ActionProfiles: ActionProfiles
};

});
