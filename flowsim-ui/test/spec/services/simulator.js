'use strict';

describe('Service: simulator', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Simulator;
  beforeEach(inject(function (_Simulation_) {
    Simulator = _Simulation_;
  }));

  var Trace;
  beforeEach(inject(function (_Trace_) {
    Trace = _Trace_;
  }));

  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  var Switch;
  beforeEach(inject(function (_Switch_) {
    Switch = _Switch_;
  }));

  var Profile;
  beforeEach(inject(function (_Profile_) {
    Profile = _Profile_;
  }));

  it('Simulation play', function () {
    expect(!!Simulator).toBe(true);
    var prof = new Profile.create('test profile name');
    var swi = Switch.create(null, prof);
    var s = Simulator.Simulation;
    var pkt = new Packet.Packet('testpacket');
    var t = new Trace.Trace('trace1');
    t.device = swi;
    t.push(pkt);

    s.play(t);
    expect(s.active).toBe(true);
    expect(s.stage).toBe(0);
    expect(s.dataplane.state).toBe('Arrival');
    s.step();
    expect(s.dataplane.state).toBe('Arrival');
    expect(s.dataplane.nextState).toBe('Extraction');
    s.step();
    expect(s.dataplane.state).toBe('Extraction');
    expect(s.dataplane.nextState).toBe('Extraction');
    s.step();
    expect(s.dataplane.state).toBe('Extraction');

  });

});
