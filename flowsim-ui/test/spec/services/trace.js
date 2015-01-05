'use strict';

describe('Service: trace', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Trace;
  beforeEach(inject(function (_Trace_) {
    Trace = _Trace_;
  }));

  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  /*it('Event Clone', function () {
    expect(!!Trace).toBe(true);

    var pkt = {
      name: 'pkt1',
      clone: function() { return {
        name: 'pkt1'
      }; }
    };
    var ev1 = new Trace.Event(null, pkt);
    var ev2 = new Trace.Event(ev1);

    expect(ev1.packet.name).toBe('pkt1');
    expect(ev2.packet.name).toBe('pkt1');
  }); */

  it('Trace construction pass', function(){
    var pkt = new Packet.Packet('testpacket');
    var t = new Trace.Trace('trace1');
    
    
    t.push(pkt);

    var j = JSON.stringify(t);
    var j_ = new Trace.Trace(JSON.parse(j));
    expect(j_.events[0].packet.protocols[0].fields[0].tip).toBe('Src MAC Address');
  });

});
