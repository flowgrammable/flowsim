'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Dataplane', function dataplane() {
    // AngularJS will instantiate a singleton by calling "new" on this function
   

function Context(packet, in_port) {
  this.packet = null;
  this.key = {
    in_port: in_port
  };
  this.actionSet = [];
}
 
function arrival(packet, in_port) {
  return new Context(packet, in_port);
}

function extract_ethernet(eth, key) {
  key.dl_src = eth.src;
  key.dl_dst = eth.dst;
  key.dl_type = eth.typelen;
}

function extract_vlan(vlan, key) {
}

function extract_arp(arp, key) {

}

function extract_mpls(mpls, key) {
}

function extract_ipv4(ipv4, key) {
}

function extract_ipv6(ipv6, key) {
}

function extract_icmpv4(icmpv4, key) {
}

function extract_icmpv6(icmpv6, key) {
}

function extract_sctp(sctp, key) {
}

function extract_tcp(tcp, key) {
}

function extract_udp(udp, key) {
}

function extraction(ctx) {
  _.each(ctx.packet.protocols, function(protocol) {
    switch(protocol.name) {
      case ETHERNET.NAME:
        extract_arp(protocol, ctx.key);
        break;
      case VLAN.NAME:
        extract_vlan(protocol, ctx.key);
        break;
      case ARP.NAME:
        extract_arp(protocol, ctx.key);
        break;
      case MPLS.NAME:
        extract_mpls(protocol, ctx.key);
        break;
      case IPV4.NAME:
        extract_ipv4(protocol, ctx.key);
        break;
      case IPV6.NAME:
        extract_ipv6(protocol, ctx.key);
        break;
      case ICMPV4.NAME:
        extract_icmpv4(protocol, ctx.key);
        break;
      case ICMPV6.NAME:
        extract_icmpv6(protocol, ctx.key);
        break;
      case SCTP.NAME:
        extract_sctp(protocol, ctx.key);
        break;
      case TCP.NAME:
        extract_tcp(protocol, ctx.key);
        break;
      case UDP.NAME:
        extract_udp(protocol, ctx.key);
        break;
    }
  });
}

function Choice() {
}

Choice.prototype.step = function() {

};

function Selection() {
}

Selection.prototype.step = function() {

};

function Execution() {
}

Execution.prototype.step = function() {

};
   

return {
};
  
});
