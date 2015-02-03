'use strict';

describe('Service: dataplane', function() {
  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Dataplane;
  beforeEach(inject(function (_Dataplane_) {
    Dataplane = _Dataplane_;
  }));

  var Instruction;
  beforeEach(inject(function (_Instruction_) {
    Instruction = _Instruction_;
  }));

  var Action;
  beforeEach(inject(function (_Action_) {
    Action = _Action_;
  }));

  var fgConstraints;
  beforeEach(inject(function (_fgConstraints_) {
    fgConstraints = _fgConstraints_;
  }));

  var Flow;
  beforeEach(inject(function (_Flow_) {
    Flow = _Flow_;
  }));

  var Tables;
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
  }));

  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  var Profile;
  beforeEach(inject(function (_Profile_) {
    Profile = _Profile_;
  }));

  var Switch_;
  var Utils;
  beforeEach(inject(function(_Switch_, _Utils_) {
    Switch_ = _Switch_;
    Utils = _Utils_;
  }));

  it('Device construction Pass', function(){
      var prof = new Profile.Profile('test profile name');
      var swi = Switch_.create(null, prof);
      var dp = new Dataplane.Dataplane(swi);
  });


  it('Device construction Fail', function(){
      expect(function() {
      var dp = new Dataplane.Dataplane();
      }).toThrow();
  });


  it('Device Arrival Pass', function(){
      var prof = new Profile.Profile('test profile name');
      var swi = Switch_.create(null, prof);
      var dp = new Dataplane.Dataplane(swi);
      var pack = new Packet.Packet('testpacket');
      pack.pushProtocol('0x0800');
      pack.pushProtocol('0x06');

      expect(dp.state).toBe('Arrival');
      dp.arrival(pack, 1, 1, 1);
  });

  it('Dataplane Arrival Pass', function(){
    var prof = new Profile.Profile('test profile name');
    var swi = Switch_.create(null, prof);
    var dp = new Dataplane.Dataplane(swi);
    var pack = new Packet.Packet('testpacket');
    pack.pushProtocol('0x0800');
    pack.pushProtocol('0x06');

    expect(dp.state).toBe('Arrival');
    dp.arrival(pack, 1, 1, 1);
    expect(dp.toView().buffer).toBe(0);
  });

  it('Dataplane Extraction Pass', function(){
    var prof = new Profile.Profile('test');
    var sw = Switch_.create(null, prof);
    var dp = new Dataplane.Dataplane(sw);
    var pack = new Packet.Packet('testpacket');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x0800');
    pack.pushProtocol('0x06');
    dp.arrival(pack, 1, 1, 1);
    dp.extraction();
    expect(dp.ctx.key.Ethernet.Src.bytes).toBe(6);
    expect(dp.ctx.key.VLAN.length).toBe(2);
    expect(dp.ctx.key.IPv4.Src.bytes).toBe(4);
    expect(dp.ctx.key.TCP.Src.bytes).toBe(2);

  });

  it('Dataplane Choice Pass', function(){
    var prof = new Profile.Profile('test profile name');
    var swi = Switch_.create(null, prof);
    var dp = new Dataplane.Dataplane(swi);
    var pack = new Packet.Packet('testpacket');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x0800');
    pack.pushProtocol('0x06');

    dp.arrival(pack, 1, 1, 1);
    dp.extraction();
    dp.choice();
    expect(dp.table.id).toBe(0);
  });

  it('Dataplane Selection Pass', function(){
    var prof = new Profile.Profile('test profile name');
    var swi = Switch_.create(null, prof);
    var dp = new Dataplane.Dataplane(swi);
    var pack = new Packet.Packet('testpacket');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x0800');
    pack.pushProtocol('0x06');

    dp.arrival(pack, 1, 1, 1);
    dp.extraction();
    dp.choice();
    expect(dp.table.id).toBe(0);
  });

  it('Dataplane execution step Pass', function(){
    var prof = new Profile.Profile('test profile name');
    var swi = Switch_.create(null, prof);
    var dp = new Dataplane.Dataplane(swi);
    var pack = new Packet.Packet('testpacket');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x0800');
    pack.pushProtocol('0x06');

    dp.arrival(pack, 1, 1, 1);
    dp.extraction();
    dp.choice();
    dp.selection();
    dp.state = 'Selection';
    dp.transition('Execution');
    expect(dp.state).toBe('Selection');
    expect(dp.nextState).toBe('Execution');
    dp.step();
    expect(dp.state).toBe('Execution');
    var act1 = Utils.mkAction('Ethernet', 'Src', 'set', 'a:a:a:a:a:a');
    var act2 = Utils.mkAction('Ethernet', 'Src', 'set', 'b:a:a:a:a:a');
    var act3 = Utils.mkAction('Ethernet', 'Src', 'set', 'c:a:a:a:a:a');
    dp.ctx.instructionSet.apply.addAction(act1);
    dp.ctx.instructionSet.apply.addAction(act2);
    dp.ctx.instructionSet.apply.addAction(act3);
    expect(dp.ctx.instructionSet.apply.actions.length).toBe(3);
    dp.ctx.instructionSet.apply.enabled = true;
    dp.step();
    expect(dp.ctx.instructionSet.isEmpty()).toBe(false);
    expect(dp.ctx.packet.getField('Ethernet', 'Src').valueToString()).toBe('a:a:a:a:a:a');
    expect(dp.nextState).toBe('Execution');
  });

});
