'use strict';

ddescribe('Service: action', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Action;
  var Utils;
  var Packet;
  beforeEach(inject(function (_Action_, _Utils_, _Packet_) {
    Action = _Action_;
    Packet = _Packet_;
    Utils = _Utils_;
  }));

  it('Action Set construction', function(){
    var as = new Action.Set();
  });

  it('Action Set add CopyTTLIn', function(){
    var as = new Action.Set();
    var act = Utils.mkAction('MPLS', 'TTL', 'copy-in', '');
    expect(act.op).toBe('copy-in')
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x8847');
    pack.pushProtocol('0x0800');
    pack.setField('MPLS', 'TTL', '0x77');
    as.add(act);
    expect(as.actions.copyTTLIn.protocol).toBe('MPLS');

    // step through
    var context = {packet: pack};
    as.step(null, context);

    expect(as.isEmpty()).toBe(true);
  });

});
