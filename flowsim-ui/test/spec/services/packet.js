'use strict';

ddescribe('Service: Packet', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
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
  })

});
