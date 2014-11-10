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
  it('test', function () {
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
});
