'use strict';
 /*
 * 
 * @ngdoc service
 * @name flowsimUiApp.Protocols
 * @description
 * # Protocols
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Protocols', function(Noproto, Internal, Ethernet, 
        VLAN, ARP, IPv4, MPLS, ICMPv4, IPv6, ICMPv6, TCP, SCTP, UDP) {

// Inser new protocols below ...
 
var Protocols = [
  Internal.Internal,
  Ethernet.Ethernet,
  VLAN.VLAN,
  MPLS.MPLS,
  ARP.ARP,
  IPv4.IPv4,
  ICMPv4.ICMPv4,
  IPv6.IPv6,
  ICMPv6.ICMPv6,
  TCP.TCP,
  SCTP.SCTP,
  UDP.UDP
];

function getField(protoName, fieldName){
  var protocol = _(noprotoProtocols).find(function(proto){
    return proto.name === protoName;
  });
  return _(protocol.fields).find(function(field){
    return fieldName === field.name;
  });
}

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

MatchProfiles.prototype.toBase = function() {
  return {
    profiles: _(this.profiles).map(function(matchProfile){
      return matchProfile.toBase();
    })
  };
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

ActionProfiles.prototype.toBase = function() {
  return {
    profiles: _(this.profiles).map(function(actionProfile){
      return actionProfile.toBase();
    })
  };
};

// Dependency graph
var _Graph = {
  Ethernet: Ethernet.Payloads,
  VLAN: VLAN.Payloads,
  MPLS: MPLS.Payloads,
  ARP: ARP.Payloads,
  IPv4: IPv4.Payloads,
  ICMPv4: ICMPv4.Payloads,
  IPv6: IPv6.Payloads,
  ICMPv6: ICMPv6.Payloads,
  TCP: TCP.Payloads,
  SCTP: SCTP.Payloads,
  UDP: UDP.Payloads
};

// Simple dependency search function
function Graph(protocol, field, value) {
  if(!_(_Graph).has(protocol)) { return ''; }
  if(!_(_Graph[protocol]).has(field)) { return ''; }
  if(!_(_Graph[protocol][field]).has(value)) { return ''; }
  return _Graph[protocol][field][value];
}

return {
  Root: ['Internal', 'Ethernet'],
  Graph: Graph,
  MatchProfiles: MatchProfiles,
  ActionProfiles: ActionProfiles,
  Protocols: noprotoProtocols,
  Payloads: _Graph,
  getField: getField
};

});
