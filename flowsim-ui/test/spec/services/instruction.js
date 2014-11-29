'use strict';

describe('Service: instruction', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Instruction;
  beforeEach(inject(function (_Instruction_) {
    Instruction = _Instruction_;
  }));

  var Action;
  beforeEach(inject(function (_Action_) {
    Action = _Action_;
  }));

  var IPV4;
  beforeEach(inject(function (_IPV4_) {
    IPV4 = _IPV4_;
  }));

  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  var VLAN;
  beforeEach(inject(function (_VLAN_) {
    VLAN = _VLAN_;
  }));

  it('should do something', function () {
    expect(!!Instruction).toBe(true);
  });

  it('Create Instruction set, execute apply:pushvlan', function() {
    expect(!!Instruction).toBe(true);
    var set = new Instruction.Set();

    var pkt = new Packet.Packet('pack1');
    pkt.push(new IPV4.mkIPv4());

    set._apply.push(new Action.Push(null, new VLAN.VLAN()));



    set.step(null, {
      packet: pkt
    });

    expect(pkt.protocols.length).toBe(3);

    expect(pkt.protocols[0].type().toString(16)).toBe('0x8100');
    expect(pkt.protocols[1].pcp().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].dei().toString(16)).toBe('0x00');
    expect(pkt.protocols[1].vid().toString(16)).toBe('0x0000');
    expect(pkt.protocols[1].type().toString(16)).toBe('0x0800');

  });

    it('Instruction profile construction: ', function(){
    var prof = new Instruction.Profile();

    expect(prof.apply[0].protocol).toBe('Internal');
    expect(prof.apply[0].actions[0].name).toBe('Output');

    var j = JSON.stringify(prof);
    var j_ = new Instruction.Profile(JSON.parse(j));

    expect(j_.apply.length).toBe(prof.apply.length);
    expect(j_.apply[0].protocol).toBe('Internal');
    expect(j_.apply[0].actions[0].name).toBe('Output');

  });

  it('Apply Instruction construction', function(){
    var out = new Action.Output(null, 1);
    var app = new Instruction.Apply();

    expect(app.actions.length).toBe(0);
    app.push(out);
    expect(app.actions.length).toBe(1);

    var j = JSON.stringify(app);

    var j_ = new Instruction.Apply(JSON.parse(j));

    expect(j_.actions[0].toValue()).toBe(1);

  });

  it('Instruction Set Construction', function(){
    var out = new Action.Output(null, 1);
    var app = new Instruction.Apply();
    app.push(out);
    expect(app.actions.length).toBe(1);

    var set = new Instruction.Set();
    set.apply(app);
    expect(set.apply().actions.length).toBe(1);

    var j = JSON.stringify(set);
    var j_ = new Instruction.Set(JSON.parse(j));

    expect(j_.apply().actions.length).toBe(1);
    expect(j_.apply().actions[0].toValue()).toBe(1);
  });

});
