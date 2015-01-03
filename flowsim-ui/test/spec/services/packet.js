'use strict';

describe('Service: Packet', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  it('Construct packet', function () {
    expect(!!Packet).toBe(true);

    var pack = Packet.createUI('testpack');
    expect(pack.protocols.length).toBe(1);
    expect(pack.protocols[0].name).toBe('Ethernet');

    var j = JSON.stringify(pack);
    var j_ = Packet.createUI(JSON.parse(j));

    expect(j_.name).toBe('testpack');
    expect(j_.protocols.length).toBe(1);

  });

  it('Push and pop payload', function() {
    var pack = Packet.createUI('testpack');
    pack.pushPayload('0x0800');
    expect(pack.protocols[1].name).toBe('IPv4');
    pack.pushPayload('0x06');
    expect(pack.protocols[2].name).toBe('TCP');

    // pop payload

    pack.popPayload();
    expect(pack.protocols.length).toBe(2);
    pack.popPayload();
    expect(pack.protocols.length).toBe(1);
    pack.popPayload();
    expect(pack.protocols.length).toBe(1);
  });

  it('Packet clone', function(){
    var pack = Packet.createUI('testpack');
    var packb = pack.clone();
    expect(packb.protocols[0].fields[0].value.bytes).toBe(6);
    var packc = packb.clone();
    expect(packc.protocols[0].fields[0].value.bytes).toBe(6);
  });

});
