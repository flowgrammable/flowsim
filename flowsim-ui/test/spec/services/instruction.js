'use strict';

describe('Service: instruction', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Instruction;
  beforeEach(inject(function (_Instruction_) {
    Instruction = _Instruction_;
  }));

  var Packet;
  var Noproto;
  beforeEach(inject(function (_Packet_, _Noproto_) {
    Packet = _Packet_;
    Noproto = _Noproto_;
  }));

  it('should do something', function () {
    expect(!!Instruction).toBe(true);
  });

  /*it('Create Instruction set, execute apply:pushvlan', function() {
    expect(!!Instruction).toBe(true);
    var set = new Instruction.Set();

    var pkt = new Packet.Packet('pack1');
    pkt.push(new IPV4.mkIPv4());
    pkt.protocols[0].type('0x0800');

    set._apply.push(new Action.Push(null, new VLAN.VLAN()));
    expect(pkt.protocols[0].type().toString(16)).toBe('0x0800');


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
    expect(prof.apply[0].actions[0].field).toBe('Output');

    var j = JSON.stringify(prof);
    var j_ = new Instruction.Profile(JSON.parse(j));

    expect(j_.apply.length).toBe(prof.apply.length);
    expect(j_.apply[0].protocol).toBe('Internal');
    expect(j_.apply[0].actions[0].field).toBe('Output');

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

  it('Instruction Set summaraize', function(){
    var out = new Action.Output(null, 1);
    var is = new Instruction.Set();

    is.pushApply(out);

    expect(is.summarize()[0]).toBe('apply');

    is._write.output(out);
    expect(is.summarize()[1]).toBe('write');

  }); */

  it('Apply actions step', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    var act = new Noproto.mkAction('Ethernet', 'Src', 'set', 48, 'aa:bb:cc:dd:ee:Ff');
    var act2 = new Noproto.mkAction('Ethernet', 'Dst', 'set', 48, 'a:a:a:a:a:a');
    is.apply.enabled = true;
    is.apply.actions.push(act);
    is.apply.actions.push(act2);
    var packet = new Packet.Packet('testpa');
    var ctx = {packet: packet};
    is.step(null, ctx);
    expect(ctx.packet.getField('Ethernet', 'Src').valueToString()).toBe('aa:bb:cc:dd:ee:ff');
    is.step(null, ctx);
    expect(ctx.packet.getField('Ethernet', 'Dst').valueToString()).toBe('a:a:a:a:a:a');
    expect(is.apply.enabled).toBe(false);

  });

});
