'use strict';

describe('Service: action', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Action;
  var Utils;
  var Packet;
  var Dataplane;
  var Context;
  var Switch;
  var Profile;
  beforeEach(inject(function (_Dataplane_, _Action_, _Utils_, _Packet_, 
    _Context_, _Switch_, _Profile_) {
    Context = _Context_;
    Action = _Action_;
    Packet = _Packet_;
    Utils = _Utils_;
    Dataplane = _Dataplane_;
    Switch = _Switch_;
    Profile = _Profile_;
  }));
  var sw;
  beforeEach(function(){
    var prof = new Profile.Profile('testprofile');
    var sw = Switch.create('testsw', prof);
  });

  it('Action Set construction', function(){
    var as = new Action.Set();
    expect(as.actions.length).toBe(0);
  });

  it('Action Set add', function(){
    var as = new Action.Set();
    var act = Utils.mkAction('Ethernet', 'Src', 'set', 'a:a:a:a:a:a');
    var act2 = Utils.mkAction('Ethernet', 'Src', 'set', 'b:b:b:b:b:b');
    as.actions.push(act2);
    as.add(act);
    expect(as.actions.length).toBe(1);
  });

  it('Action Set add CopyTTLIn', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');

    // MPLS -> IPv4
    var act = Utils.mkAction('MPLS', 'TTL', 'copy-in', '');
    expect(act.op).toBe('copy-in');
    pack.pushProtocol('0x8847');
    pack.pushProtocol('0x0800');
    pack.setField('MPLS', 'TTL', '0x77');
    as.add(act);

    // step through
    var context = {packet: pack};

    as.step(null, context);
    as.step(null, context);
    expect(as.isEmpty()).toBe(true);
    expect(pack.getField('IPv4', 'TTL').valueToString()).toBe('119');

    // MPLS -> IPv6
    var actMPLS = Utils.mkAction('MPLS', 'TTL', 'copy-in', '');
    var act6 = Utils.mkAction('IPv6', 'TTL', 'copy-in', '');
    pack.popProtocol();
    pack.popProtocol();
    pack.pushProtocol('0x8847');
    pack.setField('MPLS', 'TTL', '0x77');
    pack.pushProtocol('0x86dd');
    as.add(actMPLS);
    as.add(act6);
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('0');
    // expect step should copy mpls ttl to ipv6 ttl
    as.step(null, context);
    expect(as.isEmpty()).toBe(false);
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('119');
    // expect action copy ipv6 ttl -> inner to throw because inner doesnt exist
    expect(function(){
      as.step(null, context);
    }).toThrow(); 
  });

  it('Action Set step copyttlin mpls -> mpls|ipv4|ipv6 pass', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x8847');
    pack.setField('MPLS', 'TTL', '0x77');
    var mplsAct = Utils.mkAction('MPLS', 'TTL', 'copy-in', '');
    var ipv6Act = Utils.mkAction('IPv6', 'TTL', 'copy-in', '');
    var context = {packet: pack};

    // mpls -> mpls
    pack.pushProtocol('0x8847');
    as.add(mplsAct);
    as.step(null, context);
    as.step(null, context);
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[2].getField('TTL').valueToString()).toBe('119');

    // mpls -> ipv4
    pack.popProtocol();
    pack.pushProtocol('0x0800');
    as.add(mplsAct);
    as.step(null, context);
    as.step(null, context);
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[2].getField('TTL').valueToString()).toBe('119');

    // mpls -> mpls -> ipv6
    pack.popProtocol();
    pack.pushProtocol('0x8847');
    pack.pushProtocol('0x86dd');
    as.add(mplsAct);
    as.add(ipv6Act);
    as.step(null, context);
    expect(as.isEmpty()).toBe(false);
    expect(pack.protocols[2].getField('TTL').valueToString()).toBe('119');
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set step copyttlin mpls -> mpls fail', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x8847');
    pack.setField('MPLS', 'TTL', '0x77');
    var context = {packet: pack};

    var mplsAct = Utils.mkAction('MPLS', 'TTL', 'copy-in', '');
    as.add(mplsAct);
    // expect to fail because packet does not contain engouh protos
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set step copyttlin ipv4 fail', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x0800');
    pack.setField('IPv4', 'TTL', '0x77');
    var context = {packet: pack};

    var ipv4Act = Utils.mkAction('IPv4', 'TTL', 'copy-in', '');
    as.add(ipv4Act);

    // expect to fail because packet does not contain engouh protos
    expect(function(){
      as.step(null, context);
    }).toThrow();


    //expect to fail because next proto does not contain ttl
    pack.pushProtocol('0x06');
    as.add(ipv4Act);
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set step copyttlin ipv6 fail', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x86dd');
    pack.setField('IPv6', 'TTL', '0x77');
    var context = {packet: pack};

    var mplsAct = Utils.mkAction('IPv6', 'TTL', 'copy-in', '');
    as.add(mplsAct);

    // expect to fail because packet does not contain engouh protos
    expect(function(){
      as.step(null, context);
    }).toThrow();


    //expect to fail because next proto does not contain ttl
    pack.pushProtocol('0x06');
    as.add(mplsAct);
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set add popTags pushTags', function(){
    var as = new Action.Set();
    var popAct = Utils.mkAction('MPLS', 'tag', 'pop', '');
    var popVLAN = Utils.mkAction('VLAN', 'tag', 'pop', '');
    var pushMPLS = Utils.mkAction('MPLS', 'tag', 'push', '');
    var pushVLAN = Utils.mkAction('VLAN', 'tag', 'push', '');
    as.add(popAct);
    as.add(popVLAN);
    as.add(pushMPLS);
    as.add(pushVLAN);
    expect(as.actions.length).toBe(4);
  });

  it('Action Set step popTags pushTags pass', function(){
    var as = new Action.Set();
    var popAct = Utils.mkAction('MPLS', 'tag', 'pop', '');
    var popVLAN = Utils.mkAction('VLAN', 'tag', 'pop', '');
    var pushMPLS = Utils.mkAction('MPLS', 'tag', 'push', '');
    var pushVLAN = Utils.mkAction('VLAN', 'tag', 'push', '');
    as.add(popAct);
    as.add(popVLAN);
    as.add(pushMPLS);
    as.add(pushVLAN);
    var pack = new Packet.Packet('test');
    pack.pushProtocol('0x8100');
    pack.pushProtocol('0x8847');
    var ctx = {packet: pack};

    // pop vlan first
    as.step(null, ctx);
    expect(pack.protocols.length).toBe(2);
    expect(pack.protocols[1].name).toBe('MPLS');

    // pop mpls next
    as.step(null, ctx);
    expect(pack.protocols.length).toBe(1);

    // push vlan
    as.step(null, ctx);
    expect(pack.protocols[1].name).toBe('VLAN');
    expect(as.isEmpty()).toBe(false);

    // push mpls
    as.step(null, ctx);
    expect(pack.protocols[2].name).toBe('MPLS');

    expect(as.isEmpty()).toBe(true);
  });

  it('Action Set step popTags fail', function(){
    var as = new Action.Set();
    var popMPLS = Utils.mkAction('MPLS', 'tag', 'pop', '');
    var popVLAN = Utils.mkAction('VLAN', 'tag', 'pop', '');
    as.add(popMPLS);

    var pack = new Packet.Packet('test');
    pack.pushProtocol('0x0800');
    var ctx = {packet: pack};

    // missing mpls error
    expect(function(){
      as.step(null, ctx);
    }).toThrow();

    // missing vlan error 
    as.clear();
    as.add(popVLAN);
    expect(function(){
      as.step(null, ctx);
    }).toThrow();

  });

  it('Action Set step copyTTLOut ipv4|ipv6|mpls -> mpls pass', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x8847');
    var context = {packet: pack};

    // ipv4 -> mpls
    pack.pushProtocol('0x0800');
    pack.setField('IPv4', 'TTL', '0x77');
    var ipv4Act = Utils.mkAction('IPv4', 'TTL', 'copy-out', '');
    as.add(ipv4Act);
    as.step(null, context);
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[1].getField('TTL').valueToString()).toBe('119');

    // ipv4 -> mpls
    pack.popProtocol();
    pack.pushProtocol('0x86dd');
    pack.setField('IPv6', 'TTL', '0x10');
    var ipv6Act = Utils.mkAction('IPv6', 'TTL', 'copy-out', '');
    as.add(ipv6Act);
    as.step(null, context);
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[1].getField('TTL').valueToString()).toBe('16');

    // mpls -> mpls
    pack.popProtocol();
    pack.pushProtocol('0x8847');
    pack.protocols[2].setField('TTL', '0x11');
    var MPLSAct = Utils.mkAction('MPLS', 'TTL', 'copy-out', '');
    as.add(MPLSAct);
    as.step(null, context);
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[1].getField('TTL').valueToString()).toBe('17');
  });

  it('Action Set step copyTTLOut ipv4|ipv6|mpls missing outer tag fail', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    // ipv4, missing outer tag
    pack.pushProtocol('0x0800');
    pack.setField('IPv4', 'TTL', '0x77');
    var ipv4Act = Utils.mkAction('IPv4', 'TTL', 'copy-out', '');
    as.add(ipv4Act);
    // no outer tag to copy to
    expect(function(){
      as.step(null, context);
    }).toThrow();

    // ipv6, missing outer tag
    pack.popProtocol();
    pack.pushProtocol('0x86dd');
    pack.setField('IPv6', 'TTL', '0x10');
    var ipv6Act = Utils.mkAction('IPv6', 'TTL', 'copy-out', '');
    as.add(ipv6Act);
    // no outer tag to copy to
    expect(function(){
      as.step(null, context);
    }).toThrow();

    // mpls, missing outer tag
    pack.popProtocol();
    pack.pushProtocol('0x8847');
    var MPLSAct = Utils.mkAction('MPLS', 'TTL', 'copy-out', '');
    as.add(MPLSAct);
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set step copyTTLOut ipv4|ipv6|mpls invalid outer tag fail', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};
    pack.pushProtocol('0x8100');

    // ipv4, invalid outer tag
    pack.pushProtocol('0x0800');
    pack.setField('IPv4', 'TTL', '0x77');
    var ipv4Act = Utils.mkAction('IPv4', 'TTL', 'copy-out', '');
    as.add(ipv4Act);
    expect(function(){
      as.step(null, context);
    }).toThrow();

    // ipv6, ivalid outer tag
    pack.popProtocol();
    pack.pushProtocol('0x86dd');
    pack.setField('IPv6', 'TTL', '0x10');
    var ipv6Act = Utils.mkAction('IPv6', 'TTL', 'copy-out', '');
    as.add(ipv6Act);
    expect(function(){
      as.step(null, context);
    }).toThrow();

    // mpls, invalid outer tag
    pack.popProtocol();
    pack.pushProtocol('0x8847');
    var MPLSAct = Utils.mkAction('MPLS', 'TTL', 'copy-out', '');
    as.add(MPLSAct);
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set step copyTTLOut ipv4|ipv6|mpls missing proto', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};


    var ipv4Act = Utils.mkAction('IPv4', 'TTL', 'copy-out', '');
    as.add(ipv4Act);
    // packet does not contain ipv4
    expect(function(){
      as.step(null, context);
    }).toThrow();

    // packet does not contain ipv6
    var ipv6Act = Utils.mkAction('IPv6', 'TTL', 'copy-out', '');
    as.clear();
    as.add(ipv6Act);
    expect(function(){
      as.step(null, context);
    }).toThrow();

    // mpls, missing outer tag
    as.clear();
    var MPLSAct = Utils.mkAction('MPLS', 'TTL', 'copy-out', '');
    as.add(MPLSAct);
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set decTTL ipv4|ipv6|mpls pass', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    //ipv4 dec
    pack.pushProtocol('0x0800');
    pack.setField('IPv4', 'TTL', '0xff');
    var ip4 = Utils.mkAction('IPv4', 'TTL', 'dec', '');
    as.add(ip4);
    as.step(null, context);
    expect(pack.getField('IPv4', 'TTL').valueToString()).toBe('254');
    expect(as.isEmpty()).toBe(true);

    //ipv6 dec
    pack.popProtocol();
    pack.pushProtocol('0x86dd');
    pack.setField('IPv6', 'TTL', '0x77');
    var ipv6 = Utils.mkAction('IPv6', 'TTL', 'dec', '');
    as.add(ipv6);
    as.step(null, context);
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('118');
    expect(as.isEmpty()).toBe(true);

    //mpls dec
    pack.pushTag('MPLS');
    var mp = Utils.mkAction('MPLS', 'TTL', 'dec', '');
    pack.setField('MPLS', 'TTL', '0xff');
    pack.setField('IPv6', 'TTL', '0xff');
    as.add(mp);
    as.add(ipv6);
    as.step(null, context);
    expect(pack.getField('MPLS', 'TTL').valueToString()).toBe('254');
    as.step(null, context);
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('254');
    expect(as.isEmpty()).toBe(true);
  });

  it('Action Set decTTL ipv4|ipv6|mpls fail', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    //ipv4 missing field
    var ip4 = Utils.mkAction('IPv4', 'TTL', 'dec', '');
    as.add(ip4);
    expect(function(){
      as.step(null, context);
    }).toThrow();
    expect(as.isEmpty()).toBe(true);

    //ipv6 missing field
    var ipv6 = Utils.mkAction('IPv6', 'TTL', 'dec', '');
    as.add(ipv6);
    expect(function(){
      as.step(null, context);
    }).toThrow();
    expect(as.isEmpty()).toBe(true);

    //mpls missing field
    var mp = Utils.mkAction('MPLS', 'TTL', 'dec', '');
    as.add(mp);
    as.add(ipv6);
    expect(function(){
      as.step(null, context);
    }).toThrow();
    expect(as.isEmpty()).toBe(false);
  });

  it('Action setField pass', function(){
    var prof = new Profile.Profile('testprofile');
    var sw = Switch.create('testsw', prof);
    var dp = new Dataplane.Dataplane(sw);
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x0800');
    var context = new Context.Context(null, pack, 1, 1, 1, 1);
    var ethSrc = Utils.mkAction('Ethernet', 'Src', 'set', 'aa:bb:cc:dd:ee:ff');
    var ip4Src = Utils.mkAction('IPv4', 'Src', 'set', '192.168.1.1');
    dp.ctx = context;
    as.add(ethSrc);
    as.add(ip4Src);
    
    as.step(dp, dp.ctx);
    expect(as.isEmpty()).toBe(false);
    expect(dp.ctx.packet.protocols[0].getField('Src').valueToString())
      .toBe('aa:bb:cc:dd:ee:ff');
    as.step(dp, dp.ctx);
    expect(dp.ctx.packet.protocols[1].getField('Src').valueToString())
      .toBe('192.168.1.1');
    expect(as.isEmpty()).toBe(true);
  });

  it('Action setField fail', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x0800');
    var context = {packet: pack};

    // protocol does not exist
    var ipv6 = Utils.mkAction('IPv6', 'TTL', 'set', '0x88');
    as.add(ipv6);
    expect(function(){
      as.step(null, context);
    }).toThrow();

  });

  it('Action Set add and step queue', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    var qAct = Utils.mkAction('Internal', 'Queue', 'set', '1');
    as.add(qAct);
    as.step(null, context);
    expect(as.isEmpty()).toBe(true);
  });

  it('Action Set add and step group', function(){
    var prof = new Profile.Profile('test');
    var sw = new Switch.Switch('testsw', prof);    
    var dp = new Dataplane.Dataplane(sw);
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    var gAct = Utils.mkAction('Internal', 'Group', 'set', '1');
    as.add(gAct);
    as.step(dp, context);
    expect(as.isEmpty()).toBe(true);
  });

  it('Action Set add and step output', function(){
    var prof = new Profile.Profile('test');
    var sw = new Switch.Switch('sw', prof);
    var dp = new Dataplane.Dataplane(sw);
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    var gAct = Utils.mkAction('Internal', 'Output', 'set', '1');
    as.add(gAct);
    as.step(dp, context);
    expect(as.isEmpty()).toBe(true);
  });

  it('Action Set sort pass', function(){
    var as = new Action.Set();
    var act1 = Utils.mkAction('Internal', 'Queue', 'set', '1');
    var act2 = Utils.mkAction('Internal', 'Output', 'set', '1');
    var act3 = Utils.mkAction('Ethernet', 'Src', 'set', 'a:b:c:D:e:f');
    var act4 = Utils.mkAction('IPv4', 'TTL', 'dec', '');
    as.add(act2);
    as.add(act1);
    as.add(act3);
    as.add(act4);
    expect(as.actions[3].field).toBe('Output');
  });

});
