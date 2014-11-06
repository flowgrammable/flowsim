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
   
// This is the primary datastructure that follows the packet through the
// pipeline
function Context(packet, buffer_id, in_port) {
  this.packet = null;           // packet data
  this.buffer_id = buffer_id;   // stored id info

  this.key = {                // extracted key
    in_port: in_port
  };

  this.actionSet = [];      // action set carried
  this.metadata = null;     // metadata carried
  this.meter_id = null;     // meter to apply
  this.table_id = null;     // goto table
}

// Clear the action set
Context.prototype.clear = function() {
  this.actionSet = [];
};

// Write (append) actions to the action set
Context.prototype.write = function(actions) {
  this.actionSet.concat(actions);
};

// set or get the metadata
Context.prototype.metadata = function(metadata) {
  if(metadata !== undefined && metadata !== null) {
  } else {

  }
};

// set or get the meter id
Context.prototype.meter = function(meter) {
};

// set or get the next table id
Context.prototype.table = function(table) {
};
 
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
