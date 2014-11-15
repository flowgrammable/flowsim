'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Extraction', function(ETHERNET, VLAN, MPLS, ARP, IPV4, IPV6, ICMPV4,
                                  ICMPV6, SCTP, TCP, UDP) {

function extract_ethernet(eth, key) {
  key.eth_src  = eth.src();
  key.eth_dst  = eth.dst();
  key.eth_type = eth.type();
}

function extract_vlan(vlan, key) {
  key.vlan.push({
    vid: vlan.vid(),
    pcp: vlan.pcp(),
    dei: vlan.dei(),
    type: vlan.type()
  });
}

function extract_arp(arp, key) {
  key.arp_opcode  = arp.opcode();
  key.arp_sha     = arp.sha();
  key.arp_spa     = arp.spa();
  key.arp_tha     = arp.tha();
  key.arp_tpa     = arp.tpa();
}

function extract_mpls(mpls, key) {
  key.mpls.push({
    label : mpls.label(),
    tc    : mpls.tc(),
    bos   : mpls.bos(),
    ttl   : mpls.ttl()
  });
}

function extract_ipv4(ipv4, key) {
  key.ipv4_dscp  = ipv4.dscp();
  key.ipv4_ecn   = ipv4.ecn();
  key.ipv4_proto = ipv4.proto();
  key.ipv4_ttl   = ipv4.ttl();
  key.ipv4_src   = ipv4.src();
  key.ipv4_dst   = ipv4.dst();
}

function extract_ipv6(ipv6, key) {
  key.ipv6_flabel = ipv6.flabel();
  key.ipv6_ttl    = ipv6.ttl();
  key.ipv6_src    = ipv6.src();
  key.ipv6_dst    = ipv6.dst();
}

function extract_icmpv4(icmpv4, key) {
  key.icmpv4_type = icmpv4.type();
  key.icmpv4_code = icmpv4.code();
}

function extract_icmpv6(icmpv6, key) {
  key.icmpv6.type      = icmpv6.type;
  key.icmpv6.code      = icmpv6.code;
  key.icmpv6.nd_tgt    = icmpv6.ndTgtAddr;
  key.icmpv6.nd_ll_src = icmpv6.ndLLSrc;
  key.icmpv6.nd_ll_tgt = icmpv6.ndLLTgt;
}

function extract_sctp(sctp, key) {
  key.sctp_src = sctp.src;
  key.sctp_dst = sctp.dst;
}

function extract_tcp(tcp, key) {
  key.tcp_src = tcp.src();
  key.tcp_dst = tcp.dst();
}

function extract_udp(udp, key) {
  key.udp_src = udp.src();
  key.udp_dst = udp.dst();
}

function extract(ctx) {
  _.each(ctx.packet.protocols, function(protocol) {
    switch(protocol.name) {
      case ETHERNET.NAME:
        extract_ethernet(protocol, ctx.key);
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

return {
  extract_ethernet: extract_ethernet,
  extract_vlan: extract_vlan,
  extract_arp: extract_arp,
  extract_mpls: extract_mpls,
  extract_udp: extract_udp,
  extract_tcp: extract_tcp,
  extract_ipv4: extract_ipv4,
  extract_ipv6: extract_ipv6,
  extract_icmpv4: extract_icmpv4,
  extract: extract
};

});
