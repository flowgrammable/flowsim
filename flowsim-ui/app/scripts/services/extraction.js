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
    label : mpls.label,
    tc    : mpls.tc,
    bos   : mpls.bos
  });
}

function extract_ipv4(ipv4, key) {
  key.ip_dscp  = ipv4.dscp();
  key.ip_ecn   = ipv4.ecn();
  key.ip_proto = ipv4.proto();
  key.ip_ttl   = ipv4.ttl();
  key.ip_src   = ipv4.src();
  key.ip_dst   = ipv4.dst();
}

function extract_ipv6(ipv6, key) {
  key.ip_dscp    = ipv6.dscp;
  key.ip_ecn     = ipv6.ecn;
  key.ip_proto   = ipv6.proto;
  key.ip_src     = ipv6.src;
  key.ip_dst     = ipv6.dst;
  key.flow_label = ipv6.flowLabel;
  key.ext_hdr    = ipv6.extHdr;
}

function extract_icmpv4(icmpv4, key) {
  key.icmpv4.type = icmpv4.type;
  key.icmpv4.code = icmpv4.code;
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

function extract(packet, key) {
  _.each(packet.protocols, function(protocol) {
    switch(protocol.name) {
      case ETHERNET.NAME:
        extract_ethernet(protocol, key);
        break;
      case VLAN.NAME:
        extract_vlan(protocol, key);
        break;
      case ARP.NAME:
        extract_arp(protocol, key);
        break;
      case MPLS.NAME:
        extract_mpls(protocol, key);
        break;
      case IPV4.NAME:
        extract_ipv4(protocol, key);
        break;
      case IPV6.NAME:
        extract_ipv6(protocol, key);
        break;
      case ICMPV4.NAME:
        extract_icmpv4(protocol, key);
        break;
      case ICMPV6.NAME:
        extract_icmpv6(protocol, key);
        break;
      case SCTP.NAME:
        extract_sctp(protocol, key);
        break;
      case TCP.NAME:
        extract_tcp(protocol, key);
        break;
      case UDP.NAME:
        extract_udp(protocol, key);
        break;
    }
  });
}

return {
  extract_ethernet: extract_ethernet,
  extract_vlan: extract_vlan,
  extract_arp: extract_arp,
  extract_udp: extract_udp,
  extract_tcp: extract_tcp,
  extract_ipv4: extract_ipv4,
  process: extract
};

});
