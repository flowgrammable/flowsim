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
  //ICMPv42.ICMPv4,
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
      return new Noproto.MatchProfile(profile);
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
      return new Noproto.ActionProfile(profile);
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

// Dependency graph
var _Graph = {
  Ethernet: Ethernet2.Payloads,
  //VLAN: VLAN2.Payloads,
  //MPLS: MPLS2.Payloads,
  //ARP: ARP2.Payloads,
  //IPv4: IPv42.Payloads,
  //ICMPv4: ICMPv42.Payloads,
  //IPv6: IPv62.Payloads,
  //ICMPv6: ICMPv62.Payloads,
  //TCP: TCP2.Payloads,
  //SCTP: SCTP2.Payloads,
  //UDP: UDP2.Payloads
};

// Simple dependency search function
function Graph(protocol, field, value) {
  if(!_(_Graph).has(protocol)) { return ''; }
  if(!_(_Graph[protocol]).has(field)) { return ''; }
  if(!_(_Graph[protocol][value]).has(value)) { return ''; }
  return _Graph[protocol][field][value];
}

return {
  Root: ['Internal', 'Ethernet'],
  Graph: Graph,
  MatchProfiles: MatchProfiles,
  ActionProfiles: ActionProfiles
};

});
