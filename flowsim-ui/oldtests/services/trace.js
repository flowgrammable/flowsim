'use strict';

describe('Service: trace', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Trace;
  beforeEach(inject(function (_Trace_) {
    Trace = _Trace_;
  }));

  it('Event Clone', function () {
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
  });

});
