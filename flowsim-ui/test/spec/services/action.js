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

  it('test', function () {
    expect(!!Action).toBe(true);

    var set = new Action.Set();

    var pkt = new Packet.Packet('test');

    set.setField(new Action.SetField(
      null,
      Ethernet.name, Ethernet.src,
      Ethernet.mkMAC('01:03:05:07:09:0b')));
    
    set.setField(new Action.SetField(
      null, 
      Ethernet.name, Ethernet.dst,
      Ethernet.mkMAC('ff:ff:ff:ff:ff:ff')));
    
    set.setField(new Action.SetField(
      null, 
      Ethernet.name, Ethernet.type,
      Ethernet.mkType('0x0806')));

    set.execute(null, {
      packet: pkt
    });

    expect(pkt.protocols[0].src().toString()).toBe('01:03:05:07:09:0b');
    expect(pkt.protocols[0].dst().toString()).toBe('ff:ff:ff:ff:ff:ff');
    expect(pkt.protocols[0].type().toString(16)).toBe('0x0806');
  });

});
