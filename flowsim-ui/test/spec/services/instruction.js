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
    var list = new Action.List();

    list.push(new Action.Push(null, new VLAN.VLAN()));

    var app = new Instruction.Apply(null, list);
    set.apply(app);

    var pkt = new Packet.Packet('pack1');
    pkt.push(new IPV4.mkIPv4());

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

});
