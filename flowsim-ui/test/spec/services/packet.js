'use strict';

describe('Service: Packet', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Packet;
  var Protocols;
  beforeEach(inject(function (_Packet_, _Protocols_) {
    Packet = _Packet_;
    Protocols = _Protocols_;
  }));

  it('Packet construction pass', function () {
    var packet = new Packet.Packet('testpacket');
    expect(packet.protocols.length).toBe(1);
    expect(packet.bytes).toBe(18);
    expect(packet.protocols[0].name).toBe('Ethernet');
  });

  it('Packet toBase pass', function(){
    var packet = new Packet.Packet('testpacket');
    var json = packet.toBase();
    var packet2 = new Packet.Packet(json);
    expect(packet2.protocols.length).toBe(1);
    expect(packet2.protocols[0].name).toBe('Ethernet');
  });

  it('Packet pushProtocol pass', function(){
    var packet = new Packet.Packet('testpack');
    packet.pushProtocol('0x0800');
    expect(packet.protocols.length).toBe(2);
    expect(packet.protocols[1].name).toBe('IPv4');
  });

  it('Packet pushPayload fail', function(){
    var packet = new Packet.Packet('testp');
    expect(function(){
    packet.pushProtocol('0x1111');
    }).toThrow();
  });

  it('Packet popPayload pass', function(){
    var packet = new Packet.Packet('testp');
    packet.pushProtocol('0x0800');
    packet.pushProtocol('0x06');
    expect(packet.protocols[2].name).toBe('TCP');

    packet.popProtocol();
    expect(packet.protocols.length).toBe(2);
    packet.popProtocol();
    expect(packet.protocols.length).toBe(1);
    packet.popProtocol();
    expect(packet.protocols.length).toBe(1);
  });

  it('Packet setField pass', function(){
      var packet = new Packet.Packet('testp');
      var npF = Protocols.getField('Ethernet','Src');
      var field = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:a');
      packet.setField('Ethernet', 'Src', field);
      expect(npF.dispStr(packet.protocols[0].fields[0].value.value)).toBe('a:a:a:a:a:a');

      var field2 = Protocols.mkFieldUInt('Ethernet', 'Type', '0x0800');
      packet.setField('Ethernet', 'Type', field2);
      expect(packet.protocols[0].fields[2].valueToString()).toBe('0x0800');
  });

  it('Packet setField fail', function(){
      var packet = new Packet.Packet('testp');
      var npF = Protocols.getField('Ethernet','Src');
      var field = Protocols.mkFieldUInt('IPv4', 'Src', '192.168.1.1');

      expect(function(){
        packet.setField('IPv4', 'Src', field);
      }).toThrow();

  });

  it('Packet pushtag', function(){
      var packet = new Packet.Packet('testp');
      packet.pushProtocol('0x8100');
      packet.pushProtocol('0x8100');
      expect(packet.protocols.length).toBe(3);
      packet.pushTag('MPLS');
      expect(packet.protocols[2].fields[2].valueToString()).toBe('0x8847');
      expect(packet.protocols.length).toBe(4);

      packet.popProtocol();
      packet.popProtocol();
      packet.popProtocol();
      packet.pushTag('VLAN');
      expect(packet.protocols.length).toBe(2);
      packet.pushTag('MPLS');
      expect(packet.protocols[1].fields[2].valueToString()).toBe('0x8847')
      expect(packet.protocols.length).toBe(3);
      expect(packet.protocols[2].name).toBe('MPLS');

      packet.popProtocol();
      packet.popProtocol();
      packet.pushProtocol('0x0800');
      packet.pushTag('MPLS');
      expect(packet.protocols[0].fields[2].valueToString()).toBe('0x8847');
      
  });

  it('Packet pop vlan tag', function(){
    var packet = new Packet.Packet('test');
    packet.pushProtocol('0x8100');
    packet.popTag('VLAN');
    expect(packet.protocols.length).toBe(1);
    packet.pushProtocol('0x8100');
    packet.pushProtocol('0x0800');
    packet.pushProtocol('0x06');
    packet.popTag('VLAN');
    expect(packet.protocols.length).toBe(3);
    expect(packet.protocols[0].fields[2].valueToString()).toBe('0x0800');

  });

  it('Packet pop mpls tag', function(){
    var packet = new Packet.Packet('test');
    packet.pushProtocol('0x8847');
    expect(packet.protocols.length).toBe(2);
    packet.popTag('MPLS');
    expect(packet.protocols.length).toBe(1);
    packet.pushProtocol('0x8847');
    packet.pushProtocol('0x0800');
    packet.pushProtocol('0x06');
    packet.popTag('MPLS');
    expect(packet.protocols.length).toBe(3);
    expect(packet.protocols[0].fields[2].valueToString()).toBe('0x0800');

  });

  it('Packet pop mpls and vlan', function(){
    var packet = new Packet.Packet('test');
    packet.pushTag('MPLS');
    packet.pushTag('VLAN');
    packet.pushProtocol('0x0800');
    expect(packet.protocols[1].name).toBe('VLAN');
    expect(packet.protocols[2].name).toBe('MPLS');
    expect(packet.protocols[0].fields[2].valueToString()).toBe('0x8100');
    packet.popTag('MPLS');
    expect(packet.protocols[2].name).toBe('IPv4');
    expect(packet.protocols[1].fields[2].valueToString()).toBe('0x0800');

  })

  it('Packet insert protocol', function(){
      var packet = new Packet.Packet('testp');
      var proto = Packet.createProtocol('VLAN');
      expect(packet.protocols[0].fields[2].valueToString()).toBe('0x0000');
      packet.insertProtocol(proto, 1);
      expect(packet.protocols.length).toBe(2);
      
  });

  it('Packet active tags', function(){
    var packet = new Packet.Packet('testp');
    packet.pushProtocol('0x8100');
    packet.pushProtocol('0x8100');
    packet.pushProtocol('0x8847');
    expect(packet.protocols.length).toBe(4);
    var tags = packet.getActiveProtos('VLAN');
    expect(tags).toBe(2);
  });

  it('Packet decField pass', function(){
    var packet = new Packet.Packet('test');
    // test IPv4
    packet.pushProtocol('0x0800');
    packet.setField('IPv4', 'TTL', '0x77');
    packet.decField('IPv4', 'TTL');
    expect(packet.protocols[1].fields[2].valueToString()).toBe('0x76');

    // test MPLS
    packet.pushTag('MPLS');
    packet.setField('MPLS', 'TTL', '0xff');
    packet.decField('MPLS', 'TTL');
    expect(packet.getField('MPLS', 'TTL').valueToString()).toBe('0xfe');

    // test IPv6
    packet.popProtocol();
    packet.popProtocol();
    packet.pushProtocol('0x86dd');
    packet.setField('IPv6', 'TTL', '0x02');
    packet.decField('IPv6', 'TTL');
    expect(packet.getField('IPv6', 'TTL').valueToString()).toBe('0x01');
  });

  it('Packet decField fail', function(){
    var packet = new Packet.Packet('test');
    // test IPv4
    packet.pushProtocol('0x0800');
    packet.setField('IPv4', 'TTL', '0x00');
    expect(function(){
      packet.decField('IPv4', 'TTL');
    }).toThrow();

  });

  it('Packet copyTTLIn ipv4|ipv6|mpls pass', function(){
    var packet = new Packet.Packet('test');

    // MPLS -> IPv4
    packet.pushProtocol('0x8847');
    packet.setField('MPLS', 'TTL', '0x77');
    packet.pushProtocol('0x0800');
    packet.copyTTLIn('MPLS', 'TTL');
    expect(packet.getField('IPv4', 'TTL').valueToString()).toBe('0x77');
    packet.pushTag('MPLS');
    expect(packet.getField('MPLS', 'TTL').valueToString()).toBe('0x77');

    // MPLS -> IPv6
    packet.popProtocol();
    packet.popProtocol();
    packet.popProtocol();
    packet.pushTag('MPLS');
    packet.setField('MPLS', 'TTL', '0xff');
    packet.pushProtocol('0x86dd');
    expect(packet.getField('MPLS', 'TTL').valueToString()).toBe('0xff');
    packet.copyTTLIn('MPLS');
    expect(packet.getField('IPv6', 'TTL').valueToString()).toBe('0xff');

    // MPLS -> MPLS
    packet.popProtocol();
    packet.popProtocol();
    packet.pushTag('MPLS');
    packet.setField('MPLS', 'TTL', '0x11');
    packet.pushTag('MPLS');
    expect(packet.protocols[1].getField('TTL').valueToString()).toBe('0x11');
    expect(packet.protocols[2].getField('TTL').valueToString()).toBe('0x11');
    packet.setField('MPLS', 'TTL', '0x22');
    packet.copyTTLIn('MPLS');
    expect(packet.protocols[2].getField('TTL').valueToString()).toBe('0x22');
  });

  it('Packet copyTTLIn missing proto ipv4|ipv6|mpls fail', function(){
    var packet = new Packet.Packet('test');

    // MPLS no inner ttl
    expect(function(){
      packet.copyTTLIn('MPLS', 'TTL');
    }).toThrow();

    expect(function(){
      packet.copyTTLIn('IPv4', 'TTL');
    }).toThrow();

    expect(function(){
      packet.copyTTLIn('IPv6', 'TTL');
    }).toThrow();

  });

  it('Packet copyTTLIn missing ttl field ipv4|ipv6|mpls fail', function(){
    var packet = new Packet.Packet('test');

    // MPLS no inner ttl
    packet.pushProtocol('0x8847');
    expect(function(){
      packet.copyTTLIn('MPLS', 'TTL');
    }).toThrow();

    // IPv4 no inner tll
    packet.pushProtocol('0x0800');
    packet.pushProtocol('0x06')
    expect(function(){
      packet.copyTTLIn('IPv4', 'TTL');
    }).toThrow();

    // IPv6 no inner ttl
    packet.popProtocol();
    packet.popProtocol();
    packet.pushProtocol('0x86dd');
    packet.pushProtocol('0x06');
    expect(function(){
      packet.copyTTLIn('IPv6', 'TTL');
    }).toThrow();

  });

  it('Packet lastIndexOf', function(){
    var packet = new Packet.Packet('test');
    packet.pushProtocol('0x8100');
    packet.pushProtocol('0x8100');
    expect(packet.lastIndexOf('VLAN')).toBe(2);
  });

  it('Packet copyTTLOut', function(){
    var packet = new Packet.Packet('test');
    // IPv4 -> MPLS
    packet.pushProtocol('0x8847');
    packet.pushProtocol('0x0800');
    packet.setField('IPv4', 'TTL', '0x77');
    packet.copyTTLOut('IPv4');
    expect(packet.getField('MPLS', 'TTL').valueToString()).toBe('0x77');

    // IPv6 -> MPLS
    packet.popProtocol();
    packet.pushProtocol('0x86dd');
    packet.setField('IPv6', 'TTL', '0xee');
    packet.copyTTLOut('IPv6');
    expect(packet.getField('IPv6', 'TTL').valueToString()).toBe('0xee');

    // MPLS -> MPLS
    packet.popProtocol();
    packet.popProtocol();
    packet.pushProtocol('0x8847');
    packet.pushProtocol('0x8847');
    expect(packet.protocols.length).toBe(3);
    packet.protocols[2].setField('TTL', '0x02');
    packet.copyTTLOut('MPLS');
    expect(packet.protocols[1].getField('TTL').valueToString()).toBe('0x02');
  });

});
