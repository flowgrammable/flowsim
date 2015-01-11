'use strict';

ddescribe('Service: dataplane', function() {
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
  beforeEach(inject(function(_Switch_) {
    Switch_ = _Switch_;
  }));

  it('Device construction Pass', function(){
      var prof = new Profile.Profile('test profile name');
      var swi = Switch_.create(null, prof);
      var dp = new Dataplane.Dataplane(swi);
  });


  it('Device construction Fail', function(){
      var prof = Profile.create('test profile name');
      var swi = Switch_.create(null, prof);

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
    expect(dp.ctx.toView().ctx[1].value).toBe(0);
  });

  it('Dataplane Extraction Pass', function(){
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
    expect(dp.ctx.key.Ethernet.Src.value.length).toBe(6);
    expect(dp.ctx.key.VLAN.length).toBe(2);
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

});
