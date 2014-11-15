'use strict';

describe('Service: action', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Action;
  beforeEach(inject(function (_Action_) {
    Action = _Action_;
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

  var IPV6;
  beforeEach(inject(function (_IPV6_) {
    IPV6 = _IPV6_;
  }));

  var ICMPV4;
  beforeEach(inject(function (_ICMPV4_) {
    ICMPV4 = _ICMPV4_;
  }));


  it('Ethernet test', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');

    set.setField(new Action.SetField(
      null,
      Ethernet.name, Ethernet.src,
      Ethernet.mkMAC('01:03:05:07:09:0b')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[0].src().toString()).toBe('01:03:05:07:09:0b');
    expect(pkt.protocols[0].dst().toString()).toBe('00:00:00:00:00:00');
    expect(pkt.protocols[0].type().toString(16)).toBe('0x0000');

    set.setField(new Action.SetField(
      null,
      Ethernet.name, Ethernet.dst,
      Ethernet.mkMAC('ff:ff:ff:ff:ff:ff')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[0].src().toString()).toBe('01:03:05:07:09:0b');
    expect(pkt.protocols[0].dst().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[0].type().toString(16)).toBe('0x0000');

    set.setField(new Action.SetField(
      null,
      Ethernet.name, Ethernet.type,
      Ethernet.mkType('0x0806')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[0].src().toString()).toBe('01:03:05:07:09:0b');
    expect(pkt.protocols[0].dst().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[0].type().toString(16)).toBe('0x0806');
  });

  it('ARP test', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(ARP.mkARP());

    set.setField(new Action.SetField(
      null,
      ARP.name, ARP.opcode,
      ARP.mkOpcode('0x0001')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].opcode().toString(16)).toBe('0x0001');
    expect(pkt.protocols[1].sha().toString()).toBe('00:00:00:00:00:00');
    expect(pkt.protocols[1].spa().toString()).toBe('0.0.0.0');
    expect(pkt.protocols[1].tha().toString()).toBe('00:00:00:00:00:00');
    expect(pkt.protocols[1].tpa().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      ARP.name, ARP.sha,
      ARP.mkSha('ff:ff:ff:ff:ff:ff')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].opcode().toString(16)).toBe('0x0001');
    expect(pkt.protocols[1].sha().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[1].spa().toString()).toBe('0.0.0.0');
    expect(pkt.protocols[1].tha().toString()).toBe('00:00:00:00:00:00');
    expect(pkt.protocols[1].tpa().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      ARP.name, ARP.spa,
      ARP.mkSpa('1.1.1.1')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].opcode().toString(16)).toBe('0x0001');
    expect(pkt.protocols[1].sha().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[1].spa().toString()).toBe('1.1.1.1');
    expect(pkt.protocols[1].tha().toString()).toBe('00:00:00:00:00:00');
    expect(pkt.protocols[1].tpa().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      ARP.name, ARP.tha,
      ARP.mkTha('22:22:22:22:22:22')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].opcode().toString(16)).toBe('0x0001');
    expect(pkt.protocols[1].sha().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[1].spa().toString()).toBe('1.1.1.1');
    expect(pkt.protocols[1].tha().toString()).toBe('22:22:22:22:22:22');
    expect(pkt.protocols[1].tpa().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      ARP.name, ARP.tpa,
      ARP.mkTpa('127.0.0.1')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].opcode().toString(16)).toBe('0x0001');
    expect(pkt.protocols[1].sha().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[1].spa().toString()).toBe('1.1.1.1');
    expect(pkt.protocols[1].tha().toString()).toBe('22:22:22:22:22:22');
    expect(pkt.protocols[1].tpa().toString()).toBe('127.0.0.1');

    set.setField(new Action.SetField(
      null,
      ARP.name, ARP.spa,
      ARP.mkSpa('192.192.192.192')
    ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].opcode().toString(16)).toBe('0x0001');
    expect(pkt.protocols[1].sha().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[1].spa().toString()).toBe('192.192.192.192');
    expect(pkt.protocols[1].tha().toString()).toBe('22:22:22:22:22:22');
    expect(pkt.protocols[1].tpa().toString()).toBe('127.0.0.1');

 });

  it('IPv4 SetField', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('ipv4pack');
    pkt.push(IPV4.mkIPv4());

    set.setField(new Action.SetField(
      null,
      IPV4.name, IPV4.dscp,
      IPV4.mkDscp('0x01')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].dscp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ecn().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].proto().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].src().toString()).toBe('0.0.0.0');
    expect(pkt.protocols[1].dst().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      IPV4.name, IPV4.ecn,
      IPV4.mkEcn('0x1')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].dscp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ecn().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].proto().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].src().toString()).toBe('0.0.0.0');
    expect(pkt.protocols[1].dst().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      IPV4.name, IPV4.proto,
      IPV4.mkProto('0x06')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].dscp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ecn().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].proto().toString(16)).toBe('0x06');
    expect(pkt.protocols[1].src().toString()).toBe('0.0.0.0');
    expect(pkt.protocols[1].dst().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      IPV4.name, IPV4.src,
      IPV4.mkSrc('192.168.1.1')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].dscp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ecn().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].proto().toString(16)).toBe('0x06');
    expect(pkt.protocols[1].src().toString()).toBe('192.168.1.1');
    expect(pkt.protocols[1].dst().toString()).toBe('0.0.0.0');

    set.setField(new Action.SetField(
      null,
      IPV4.name, IPV4.dst,
      IPV4.mkDst('1.1.1.1')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].dscp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ecn().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].proto().toString(16)).toBe('0x06');
    expect(pkt.protocols[1].src().toString()).toBe('192.168.1.1');
    expect(pkt.protocols[1].dst().toString()).toBe('1.1.1.1');
  });

  it('IPv4 SetTTL', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('ipv4pack');
    var ttl = new IPV4.mkTtl('0x01');
    pkt.push(IPV4.mkIPv4());

    var act = new Action.SetTTL(null, IPV4.name, ttl);

    expect(act.protocol).toBe('IPv4');
    expect(act.value.toString(16)).toBe('0x01');

    expect(set.actions.length).toBe(undefined);

    set.setTTL(new Action.SetTTL(
      null,
      IPV4.name,
      IPV4.mkTtl('0x01')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].dscp().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ecn().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].proto().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].src().toString()).toBe('0.0.0.0');
    expect(pkt.protocols[1].dst().toString()).toBe('0.0.0.0');

    expect(set.actions.length).toBe(undefined);

    set.setTTL(new Action.SetTTL(
      null,
      IPV4.name,
      IPV4.mkTtl('0x02')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].dscp().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ecn().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].proto().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x02');
    expect(pkt.protocols[1].src().toString()).toBe('0.0.0.0');
    expect(pkt.protocols[1].dst().toString()).toBe('0.0.0.0');

  });

  it('IPv4 DecTTL', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('ipv4pack');
    var ttl = new IPV4.mkTtl('0x01');
    pkt.push(IPV4.mkIPv4(
      '0x00', '0x00', '0x00', '0x03', '0.0.0.0', '0.0.0.0'
    ));

    var act = new Action.DecTTL(null, IPV4.name);

    expect(act.protocol).toBe('IPv4');

    expect(set.actions.length).toBe(undefined);

    set.decTTL(new Action.DecTTL(
      null,
      IPV4.name));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x02');

    expect(set.actions.length).toBe(undefined);

    set.decTTL(new Action.DecTTL(
      null,
      IPV4.name));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x01');

    set.decTTL(new Action.DecTTL(
      null,
      IPV4.name));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x01');

  });

  it('VLAN SetField', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('vlanpack');
    pkt.push(VLAN.mkVLAN());

    set.setField(new Action.SetField(
      null,
      VLAN.name, VLAN.pcp,
      VLAN.mkPcp('0x01')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].pcp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].dei().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x0000');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0000');

    set.setField(new Action.SetField(
      null,
      VLAN.name, VLAN.dei,
      VLAN.mkDei('0x02')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].pcp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].dei().toString(16)).toBe('0x02');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x0000');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0000');

    set.setField(new Action.SetField(
      null,
      VLAN.name, VLAN.vid,
      VLAN.mkVid('0x444')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].pcp().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].dei().toString(16)).toBe('0x02');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x0444');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0000');

  });

  it('VLAN pushVLAN', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('vlanpack');
    pkt.protocols[0]._type = Ethernet.mkType('0x0800');
    pkt.push(IPV4.mkIPv4());
    var vl  = VLAN.mkVLAN();
    set.push_vlan(new Action.Push(
      null, new VLAN.VLAN()
    ));

    set.step(null, {
      packet: pkt
    });

    // push_vlan[] should be cleared
    // set.actions.push_vlan should not exist
    expect(set.actions.push_vlan).toBe(undefined);

    // vlan inserted
    expect(pkt.protocols.length).toBe(3);

    // Eth.type is 0x8100 (vlan)
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8100');
    // default values for new tag
    expect(pkt.protocols[1].pcp().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].dei().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x0000');
    // Vlan.type should be ipv4 0x0800
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0800');

    pkt.protocols[1]._vid = VLAN.mkVid('0x7777');
    pkt.protocols[1]._pcp = VLAN.mkPcp('0x02');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x7777');
    expect(pkt.protocols[1].pcp().toString(16)).toBe('0x02');

    set.push_vlan(new Action.Push(
      null, new VLAN.VLAN()
    ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(4);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8100');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x8100');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x7777');
    expect(pkt.protocols[1].pcp().toString(16)).toBe('0x02');
    expect(pkt.protocols[2].type().toString(16)).toBe('0x0800');
    expect(pkt.protocols[2].vid().toString(16)).toBe('0x7777');
    expect(pkt.protocols[2].pcp().toString(16)).toBe('0x02');

    set.pop_vlan(new Action.Pop(null, new VLAN.VLAN() ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(3);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8100');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0800');

    set.pop_vlan(new Action.Pop(null, new VLAN.VLAN() ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(2);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x0800');

  });

  it('MPLS pushMPLS', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('mpls');
    pkt.protocols[0].type('0x0800');
    pkt.push(IPV4.mkIPv4('0x11','0x12', '0x06', '0x77','10.1.1.1','128.1.1.1'));

    expect(pkt.protocols[0].type().toString(16)).toBe('0x0800');

    var mpls  = MPLS.mkMPLS();
    set.push_mpls(new Action.Push(
      null, new MPLS.MPLS()
    ));

    set.step(null, {
      packet: pkt
    });

    // set.actions.push_vlan should not exist
    expect(set.actions.push_mpls).toBe(undefined);

    // mpls
    expect(pkt.protocols.length).toBe(3);

    // Eth.type is 0x8100 (vlan)
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8847');
    // default values for new tag
    expect(pkt.protocols[1].label().toString(16)).toBe('0x000000');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x77');

    expect(set.actions.push_mpls).toBe(undefined);

    pkt.protocols[1].label('0x777777');
    pkt.protocols[1].tc('0x33');

    var mpls  = MPLS.mkMPLS();
    set.push_mpls(new Action.Push(
      null, new MPLS.MPLS()
    ));

    set.step(null, {
      packet: pkt
    });

    // set.actions.push_vlan should not exist
    expect(set.actions.push_mpls).toBe(undefined);

    // mpls
    expect(pkt.protocols.length).toBe(4);

    // Eth.type is 0x8100 (vlan)
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8847');
    // default values for new tag
    expect(pkt.protocols[1].label().toString(16)).toBe('0x777777');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x33');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x77');
    expect(pkt.protocols[2].ttl().toString(16)).toBe('0x77');

  });

  it('MPLS popMPLS', function(){
    var set = new Action.Set();
    var pkt = new Packet.Packet('mpls');
    pkt.push(MPLS.mkMPLS());
    pkt.push(IPV4.mkIPv4());
    expect(pkt.protocols.length).toBe(3);

    pkt.protocols[0].type('0x8847');
    pkt.protocols[1].ttl('0x77');
    pkt.protocols[2].ttl('0x77');

    set.pop_mpls(new Action.Pop(
      null, new MPLS.MPLS()
    ));

    set.step(null, {
      packet: pkt
    });

    expect(set.actions.pop_mpls).toBe(undefined);

    expect(pkt.protocols.length).toBe(2);

    expect(pkt.protocols[0].type().toString(16)).toBe('0x0800');


    set.pop_mpls(new Action.Pop(
      null, new MPLS.MPLS()
    ));

    set.step(null, {
      packet: pkt
    });

    expect(set.actions.pop_mpls).toBe(undefined);
    expect(pkt.protocols.length).toBe(2);

  });

  it('Pop MPLS & VLAN', function(){
    var set = new Action.Set();
    var pkt = new Packet.Packet('pkt');
    pkt.push(VLAN.mkVLAN('0x01','0x02','0x1111','0x8847'));
    pkt.push(MPLS.mkMPLS('0x111111', '0x03', '0x00', '0x88'));
    pkt.push(IPV4.mkIPv4());
    expect(pkt.protocols.length).toBe(4);


    set.pop_vlan(new Action.Pop( null,
      new VLAN.VLAN()
    ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(3);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8847');

    set.pop_vlan(new Action.Pop( null,
      new MPLS.MPLS()
    ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(2);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x0800');


  });

  it('Push MPLS & VLAN', function(){
    var set = new Action.Set();
    var pkt = new Packet.Packet('pkt');
    pkt.protocols[0].type('0x0800');
    pkt.push(IPV4.mkIPv4('0x00','0x00','0x06', '0x77'));
    expect(pkt.protocols.length).toBe(2);


    set.push_vlan(new Action.Push( null,
      new VLAN.VLAN()
    ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(3);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8100');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0800');

    set.push_mpls(new Action.Push( null,
      new MPLS.MPLS()
    ));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(4);
    expect(pkt.protocols[0].type().toString(16)).toBe('0x8100');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x8847');
    expect(pkt.protocols[2].ttl().toString(16)).toBe('0x77');


  });

  it('MPLS SetField', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('MPLSpack');
    pkt.push(MPLS.mkMPLS());

    set.setField(new Action.SetField(
      null,
      MPLS.name, MPLS.label,
      MPLS.mkLabel('0x012345')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x012345');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x00');

    set.setField(new Action.SetField(
      null,
      MPLS.name, MPLS.tc,
      MPLS.mkTc('0x02')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x012345');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x02');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x00');

    set.setField(new Action.SetField(
      null,
      MPLS.name, MPLS.bos,
      MPLS.mkBos('0x1')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x012345');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x02');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x01');
  });

  it('UDP test', function () {
    expect(!!Action).toBe(true);
    expect(!!UDP).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(UDP.mkUDP());

    set.setField(new Action.SetField(
      null,
      UDP.name, UDP.src,
      UDP.mkPort('9000')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].src().toString()).toBe('9000');
    expect(pkt.protocols[1].dst().toString()).toBe('0');

    set.setField(new Action.SetField(
      null,
      UDP.name, UDP.dst,
      UDP.mkPort('0xBEEF')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].src().toString()).toBe('9000');
    expect(pkt.protocols[1].dst().toString(16)).toBe('0xbeef');
  });

  it('MPLS SetTTL', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('ipv4pack');
    var ttl = new MPLS.mkTtl('0x01');
    pkt.push(MPLS.mkMPLS());

    var act = new Action.SetTTL(null, MPLS.name, ttl);

    expect(act.protocol).toBe('MPLS');
    expect(act.value.toString(16)).toBe('0x01');

    expect(set.actions.length).toBe(undefined);

    set.setTTL(new Action.SetTTL(
      null,
      MPLS.name,
      MPLS.mkTtl('0x01')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x000000');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x01');

    expect(set.actions.length).toBe(undefined);

    set.setTTL(new Action.SetTTL(
      null,
      MPLS.name,
      MPLS.mkTtl('0x02')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x000000');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x02');

  });

  it('MPLS decTTL', function(){

    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('ipv4pack');
    pkt.push(MPLS.mkMPLS('0x666666', '0x00', '0x01', '0x77'));

    expect(set.actions.length).toBe(undefined);

    set.decTTL(new Action.DecTTL(
      null,
      MPLS.name));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x666666');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x76');

    expect(set.actions.length).toBe(undefined);

    set.decTTL(new Action.DecTTL(
      null,
      MPLS.name));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x666666');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x75');

    pkt.protocols[1].ttl('0x01');

    expect(set.actions.length).toBe(undefined);

    set.decTTL(new Action.DecTTL(
      null,
      MPLS.name));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].label().toString(16)).toBe('0x666666');
    expect(pkt.protocols[1].tc().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].bos().toString(16)).toBe('0x01');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x01');

  });


  it('TCP test', function () {
    expect(!!Action).toBe(true);
    expect(!!TCP).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(TCP.mkTCP());

    expect(pkt.protocols[1].src().toString()).toBe('0');
    expect(pkt.protocols[1].dst().toString()).toBe('0');

    set.setField(new Action.SetField(
      null,
      TCP.name, TCP.src,
      TCP.mkPort('65535')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].src().toString()).toBe('65535');
    expect(pkt.protocols[1].dst().toString()).toBe('0');

    set.setField(new Action.SetField(
      null,
      TCP.name, TCP.dst,
      TCP.mkPort('65535')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].src().toString()).toBe('65535');
    expect(pkt.protocols[1].dst().toString()).toBe('65535');
  });

  it('IPv6 setField test', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(IPV6.mkIPv6());

    set.setField(new Action.SetField(
      null,
      IPV6.name, IPV6.src,
      IPV6.mkAddress('2001:db8:0:0:0:ff00:42:8329')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].src().toString()).toBe('2001:db8:0:0:0:ff00:42:8329');
    expect(pkt.protocols[1].dst().toString()).toBe('0:0:0:0:0:0:0:0');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].flabel().toString(16)).toBe('0x000000');

    set.setField(new Action.SetField(
      null,
      IPV6.name, IPV6.dst,
      IPV6.mkAddress('FE91:0000:0000:0000:0202:B3FF:FE1E:8329')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].src().toString()).toBe('2001:db8:0:0:0:ff00:42:8329');
    expect(pkt.protocols[1].dst().toString()).toBe('fe91:0:0:0:202:b3ff:fe1e:8329');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].flabel().toString(16)).toBe('0x000000');

    set.setField(new Action.SetField(
      null,
      IPV6.name, IPV6.flabel,
      IPV6.mkFlabel('0x333333')));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].src().toString()).toBe('2001:db8:0:0:0:ff00:42:8329');
    expect(pkt.protocols[1].dst().toString()).toBe('fe91:0:0:0:202:b3ff:fe1e:8329');
    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].flabel().toString(16)).toBe('0x333333');
  });

  it('IPv6 setTTL', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    var ttl = new IPV6.mkTtl('0x77');
    pkt.push(IPV6.mkIPv6('0x123456', '0x02'));

    set.setTTL(new Action.SetTTL(
      null,
      IPV6.name, ttl));

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x77');
  });

  it('CopyTTL In MPLS->IPv4', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(MPLS.mkMPLS('0x123456', '0x22', '0x01', '0x77'));
    pkt.push(IPV4.mkIPv4());
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_in(new Action.CopyTTLIn());

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[2].ttl().toString(16)).toBe('0x77');
  });

  it('CopyTTL In MPLS->IPv6', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(MPLS.mkMPLS('0x123456', '0x22', '0x01', '0x77'));
    pkt.push(IPV6.mkIPv6());
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_in(new Action.CopyTTLIn());

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[2].ttl().toString(16)).toBe('0x77');
  });

  it('CopyTTL In MPLS->MPLS', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(MPLS.mkMPLS('0x123456', '0x22', '0x01', '0x77'));
    pkt.push(MPLS.mkMPLS());
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_in(new Action.CopyTTLIn());

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[2].ttl().toString(16)).toBe('0x77');
  });

  it('CopyTTL OUT MPLS<-MPLS', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(MPLS.mkMPLS());
    pkt.push(MPLS.mkMPLS('0x123456', '0x22', '0x01', '0x77'));
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_out(new Action.CopyTTLOut());

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x77');
  });

  it('CopyTTL OUT MPLS<-IPv4', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(MPLS.mkMPLS());
    pkt.push(IPV4.mkIPv4('0x01', '0x03', '0x06', '0x77',
      '192.1.1.1', '2.2.2.2'));
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_out(new Action.CopyTTLOut());

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x77');
  });

  it('CopyTTL OUT MPLS<-IPv6', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(MPLS.mkMPLS());
    pkt.push(IPV6.mkIPv6('0x01', '0x77'));
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_out(new Action.CopyTTLOut());

    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols[1].ttl().toString(16)).toBe('0x77');
  });

  it('CopyTTL OUT Throw', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(VLAN.mkVLAN());
    pkt.push(IPV6.mkIPv6('0x01', '0x77'));
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_out(new Action.CopyTTLOut());

    expect(function(){
      set.step(null, {
        packet: pkt
      });
    }).toThrow();

    var set1 = new Action.Set();
    var pkt1 = new Packet.Packet('test');
    pkt1.push(VLAN.mkVLAN());
    expect(pkt1.protocols.length).toBe(2);

    set1.copy_ttl_out(new Action.CopyTTLOut());

    expect(function(){
      set1.step(null, {
        packet: pkt1
      });
    }).toThrow();
  });

  it('CopyTTLIN Throw', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();
    var pkt = new Packet.Packet('test');
    pkt.push(VLAN.mkVLAN());
    pkt.push(IPV6.mkIPv6('0x01', '0x77'));
    expect(pkt.protocols.length).toBe(3);

    set.copy_ttl_in(new Action.CopyTTLIn());

    expect(function(){
      set.step(null, {
        packet: pkt
      });
    }).toThrow();

    var set1 = new Action.Set();
    var pkt1 = new Packet.Packet('test');
    pkt1.push(VLAN.mkVLAN());
    expect(pkt1.protocols.length).toBe(2);

    set1.copy_ttl_out(new Action.CopyTTLOut());

    expect(function(){
      set1.step(null, {
        packet: pkt1
      });
    }).toThrow();
  });


});
