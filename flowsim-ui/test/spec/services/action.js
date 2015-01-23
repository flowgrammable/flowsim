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
  beforeEach(inject(function (_Dataplane_, _Action_, _Utils_, _Packet_, 
    _Context_) {
    Context = _Context_;
    Action = _Action_;
    Packet = _Packet_;
    Utils = _Utils_;
    Dataplane = _Dataplane_;
  }));

  it('Action Set construction', function(){
    var as = new Action.Set();
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
    expect(act.op).toBe('copy-in')
    pack.pushProtocol('0x8847');
    pack.pushProtocol('0x0800');
    pack.setField('MPLS', 'TTL', '0x77');
    as.add(act);

    // step through
    var context = {packet: pack};

    expect(as.step(null, context)).toBe(true);
    expect(as.step(null, context)).toBe(false);
    expect(as.isEmpty()).toBe(true);
    expect(pack.getField('IPv4', 'TTL').valueToString()).toBe('0x77');

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
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('0x00');
    // expect step should copy mpls ttl to ipv6 ttl
    as.step(null, context)
    expect(as.isEmpty()).toBe(false);
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('0x77');
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
    expect(as.step(null, context)).toBe(true);
    expect(as.step(null, context)).toBe(false);
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[2].getField('TTL').valueToString()).toBe('0x77');

    // mpls -> ipv4
    pack.popProtocol();
    pack.pushProtocol('0x0800');
    as.add(mplsAct);
    expect(as.step(null, context)).toBe(true);
    expect(as.step(null, context)).toBe(false);
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[2].getField('TTL').valueToString()).toBe('0x77');

    // mpls -> mpls -> ipv6
    pack.popProtocol();
    pack.pushProtocol('0x8847');
    pack.pushProtocol('0x86dd');
    as.add(mplsAct);
    as.add(ipv6Act);
    expect(as.step(null, context)).toBe(true);
    expect(as.isEmpty()).toBe(false);
    expect(pack.protocols[2].getField('TTL').valueToString()).toBe('0x77');
    expect(function(){
      as.step(null, context)
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
    as.add(popVLAN)
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
    expect(as.step(null, ctx)).toBe(true);
    expect(pack.protocols.length).toBe(2);
    expect(pack.protocols[1].name).toBe('MPLS');

    // pop mpls next
    expect(as.step(null, ctx)).toBe(true);
    expect(pack.protocols.length).toBe(1);

    // push vlan
    expect(as.step(null, ctx)).toBe(true);
    expect(pack.protocols[1].name).toBe('VLAN');
    expect(as.isEmpty()).toBe(false);

    // push mpls
    expect(as.step(null, ctx)).toBe(true);
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
    as.step(null, context)
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[1].getField('TTL').valueToString()).toBe('0x77');

    // ipv4 -> mpls
    pack.popProtocol();
    pack.pushProtocol('0x86dd');
    pack.setField('IPv6', 'TTL', '0x10');
    var ipv6Act = Utils.mkAction('IPv6', 'TTL', 'copy-out', '');
    as.add(ipv6Act);
    as.step(null, context)
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[1].getField('TTL').valueToString()).toBe('0x10');

    // mpls -> mpls
    pack.popProtocol();
    pack.pushProtocol('0x8847');
    pack.protocols[2].setField('TTL', '0x11');
    var MPLSAct = Utils.mkAction('MPLS', 'TTL', 'copy-out', '');
    as.add(MPLSAct);
    as.step(null, context)
    expect(as.isEmpty()).toBe(true);
    expect(pack.protocols[1].getField('TTL').valueToString()).toBe('0x11');
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
    expect(pack.getField('IPv4', 'TTL').valueToString()).toBe('0xfe');
    expect(as.isEmpty()).toBe(true);

    //ipv6 dec
    pack.popProtocol();
    pack.pushProtocol('0x86dd');
    pack.setField('IPv6', 'TTL', '0x77');
    var ipv6 = Utils.mkAction('IPv6', 'TTL', 'dec', '');
    as.add(ipv6);
    as.step(null, context);
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('0x76');
    expect(as.isEmpty()).toBe(true);

    //mpls dec
    pack.pushTag('MPLS');
    var mp = Utils.mkAction('MPLS', 'TTL', 'dec', '');
    pack.setField('MPLS', 'TTL', '0xff');
    pack.setField('IPv6', 'TTL', '0xff');
    as.add(mp);
    as.add(ipv6);
    as.step(null, context);
    expect(pack.getField('MPLS', 'TTL').valueToString()).toBe('0xfe');
    as.step(null, context);
    expect(pack.getField('IPv6', 'TTL').valueToString()).toBe('0xfe');
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
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    pack.pushProtocol('0x0800');
    var context = new Context.Context(null, pack, 1, 1, 1, 1);
    var ethSrc = Utils.mkAction('Ethernet', 'Src', 'set', 'aa:bb:cc:dd:ee:ff');
    var ip4Src = Utils.mkAction('IPv4', 'Src', 'set', '192.168.1.1');
    as.add(ethSrc);
    as.add(ip4Src);

    expect(as.step(null, context)).toBe(true);
    expect(as.isEmpty()).toBe(false);
    expect(pack.protocols[0].getField('Src').valueToString()).toBe('aa:bb:cc:dd:ee:ff');
    expect(as.step(null, context)).toBe(true);
    expect(pack.protocols[1].getField('Src').valueToString()).toBe('192.168.1.1');
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
      as.step(null, context)
    }).toThrow();

  });

  it('Action Set add and step queue', function(){
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    var qAct = Utils.mkAction('Internal', 'Queue', 'set', '1');
    as.add(qAct);
    expect(as.step(null, context)).toBe(true);
    expect(as.isEmpty()).toBe(true);
  });

  it('Action Set add and step group', function(){
    var dp = new Dataplane.Dataplane({group: 0})
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    var gAct = Utils.mkAction('Internal', 'Group', 'set', '1');
    as.add(gAct);
    as.step(dp, context);
    expect(as.isEmpty()).toBe(true);
  });

  it('Action Set add and step output', function(){
    var dp = new Dataplane.Dataplane({ports: {egress: function egress(pkt, id){return true;}}})
    var as = new Action.Set();
    var pack = new Packet.Packet('pack');
    var context = {packet: pack};

    var gAct = Utils.mkAction('Internal', 'Output', 'set', '1');
    as.add(gAct);
    as.step(dp, context);
    expect(as.isEmpty()).toBe(true);
  });




});
