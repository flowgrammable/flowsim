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

});
