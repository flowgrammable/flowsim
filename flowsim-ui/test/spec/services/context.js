'use strict';

describe('Service: context', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Context;
  beforeEach(inject(function (_Context_) {
    Context = _Context_;
  }));

  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  it('Context Construction throw', function () {
    expect(function(){
      new Context.Context()
    }).toThrow();
  });

  it('Context Construction pass', function(){
    var pkt = new Packet.Packet('testpacket');
    var ctx = new Context.Context(null, pkt, 1, 1, 1, 1);
    var j = JSON.stringify(ctx);
    var j_ = new Context.Context(JSON.parse(j));
    expect(j_.packet.protocols[0].fields[0].tip).toBe('Src MAC Address');
  });

});
