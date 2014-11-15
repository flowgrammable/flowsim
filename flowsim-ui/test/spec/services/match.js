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

  var MPLS;
  beforeEach(inject(function (_MPLS_) {
    MPLS = _MPLS_;
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

  var SCTP;
  beforeEach(inject(function (_SCTP_) {
    SCTP = _SCTP_;
  }));

  var Context;
  beforeEach(inject(function(_Context_) {
    Context = _Context_;
  }));

  var IPV4;
  beforeEach(inject(function(_IPV4_) {
    IPV4 = _IPV4_;
  }));

  var IPV6;
  beforeEach(inject(function(_IPV6_) {
    IPV6 = _IPV6_;
  }));

  var ICMPV4;
  beforeEach(inject(function (_ICMPV4_) {
    ICMPV4 = _ICMPV4_;
  }));

  var ICMPV6;
  beforeEach(inject(function (_ICMPV6_) {
    ICMPV6 = _ICMPV6_;
  }));

  it('Default Match', function() {
    var key = new Context.Key(null, 0);
    var match = new Match.Set();
    expect(match.match(key)).toBe(true);
  });

  it('Match equality default', function() {
    var match1 = new Match.Set();
    var match2 = new Match.Set();
    expect(match1.equal(match2)).toBe(true);
  });

  it('Match set equality', function() {
    var match1 = new Match.Set();
    var match2 = new Match.Set();
    var match3 = new Match.Set();
    var match4 = new Match.Set();
    var match5 = new Match.Set();

    match1.push(new Match.Match(null,
      'eth_src',
      new ETHERNET.MAC.Match(
        null,
        '00:11:22:33:44:55',
        '00:11:22:33:44:55'
      )));

    match2.push(new Match.Match(null,
      'eth_src',
      new ETHERNET.MAC.Match(
        null,
        '00:11:22:33:44:55',
        '00:11:22:33:44:55'
      )));

    match3.push(new Match.Match(null,
      'eth_src',
      new ETHERNET.MAC.Match(
        null,
        '00:00:22:33:44:55',
        '00:11:22:33:44:55'
      )));

    match4.push(new Match.Match(null,
      'eth_src',
      new ETHERNET.MAC.Match(
        null,
        '00:11:22:33:44:55',
        '00:00:22:33:44:55'
      )));

    match5.push(new Match.Match(null,
      'eth_dst',
      new ETHERNET.MAC.Match(
        null,
        '00:11:22:33:44:55',
        '00:11:22:33:44:55'
      )));

    expect(match2.equal(match1)).toBe(true);
    expect(match2.equal(match3)).toBe(false);
    expect(match2.equal(match4)).toBe(false);

    expect(match5.equal(match4)).toBe(false);
    expect(match5.equal(match3)).toBe(false);
    expect(match5.equal(match2)).toBe(false);
    expect(match5.equal(match1)).toBe(false);

    match1.push(new Match.Match(null,
      'eth_dst',
      new ETHERNET.MAC.Match(
        null,
        '00:11:22:33:44:55',
        '00:11:22:33:44:55'
      )));

    match1.push(new Match.Match(null,
      'eth_type',
      ETHERNET.mkTypeMatch('0x8100', '0xfff')));

    expect(match1.equal(match2)).toBe(false);
    expect(match1.equal(match3)).toBe(false);
    expect(match1.equal(match4)).toBe(false);
    expect(match1.equal(match5)).toBe(false);

    match2.push(new Match.Match(null,
      'eth_dst',
      new ETHERNET.MAC.Match(
        null,
        '00:11:22:33:44:55',
        '00:11:22:33:44:55'
      )));

    match2.push(new Match.Match(null,
      'eth_type',
      ETHERNET.mkTypeMatch('0x8100', '0xfff')));

    expect(match2.equal(match1)).toBe(true);
    expect(match2.equal(match3)).toBe(false);

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

    expect(match.summarize().toString()).toBe('eth');

    match.push(
      new Match.Match(null,
        'eth_dst',
        new ETHERNET.mkMACMatch(
          'ff:ff:ff:ff:ff:ff',
          'ff:ff:ff:ff:ff:ff')));

    expect(match.summarize().toString()).toBe('eth');

    match.push(
      new Match.Match(null,
        'eth_type',
        new ETHERNET.mkTypeMatch('0x0800', '0xffff')));

    expect(match.summarize().toString()).toBe('eth');

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

    expect(match.summarize().toString()).toBe('vlan');

    expect(match.match(key)).toBe(true);
  });

  it('IPv4 Match', function () {
    expect(!!Match).toBe(true);
    expect(!!IPV4).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'ipv4_dscp',
        new IPV4.mkDscpMatch('0x01','0xff')));

    expect(match.summarize().toString()).toBe('ipv4');

    match.push(
      new Match.Match(null,
        'ipv4_ecn',
        new IPV4.mkEcnMatch('0x02','0xff')));

    expect(match.summarize().toString()).toBe('ipv4');

    match.push(
      new Match.Match(null,
        'ipv4_proto',
        new IPV4.mkProtoMatch('0x03','0xff')));

    expect(match.summarize().toString()).toBe('ipv4');

    match.push(
      new Match.Match(null,
        'ipv4_src',
        new IPV4.mkAddressMatch('192.168.1.1','255.255.255.255')));

    match.push(
      new Match.Match(null,
        'ipv4_dst',
        new IPV4.mkAddressMatch('128.1.1.1','255.255.255.255')));

    expect(match.summarize().toString()).toBe('ipv4');
    expect(match.match(key)).toBe(false);

    key.ipv4_dscp = new IPV4.mkDscp('0x01');
    key.ipv4_ecn  = new IPV4.mkEcn('0x02');
    key.ipv4_proto = new IPV4.mkProto('0x03');
    key.ipv4_src = new IPV4.mkAddress('192.168.1.1');
    key.ipv4_dst = new IPV4.mkAddress('128.1.1.1');

    expect(match.summarize().toString()).toBe('ipv4');

    expect(match.match(key)).toBe(true);
  });

  it('MPLS Match', function () {
    expect(!!Match).toBe(true);
    expect(!!MPLS).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'mpls_label',
        new MPLS.mkLabelMatch('0x777777','0xffffff')));

    match.push(
      new Match.Match(null,
        'mpls_tc',
        new MPLS.mkTcMatch(
          '0x03',
          '0x03')));

    match.push(
      new Match.Match(null,
        'mpls_bos',
        new MPLS.mkBosMatch(
          '0x00',
          '0x00')));

    expect(match.match(key)).toBe(false);
    expect(match.summarize().toString()).toBe('mpls');
    key.mpls_label = new MPLS.mkLabel('0x777777');
    key.mpls_tc = new MPLS.mkTc('0x03');
    key.mpls_bos = new MPLS.mkBos('0xaa');

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

    expect(match.summarize().toString()).toBe('arp');

    match.push(
      new Match.Match(null,
        'arp_sha',
        new ARP.mkShaMatch(
          '00:aa:bb:cc:dd:ee',
          'ff:ff:ff:ff:ff:ff')));

    expect(match.summarize().toString()).toBe('arp');

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

    expect(match.summarize().toString()).toBe('arp');
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

  it('UDP Match set', function(){
    expect(!!Match).toBe(true);
    expect(!!UDP).toBe(true);

    var match = new Match.Set();
    var match1 = new Match.Set();
    var match2 = new Match.Set();
    match.push(
      new Match.Match(null,
        'udp_src',
        UDP.mkPortMatch(65535, '0xffff')));
    match.push(
      new Match.Match(null,
        'udp_dst',
        UDP.mkPortMatch(80, '0xffff')));

    match1.push(
      new Match.Match(null,
        'udp_src',
        UDP.mkPortMatch(65535, '0xffff')));

    expect(match1.equal(match)).toBe(false);

    match1.push(
      new Match.Match(null,
        'udp_dst',
        UDP.mkPortMatch(80, '0xffff')));

    expect(match1.equal(match)).toBe(true);

    match2.push(
      new Match.Match(null,
        'udp_src',
        UDP.mkPortMatch(65534, '0xffff')));

    expect(match1.equal(match2)).toBe(false);

    match2.push(
      new Match.Match(null,
        'udp_dst',
        UDP.mkPortMatch(80, '0xffff')));

    expect(match1.equal(match2)).toBe(false);

  });

  it('SCTP Match set', function(){
    expect(!!Match).toBe(true);
    expect(!!SCTP).toBe(true);

    var match = new Match.Set();
    var match1 = new Match.Set();
    var match2 = new Match.Set();
    match.push(
      new Match.Match(null,
        'sctp_src',
        SCTP.mkPortMatch(65535, '0xffff')));
    match.push(
      new Match.Match(null,
        'sctp_dst',
        SCTP.mkPortMatch(80, '0xffff')));

    match1.push(
      new Match.Match(null,
        'sctp_src',
        SCTP.mkPortMatch(65535, '0xffff')));

    expect(match1.equal(match)).toBe(false);

    match1.push(
      new Match.Match(null,
        'sctp_dst',
        SCTP.mkPortMatch(80, '0xffff')));

    expect(match1.equal(match)).toBe(true);

    match2.push(
      new Match.Match(null,
        'sctp_src',
        SCTP.mkPortMatch(65534, '0xffff')));

    expect(match1.equal(match2)).toBe(false);

    match2.push(
      new Match.Match(null,
        'sctp_dst',
        SCTP.mkPortMatch(80, '0xffff')));

    expect(match1.equal(match2)).toBe(false);

  });

  it('TCP Match', function () {
    expect(!!Match).toBe(true);
    expect(!!TCP).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'tcp_src',
        TCP.mkPortMatch(
          '22',
          '0xffff')));

    match.push(
      new Match.Match(null,
        'tcp_dst',
        TCP.mkPortMatch(
          '2222',
          '0xffff')));

    expect(match.match(key)).toBe(false);

    key.tcp_src = TCP.mkPort('22');
    key.tcp_dst = TCP.mkPort('2222');

    expect(match.match(key)).toBe(true);

    key.tcp_src = TCP.mkPort('65535');
    expect(match.match(key)).toBe(false);

    key.tcp_src = TCP.mkPort('22');
    key.tcp_dst = TCP.mkPort('65535');
    expect(match.match(key)).toBe(false);
  });

  it('IPV6 Match', function () {
    expect(!!Match).toBe(true);
    expect(!!IPV6).toBe(true);

    var match = new Match.Set();
    var match2 = new Match.Set();
    var match3 = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'ipv6_flabel',
        IPV6.mkFlabelMatch(
          '22',
          '0xffff')));

    expect(match.summarize().toString()).toBe('ipv6');
    match.push(
      new Match.Match(null,
        'ipv6_src',
        IPV6.mkAddressMatch(
          '2001:0db8:0000:0000:0000:ff00:0042:8329',
          'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')));

    expect(match.summarize().toString()).toBe('ipv6');
    match.push(
      new Match.Match(null,
        'ipv6_dst',
        IPV6.mkAddressMatch(
          '2002:0db8:0000:0000:0000:ff00:0042:8329',
          'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')));

    expect(match.summarize().toString()).toBe('ipv6');
    expect(match.match(key)).toBe(false);

    key.ipv6_flabel = IPV6.mkFlabel('22');
    key.ipv6_src    = IPV6.mkAddress('2001:0db8:0000:0000:0000:ff00:0042:8329');
    key.ipv6_dst    = IPV6.mkAddress('2002:0db8:0000:0000:0000:ff00:0042:8329');

    expect(match.match(key)).toBe(true);

    match2.push(
      new Match.Match(null,
        'ipv6_flabel',
        IPV6.mkFlabelMatch(
          '22',
          '0xffff')));

    expect(match.summarize().toString()).toBe('ipv6');
    match2.push(
      new Match.Match(null,
        'ipv6_src',
        IPV6.mkAddressMatch(
          '2001:0db8:0000:0000:0000:ff00:0042:8329',
          'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')));

    expect(match.summarize().toString()).toBe('ipv6');
    match2.push(
      new Match.Match(null,
        'ipv6_dst',
        IPV6.mkAddressMatch(
          '2002:0db8:0000:0000:0000:ff00:0042:8329',
          'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')));
    expect(match2.equal(match)).toBe(true);

    match3.push(
      new Match.Match(null,
        'ipv6_src',
        IPV6.mkAddressMatch(
          '2001:0db8:0000:0000:0000:ff00:0042:8329',
          'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')));

    expect(match3.equal(match)).toBe(false);
    expect(match3.equal(match2)).toBe(false);

  });

  it('Match Summarize Pass', function () {
    expect(!!Match).toBe(true);
    expect(!!IPV6).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);


    expect(match.summarize().toString()).toBe('*');
    match.push(
      new Match.Match(null,
        'ipv6_flabel',
        IPV6.mkFlabelMatch(
          '22',
          '0xffff')));

    expect(match.summarize().toString()).toBe('ipv6');
    match.push(
      new Match.Match(null,
        'mpls_label',
        MPLS.mkLabelMatch(
          '0x123456', '0xffffff')));

    expect(match.summarize().toString()).toBe('ipv6,mpls');
    match.push(
      new Match.Match(null,
        'ethernet_dst',
        ETHERNET.mkMACMatch(
          '00:bb:cc:aa:dd:ff', 'ff:ff:ff:ff:ff:ff')));

    match.push(
      new Match.Match(null,
        'ethernet_src',
        ETHERNET.mkMACMatch(
          '00:bb:cc:aa:dd:ff', 'ff:ff:ff:ff:ff:ff')));

    match.push(
      new Match.Match(null,
        'tcp_src',
        TCP.mkPortMatch(
          1234, '0xffff')));

    match.push(
      new Match.Match(null,
        'vlan_vid',
        VLAN.mkVidMatch(
          22, '0xffff')));

    match.push(
      new Match.Match(null,
        'ipv4_dscp',
        IPV4.mkDscpMatch(
          22, '0xff')));
    match.push(
      new Match.Match(null,
        'arp_spa',
        ARP.mkSpaMatch(
          '192.168.1.1', '222.222.22.222')));

    match.push(
      new Match.Match(null,
        'icmpv6_type',
        ICMPV6.mkTypeMatch(
          '0x12', '0xff')));

    match.push(
      new Match.Match(null,
        'icmpv4_type',
        ICMPV4.mkTypeMatch(
          '0x12', '0xff')));

    match.push(
      new Match.Match(null,
        'udp_src',
        UDP.mkPortMatch(
          1234, '0xffff')));

    match.push(
      new Match.Match(null,
        'sctp_src',
        SCTP.mkPortMatch(
          1234, '0xffff')));

    expect(match.summarize().toString()).toBe(
      'ipv6,mpls,eth,tcp,vlan,ipv4,arp,icmpv6,icmpv4,udp,sctp');
    expect(match.match(key)).toBe(false);

  });

  it('IPv4 Set match equal', function () {
    expect(!!Match).toBe(true);
    expect(!!IPV4).toBe(true);

    var match = new Match.Set();
    var match2 = new Match.Set();
    var match3 = new Match.Set();
    var key = new Context.Key(null, 0);

    expect(match.summarize().toString()).toBe('*');
    match.push(
      new Match.Match(null,
        'ipv4_dscp',
        new IPV4.mkDscpMatch(
          '22',
          '0xff')));

    expect(match.summarize().toString()).toBe('ipv4');
    match.push(
      new Match.Match(null,
        'ipv4_src',
        new IPV4.Address(null, '192.168.1.1', '255.255.255.255'
    )));

    expect(match2.summarize().toString()).toBe('*');
    match2.push(
      new Match.Match(null,
        'ipv4_dscp',
        new IPV4.mkDscpMatch(
          '22',
          '0xff')));

    expect(match2.summarize().toString()).toBe('ipv4');
    match2.push(
      new Match.Match(null,
        'ipv4_src',
        new IPV4.Address(null, '192.168.1.1', '255.255.255.255'
    )));

    expect(match2.equal(match)).toBe(true);

    match3.push(
      new Match.Match(null,
        'ipv4_dscp',
        new IPV4.mkDscpMatch(
          '22',
          '0xfe')));

    expect(match3.summarize().toString()).toBe('ipv4');
    match3.push(
      new Match.Match(null,
        'ipv4_src',
        new IPV4.Address(null, '192.168.1.1', '255.255.255.255'
    )));

    expect(match2.equal(match3)).toBe(false);

  });

  it('MPLS Set match equal', function () {
    expect(!!Match).toBe(true);
    expect(!!MPLS).toBe(true);

    var match = new Match.Set();
    var match2 = new Match.Set();
    var match3 = new Match.Set();
    var key = new Context.Key(null, 0);

    expect(match.summarize().toString()).toBe('*');
    match.push(
      new Match.Match(null,
        'mpls_label',
        new MPLS.mkLabelMatch(
          '0xaaaaaa',
          '0xffffff')));

    expect(match.summarize().toString()).toBe('mpls');
    match.push(
      new Match.Match(null,
        'mpls_tc',
        new MPLS.mkTcMatch('0x01', '0x02'
    )));

    expect(match2.summarize().toString()).toBe('*');
    match2.push(
      new Match.Match(null,
        'mpls_label',
        new MPLS.mkLabelMatch(
          '0xaaaaaa',
          '0xffffff')));

    expect(match2.summarize().toString()).toBe('mpls');
    match2.push(
      new Match.Match(null,
        'mpls_tc',
        new MPLS.mkTcMatch('0x01', '0x02'
    )));

    expect(match2.equal(match)).toBe(true);

    match3.push(
      new Match.Match(null,
        'mpls_label',
        new MPLS.mkLabelMatch(
          '0xaaaaab',
          '0xffffff')));

    expect(match3.summarize().toString()).toBe('mpls');
    match3.push(
      new Match.Match(null,
        'mpls_tc',
        new MPLS.mkTcMatch('0x01', '0x02'
    )));

    expect(match2.equal(match3)).toBe(false);

  });

  it('ICMPV6 Match', function () {
    expect(!!Match).toBe(true);
    expect(!!ICMPV6).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'icmpv6_type',
        ICMPV6.mkTypeMatch(
          '255',
          '0xff')));

    match.push(
      new Match.Match(null,
        'icmpv6_code',
        ICMPV6.mkCodeMatch(
          '0',
          '0xff')));

    expect(match.match(key)).toBe(false);

    key.icmpv6_type = ICMPV6.mkType('255');
    key.icmpv6_code = ICMPV6.mkType('0');

    expect(match.match(key)).toBe(true);

    key.icmpv6_type = ICMPV6.mkType('127');
    expect(match.match(key)).toBe(false);

    key.icmpv6_type = ICMPV6.mkType('255');
    key.icmpv6_code = ICMPV6.mkType('127');
    expect(match.match(key)).toBe(false);
  });

});
