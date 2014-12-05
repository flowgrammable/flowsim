'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Protocols
 * @description
 * # Protocols
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Protocols', function(Noproto, Internal, Ethernet2) {

// Inser new protocols below ...
 
var Protocols = [
  Internal.Internal,
  Ethernet2.Ethernet,
  //VLAN2.VLAN,
  //MPLS2.MPLS,
  //ARP2.ARP,
  //IPv42.IPv4,
  //ICMPv42.ICMPv4
  //IPv62.IPv6,
  //ICMPv62.ICMPv6,
  //TCP2.TCP,
  //SCTP2.SCTP,
  //UDP2.UDP
];

// Build a listing of all protocols supported
var noprotoProtocols = _(Protocols).map(function(protocol) {
  return new Noproto.Protocol(protocol);
});

function MatchProfiles(mp) {
  if(_(mp).isObject()) {
    this.profiles = _(mp.profiles).map(function(profile) {
      return profile.clone();
    });
  } else {
    this.profiles = _(_(noprotoProtocols).map(function(protocol) {
      return protocol.getMatchProfiles();
    })).flatten();
  }
}

MatchProfiles.prototype.clone = function() {
  return new MatchProfiles(this);
};

function ActionProfiles(ap) {
  if(_(ap).isObject()) {
    this.profiles = _(ap.profiles).map(function(profile) {
      return profile.clone();
    });
  } else {
    this.profiles = _(_(noprotoProtocols).map(function(protocol) {
      return protocol.getActionProfiles();
    })).flatten();
  }
}

ActionProfiles.prototype.clone = function() {
  return new ActionProfiles(this);
};

return {
  MatchProfiles: MatchProfiles,
  ActionProfiles: ActionProfiles
};

});
