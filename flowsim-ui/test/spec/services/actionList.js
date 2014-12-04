'use strict';

describe('Service: actionList', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Action;
  beforeEach(inject(function (_Action_) {
    Action = _Action_;
  }));

  var fgConstraints;
  beforeEach(inject(function (_fgConstraints_) {
    fgConstraints = _fgConstraints_;
  }));

  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  var Ethernet;
  beforeEach(inject(function (_ETHERNET_) {
    Ethernet = _ETHERNET_;
  }));

  var ARP;
  beforeEach(inject(function (_ARP_) {
    ARP = _ARP_;
  }));

  var IPV4;
  beforeEach(inject(function (_IPV4_) {
    IPV4 = _IPV4_;
  }));

  var VLAN;
  beforeEach(inject(function (_VLAN_) {
    VLAN = _VLAN_;
  }));

  var MPLS;
  beforeEach(inject(function(_MPLS_) {
    MPLS = _MPLS_;
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

  var IPV6;
  beforeEach(inject(function (_IPV6_) {
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

  var ND;
  beforeEach(inject(function (_ND_) {
    ND = _ND_;
  }));


  it('Action list empy construction', function() {
    var al = new Action.List();
    var j = JSON.stringify(al);
    var j_ = new Action.List(JSON.parse(j));
    expect(j_.actions.length).toBe(0);
  });

  it('Action list full construction', function() {
    var al = new Action.List();
    var op = Action.Available()[0].actions[0];
    var o = op.mkType(5);
    al.push(o);
    expect(al.actions.length).toBe(1);

    var gp = Action.Available()[0].actions[1];
    var g = gp.mkType(1);
    al.push(g);
    expect(al.actions.length).toBe(2);
    expect(al.actions[1].group_id).toBe(1);

    var qp = Action.Available()[0].actions[2];
    var q = qp.mkType(8);
    al.push(q);

    var j = JSON.stringify(al);
    var j_ = new Action.List(JSON.parse(j));

    expect(j_.actions[1].group_id).toBe(1);
    expect(j_.actions[2].queue_id).toBe(8);
  });

  it('Action List execute', function(){
    var pkt = new Packet.Packet('test packet');
    var al = new Action.List();

    var popvlan = new Action.Pop(null, new VLAN.VLAN());
    var pushvlan = new Action.Push(null, new VLAN.VLAN());
    var decttl = new Action.DecTTL(null, 'IPv4');
    var sfVlanVID = new Action.SetField(null,
    VLAN.mkVid('0x7777'), VLAN.name, VLAN.vid);
    var sfEthSrc = new Action.SetField(null,
    Ethernet.mkMAC('11:11:11:11:11:11'), Ethernet.name, Ethernet.src);
    var sfEthDst = new Action.SetField(null,
    Ethernet.mkMAC('22:22:22:22:22:22'),Ethernet.name, Ethernet.dst);
    var sfIPsrc = new Action.SetField(null,
    IPV4.mkAddress('10.10.10.10'),IPV4.name, IPV4.src);
    var sfIPdst = new Action.SetField(null,
    IPV4.mkAddress('100.100.100.100'), IPV4.name, IPV4.dst);
    var setQ = new Action.Queue(null, 1);

    al.push(popvlan);
    al.push(pushvlan);
    al.push(decttl);
    al.push(sfVlanVID);
    al.push(sfEthSrc);
    al.push(sfEthDst);
    al.push(sfIPsrc);
    al.push(sfIPdst);
    al.push(setQ)

    pkt.push(VLAN.mkVLAN('0x00', '0x1', '0x5555', '0x0800'));
    pkt.protocols[0].type('0x8100');
    expect(pkt.protocols.length).toBe(2);
    pkt.push(IPV4.mkIPv4('0x01', '0x01', '0x00', '0x77', '2.2.2.2', '1.1.1.1'));

    al.execute(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(3);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8100');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0800');
    expect(pkt.protocols[2].ttl().toString(16)).toBe('0x76');
    expect(pkt.protocols[0].src().toString(16)).toBe('11:11:11:11:11:11');
    expect(pkt.protocols[0].dst().toString(16)).toBe('22:22:22:22:22:22');
    expect(pkt.protocols[2].src().toString()).toBe('10.10.10.10');
    expect(pkt.protocols[2].dst().toString()).toBe('100.100.100.100');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x7777');

    expect(al.empty()).toBe(true);
  });




});
