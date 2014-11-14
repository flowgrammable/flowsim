'use strict';

describe('Service: extraction', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate services
  var extraction;
  beforeEach(inject(function (_Extraction_) {
    extraction = _Extraction_;
  }));

  var ETHERNET;
  beforeEach(inject(function (_ETHERNET_) {
    ETHERNET = _ETHERNET_;
  }));

  var VLAN;
  beforeEach(inject(function (_VLAN_) {
    VLAN = _VLAN_;
  }));

  var ARP;
  beforeEach(inject(function (_ARP_) {
    ARP = _ARP_;
  }));

  var UDP;
  beforeEach(inject(function (_UDP_) {
    UDP = _UDP_;
  }));

  var TCP;
  beforeEach(inject(function (_TCP_) {
    TCP = _TCP_;
  }));

  var Context;
  beforeEach(inject(function (_Context_) {
    Context = _Context_;
  }));

  it('extraction Ethernet Pass', function () {
    expect(!!extraction).toBe(true);
    expect(!!ETHERNET).toBe(true);
    expect(!!Context).toBe(true);

    // create protocols to match on

    var eth = ETHERNET.mkEthernet(
      'de:ad:be:ef:00:01',
      '12:34:56:78:90:ab',
      '0x8100');

    // create key to extract into
    var key = new Context.Key(null, 0);

    expect(key.eth_src).toBe(undefined);
    expect(key.eth_dst).toBe(undefined);
    expect(key.eth_type).toBe(undefined);

    extraction.extract_ethernet(eth, key);

    expect(key.eth_src).toBe(eth.src());
    expect(key.eth_dst).toBe(eth.dst());
    expect(key.eth_type).toBe(eth.type());
  });

  it('extraction VLAN Pass', function () {
    expect(!!extraction).toBe(true);
    expect(!!VLAN).toBe(true);
    expect(!!Context).toBe(true);

    // create protocols to match on

    var vlan = VLAN.mkVLAN(
      '0x01',
      '0x02',
      '0x7777',
      '0x8100');

    // create key to extract into
    var key = new Context.Key(null, 0);

    expect(key.vlan_vid).toBe(undefined);
    expect(key.vlan_pcp).toBe(undefined);

    extraction.extract_vlan(vlan, key);

    expect(key.vlan[0].vid).toBe(vlan.vid());
    expect(key.vlan[0].pcp).toBe(vlan.pcp());
  });

  it('extraction ARP Pass', function() {
    expect(!!extraction).toBe(true);
    expect(!!ARP).toBe(true);
    expect(!!Context).toBe(true);

    var arp = ARP.mkARP('0x0023', '00:11:22:33:44:55',
        '20.20.20.20', 'aa:aa:Aa:aa:aa:aa', '10.0.1.1');

    var key = new Context.Key(null, 0);

    expect(key.arp_opcode).toBe(undefined);
    expect(key.arp_sha).toBe(undefined);
    expect(key.arp_spa).toBe(undefined);
    expect(key.arp_tha).toBe(undefined);
    expect(key.arp_tpa).toBe(undefined);

    extraction.extract_arp(arp, key);

    expect(key.arp_opcode).toBe(arp.opcode());
    expect(key.arp_spa).toBe(arp.spa());
    expect(key.arp_tha).toBe(arp.tha());
    expect(key.arp_tpa).toBe(arp.tpa());
  });

  it('extraction UDP Pass', function () {
    expect(!!extraction).toBe(true);
    expect(!!UDP).toBe(true);
    expect(!!Context).toBe(true);

    // create protocols to match on

    var udp1 = UDP.mkUDP(
      65535,
      21);

    // create key to extract into
    var key = new Context.Key(null, 0);

    expect(key.udp_src).toBe(undefined);
    expect(key.udp_dst).toBe(undefined);

    extraction.extract_udp(udp1, key);

    expect(key.udp_src).toBe(udp1.src());
    expect(key.udp_dst).toBe(udp1.dst());
  });

  it('extraction TCP Pass', function () {
    expect(!!extraction).toBe(true);
    expect(!!UDP).toBe(true);
    expect(!!Context).toBe(true);

    var tcp1 = TCP.mkTCP(
      '65535',
      '0');

    var key = new Context.Key(null, 0);

    expect(key.tcp_src).toBe(undefined);
    expect(key.tcp_dst).toBe(undefined);

    extraction.extract_tcp(tcp1, key);

    expect(key.tcp_src).toBe(tcp1.src());
    expect(key.tcp_dst).toBe(tcp1.dst());
  });

});
