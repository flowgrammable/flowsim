'use strict';

describe('Service: match', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Match;
  beforeEach(inject(function (_Match_) {
    Match = _Match_;
  }));

  var UInt;
  beforeEach(inject(function (_UInt_) {
    UInt = _UInt_;
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

  var Context;
  beforeEach(inject(function(_Context_) {
    Context = _Context_;
  }));

  it('Default Match', function() {
    var key = new Context.Key(null, 0);
    var match = new Match.Set();
    expect(match.match(key)).toBe(true);
  });

  it('Ethernet Match', function () {
    expect(!!Match).toBe(true);
    expect(!!ETHERNET).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'eth_src',
        new ETHERNET.MAC.Match(
          null,
          '00:00:00:00:00:00',
          '00:00:00:00:00:00')));

    match.push(
      new Match.Match(null,
        'eth_dst',
        ETHERNET.mkMACMatch(
          'ff:ff:ff:ff:ff:ff',
          'ff:ff:ff:ff:ff:ff')));

    match.push(
      new Match.Match(null,
        'eth_type',
        ETHERNET.mkTypeMatch('0x0800', '0xffff')));

    expect(match.match(key)).toBe(false);

    key.eth_src = new ETHERNET.mkMAC('00:00:00:00:00:00');
    key.eth_dst = new ETHERNET.mkMAC('ff:ff:ff:ff:ff:ff');
    key.eth_type = new ETHERNET.mkType(0x0800);

    expect(match.match(key)).toBe(true);

    key.eth_src = new ETHERNET.mkMAC('00:00:00:00:00:01');
    expect(match.match(key)).toBe(true);

    key.eth_type = new ETHERNET.mkType('0x0806');
    expect(match.match(key)).toBe(false);
  });

  it('VLAN Match', function () {
    expect(!!Match).toBe(true);
    expect(!!VLAN).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'vlan_pcp',
        new VLAN.mkPcpMatch('0x00','0x00')));

    match.push(
      new Match.Match(null,
        'vlan_vid',
        new VLAN.mkVidMatch(
          '0xffff',
          '0xffff')));

    expect(match.match(key)).toBe(false);

    key.vlan_vid = new VLAN.mkVid('0xffff');
    key.vlan_pcp = new VLAN.mkPcp('0x00');

    expect(match.match(key)).toBe(true);
  });

  it('ARP Match', function () {
    expect(!!Match).toBe(true);
    expect(!!ARP).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'arp_opcode',
        new ARP.mkOpcodeMatch('0x0023','0xffff')));

    match.push(
      new Match.Match(null,
        'arp_sha',
        new ARP.mkShaMatch(
          '00:aa:bb:cc:dd:ee',
          'ff:ff:ff:ff:ff:ff')));

    match.push(
      new Match.Match(null,
        'arp_spa',
        new ARP.mkSpaMatch(
          '192.168.1.2',
          '255.255.255.255')));

    match.push(
      new Match.Match(null,
        'arp_tha',
        new ARP.mkThaMatch(
          '11:aa:bb:cc:dd:ee',
          'ff:ff:ff:ff:ff:ff')));

   match.push(
      new Match.Match(null,
        'arp_tpa',
        new ARP.mkTpaMatch(
          '192.168.1.100',
          '255.255.255.255')));

    expect(match.match(key)).toBe(false);

    key.arp_opcode = ARP.mkOpcode('0x0023');
    key.arp_sha    = ARP.mkSha('00:aa:bb:cc:dd:ee');
    key.arp_spa    = ARP.mkSpa('192.168.1.2');
    key.arp_tha    = ARP.mkTha('11:aa:bb:cc:dd:ee');
    key.arp_tpa    = ARP.mkTpa('192.168.1.100');

    expect(match.match(key)).toBe(true);

    key.arp_sha = ARP.mkSha('aa:bb:cc:dd:ee:ff');

    expect(match.match(key)).toBe(false);
  });

  it('UDP Match', function () {
    expect(!!Match).toBe(true);
    expect(!!UDP).toBe(true);

    var match = new Match.Set();
    match.push(
      new Match.Match(null,
        'udp_src',
        UDP.mkPortMatch(65535, '0xffff')));
    match.push(
      new Match.Match(null,
        'udp_dst',
        UDP.mkPortMatch(80, '0xffff')));

    var key = new Context.Key(null, 0);
    expect(match.match(key)).toBe(false);

    key.udp_src = new UDP.mkPort(2345);
    key.udp_dst = new UDP.mkPort(0);
    expect(match.match(key)).toBe(false);

    key.udp_src = new UDP.mkPort(65535);
    key.udp_dst = new UDP.mkPort(0);
    expect(match.match(key)).toBe(false);

    key.udp_src = new UDP.mkPort(2345);
    key.udp_dst = new UDP.mkPort(80);
    expect(match.match(key)).toBe(false);

    key.udp_src = new UDP.mkPort(65535);
    key.udp_dst = new UDP.mkPort(80);
    expect(match.match(key)).toBe(true);


    var match = new Match.Set();
    match.push(
      new Match.Match(null,
        'udp_src',
        UDP.mkPortMatch(65535, '0x0')));
    match.push(
      new Match.Match(null,
        'udp_dst',
        UDP.mkPortMatch(80, '0xffff')));

    var key = new Context.Key(null, 0);
    expect(match.match(key)).toBe(false);

    key.udp_src = new UDP.mkPort(2345);
    key.udp_dst = new UDP.mkPort(0);
    expect(match.match(key)).toBe(false);

    key.udp_src = new UDP.mkPort(65535);
    key.udp_dst = new UDP.mkPort(0);
    expect(match.match(key)).toBe(false);

    key.udp_src = new UDP.mkPort(2345);
    key.udp_dst = new UDP.mkPort(80);
    expect(match.match(key)).toBe(true);

    key.udp_src = new UDP.mkPort(65535);
    key.udp_dst = new UDP.mkPort(80);
    expect(match.match(key)).toBe(true);

  });

});
