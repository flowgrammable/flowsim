'use strict';

describe('Service: instruction', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Instruction;
  var Protocols;
  beforeEach(inject(function (_Instruction_, _Protocols_) {
    Instruction = _Instruction_;
    Protocols = _Protocols_;
  }));

  var Packet;
  var Noproto;
  var Utils;
  var Action;
  beforeEach(inject(function (_Packet_, _Noproto_, _Utils_, _Action_) {
    Packet = _Packet_;
    Action = _Action_;
    Noproto = _Noproto_;
    Utils = _Utils_;
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

  it('Write instruction step pass', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    is.apply.enabled = false;
    is.clear.enabled = false;
    is.goto_.enabled = false;
    is.metadata.enabled = false;
    is.write.enabled = true;

    var act = Utils.mkAction('Ethernet', 'Src', 'set', 'a:b:C:d:e:f');
    var act2 = Utils.mkAction('Ethernet', 'Dst', 'set', 'c:c:c:c:c:c');
    is.write.addAction(act);
    is.write.addAction(act2);
    
    expect(is.write.actions.actions.length).toBe(2);

    var as = new Action.Set();
    var ctx = {actionSet: as };
    is.step(null, ctx);
    expect(ctx.actionSet.actions.length).toBe(1);
    is.step(null, ctx);
    expect(ctx.actionSet.actions.length).toBe(2);
    expect(is.isEmpty()).toBe(true);
  });

  it('Write instruction merge action set pass', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    is.apply.enabled = false;
    is.clear.enabled = false;
    is.goto_.enabled = false;
    is.metadata.enabled = false;
    is.write.enabled = true;

    var act = Utils.mkAction('Ethernet', 'Src', 'set', 'a:b:C:d:e:f');
    var act2 = Utils.mkAction('Ethernet', 'Src', 'set', 'c:c:c:c:c:c');
    is.write.addAction(act);
    
    expect(is.write.actions.actions.length).toBe(1);

    var as = new Action.Set();
    var ctx = {actionSet: as };
    is.step(null, ctx);
    expect(ctx.actionSet.actions.length).toBe(1);
    expect(ctx.actionSet.actions[0].value).toBe('a:b:C:d:e:f');
    expect(is.isEmpty()).toBe(true);
    expect(is.write.enabled).toBe(false);

    is.write.enabled = true;
    is.write.addAction(act2);
    is.step(null, ctx);
    expect(ctx.actionSet.actions.length).toBe(1);
    expect(ctx.actionSet.actions[0].value).toBe('c:c:c:c:c:c');
    expect(is.isEmpty()).toBe(true);

  });

  it('Goto instruction step pass', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    is.clear.enabled = false;
    is.goto_.enabled = true;
    is.metadata.enabled = false;
    is.write.enabled = false;
    is.apply.enabled = false;

    is.goto_.target = 3;
    var ctx = {_nxtTable: 0};
    var dp = {table:{
      id:0, 
      capabilities:{instruction:{
        goto_: {
          targets: [[1, 254]]
        }
      }}
    },
    tables:{length:254}}
    is.step(dp, ctx);
    expect(ctx._nxtTable).toBe(3);

    is.goto_.target = 30;
    is.goto_.enabled = true;
    var ctx = {_nxtTable: 0};
    var dp = {table:{
      id:29, 
      capabilities:{instruction:{
        goto_: {
          targets: [[1, 10], [28,29], [30, 50]]
        }
      }}
    },
    tables: {length: 254}}
    is.step(dp, ctx);
    expect(ctx._nxtTable).toBe(30);
  });


  it('Goto instruction step fail', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    is.clear.enabled = false;
    is.goto_.enabled = true;
    is.metadata.enabled = false;
    is.write.enabled = false;
    is.apply.enabled = false;

    // table transition cannot go backwards
    is.goto_.target = 3;
    var ctx = {_nxtTable: 0};
    var dp = {table:{
      id:4, 
      capabilities:{instruction:{
        goto_: {
          targets: [[1, 254]]
        }
      }}
    }}
    expect(function(){
      is.step(dp, ctx)
    }).toThrow();

    // table does not fall in range of acceptable tables
    is.goto_.enable = true;
    is.goto_.target = 30;
    var ctx = {_nxtTable: 0};
    var dp = {table:{
      id:4, 
      capabilities:{instruction:{
        goto_: {
          targets: [[1, 29],[31, 254]]
        }
      }}
    }}
    expect(function(){
      is.step(dp, ctx)
    }).toThrow();

    // cannot go to same table
    is.goto_.enable = true;
    is.goto_.target = 31;
    var ctx = {_nxtTable: 0};
    var dp = {table:{
      id:31, 
      capabilities:{instruction:{
        goto_: {
          targets: [[1, 29],[31, 254]]
        }
      }}
    }}
    expect(function(){
      is.step(dp, ctx)
    }).toThrow();
  });

  it('Metadata instruction step pass', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    is.meter.enabled = false;
    is.clear.enabled = false;
    is.goto_.enabled = false;
    is.write.enabled = false;
    is.apply.enabled = false;

    is.metadata.enabled = true;
    is.metadata.value = '0x1111111111111111';
    is.metadata.mask = '0xffffffffffffffff';
    var ctx =  {key: { Internal: { Metadata: 0 }}};
    var dp = {ctx: ctx, table:{capabilities:{instruction:{metadata:{maskableBits: '0xffffffffffffffff'}}}}};
    
    is.step(dp, ctx);
    expect(ctx.key.Internal.Metadata.toString(16)).toBe('0x1111111111111111');

    is.metadata.enabled = true;
    is.metadata.value = '0x1111111111111111';
    is.metadata.mask =  '0xf0ffffffffffff0f';
    var ctx =  {key: { Internal: { Metadata: 0 }}};
    var dp = {ctx: ctx, table:{capabilities:{instruction:{metadata:{maskableBits: '0xf0ffffffffffff0f'}}}}};
    
    is.step(dp, ctx);
    expect(ctx.key.Internal.Metadata.toString(16)).toBe('0x1011111111111101');

  });

  it('Metadata instruction step fail', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    is.meter.enabled = false;
    is.clear.enabled = false;
    is.goto_.enabled = false;
    is.write.enabled = false;
    is.apply.enabled = false;

    is.metadata.enabled = true;
    is.metadata.value = '0x1111111111111111';
    is.metadata.mask = '0xf0ffffffffffffff';
    var ctx =  {key: { Internal: { Metadata: 0 }}};
    var dp = {ctx: ctx, table:{capabilities:{instruction:{metadata:{maskableBits: '0xffffffffffffffff'}}}}};
    
    expect(function(){
      is.step(dp, ctx);
    }).toThrow();

  });

  it('Clear instruction step', function(){
    var is = new Instruction.Set();
    is.meter.enabled = false;
    is.clear.enabled = true;
    is.goto_.enabled = false;
    is.metadata.enabled = false;
    is.write.enabled = false;
    is.apply.enabled = false;

    var act = Utils.mkAction('Ethernet', 'Src', 'set', 'a:b:C:d:e:f');
    var act2 = Utils.mkAction('Ethernet', 'Dst', 'set', 'c:c:c:c:c:c');
    

    var as = new Action.Set();
    as.add(act);
    as.add(act2);
    var ctx = {actionSet: as };
    expect(ctx.actionSet.actions.length).toBe(2);
    expect(is.isEmpty()).toBe(false);

    is.step(null, ctx);
    expect(ctx.actionSet.actions.length).toBe(0);
    expect(is.isEmpty()).toBe(true);
  });

  it('Meter instruction step', function(){
    var is = new Instruction.Set();
    is.meter.enabled = true;
    is.clear.enabled = false;
    is.goto_.enabled = false;
    is.metadata.enabled = false;
    is.write.enabled = false;
    is.apply.enabled = false;

    var ctx = {meter: -1 };
    is.meter.id = 10;
    is.step(null, ctx);
    expect(is.isEmpty()).toBe(true);
    expect(is.meter.enabled).toBe(false);

  });

});
