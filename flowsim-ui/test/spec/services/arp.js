'use strict';

describe('Service: ARP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ARP;
  beforeEach(inject(function (_ARP_) {
    ARP = _ARP_;
  }));

  var ETHERNET;
  beforeEach(inject(function (_ETHERNET_) {
    ETHERNET = _ETHERNET_;
  }));

  it('ARP Construction Fail', function() {
      expect(!!ARP).toBe(true);

      expect(function(){
        new ARP.mkARP('0x000','gg:gg:gg:gg:gg:gg', '1.1.1.1',
          'aa:bb:cc:dd:ee:ff');
      }).toThrow();

      expect(function(){
        ARP.mkARP('0x000','00;bb;cc;dd','1.1.1.1','00:00:00:00:00:00',
          '10.10.10.10');
      }).toThrow();

      expect(function(){
        ARP.mkARP('0x000','aa:bb:cc:dd:ee:ff','1.1','00:00:00:00:00:00',
          '10.10.10.10');
      }).toThrow();

  });

  it('ARP Construction Pass', function() {
    expect(!!ARP).toBe(true);

    new ARP.mkARP('0x0001', 'aa:bb:cc:dd:ee:ff', '1.1.1.1',
        '00:00:00:00:00:00');

    new ARP.ARP(null, '0x0001', 'aa:bb:cc:dd:ee:ff', '1.1.1.1',
        '00:00:00:00:00:00');
  });

  it('ARP equivalency Pass', function() {
    var arp_disco = new ARP.ARP(null, '0x0023',
      '00:11:22:33:44:55',
      '192.168.1.1',
      '55:44:33:22:11:00',
      '10.10.10.10');
    var arp2 = JSON.stringify(arp_disco);
    var arp2_ = new ARP.ARP(JSON.parse(arp2));

    arp_disco.opcode('0x0011');
    expect(arp_disco.opcode().toString(16)).toBe('0x0011');

    arp_disco.sha('11:22:33:44:55:66');
    expect(arp_disco.sha().toString(16)).toBe('11:22:33:44:55:66');

    arp_disco.spa('100.100.100.100');
    expect(arp_disco.spa().toString(16)).toBe('100.100.100.100');

    arp_disco.tha('66:55:44:33:22:11');
    expect(arp_disco.tha().toString(16)).toBe('66:55:44:33:22:11');

    arp_disco.tpa('100.100.100.101');
    expect(arp_disco.tpa().toString(16)).toBe('100.100.100.101');

    arp2_.sha('11:22:33:44:55:66');
    expect(arp2_.sha().toString(16)).toBe('11:22:33:44:55:66');

    arp2_.spa('100.100.100.100');
    expect(arp2_.spa().toString(16)).toBe('100.100.100.100');

    arp2_.tha('66:55:44:33:22:11');
    expect(arp2_.tha().toString(16)).toBe('66:55:44:33:22:11');

    arp2_.tpa('100.100.100.101');
    expect(arp2_.tpa().toString(16)).toBe('100.100.100.101');

  });

  it('Opcode Construction Pass', function() {
    expect(!!ARP).toBe(true);
    new ARP.ARP.Opcode(null,'1');
    new ARP.ARP.Opcode(null,'2');
    new ARP.ARP.Opcode(null,1);
    new ARP.ARP.Opcode(null, 2);
    new ARP.mkOpcode(null);
    new ARP.mkOpcode('2');
    new ARP.mkOpcode(2);
    new ARP.mkOpcode('0xffff');

  });

  it('Opcode Match', function() {
    expect(!!ARP).toBe(true);
    var opcode1= new ARP.ARP.Opcode(null, 1);
    var opcode2 = new ARP.ARP.Opcode(null, '1');

    var match1 = new ARP.ARP.Opcode.Match(null, opcode1, opcode2);

    expect(match1.match(new ARP.ARP.Opcode(null, 1))).toBe(true);

  });



  it('MAC Construction Pass', function() {
    expect(!!ARP).toBe(true);
    new ARP.ARP.MAC(null, '00:00:00:00:00:00');
    new ARP.ARP.MAC(null, '11:22:33:44:55:66');
  });

  it('MAC Construction Fail', function() {
    expect(!!ARP).toBe(true);

    expect(function(){
      new ARP.ARP.MAC(null, '00:gg:00:00:00:00');
    }).toThrow();

    expect(function() {
      new ARP.ARP.MAC(null, '00:00:00:00:00:00:00');
    }).toThrow();

    expect(function() {
      new ARP.ARP.MAC(null, '');
    }).toThrow();
  });

  it('ARP Construction Pass', function() {
    new ARP.mkARP();
    new ARP.mkARP(null, 'aa:bb:cc:dd:ee:ff', '192.168.1.1', 'ff:ee:dd:cc:bb:aa', '127.0.0.1');

    new ARP.mkARP(null, ARP.mkSha(), '10.10.10.10', ARP.mkTha(), '100.100.100.100');

  });

  it('ARP Construction Fail', function() {
    expect(function(){
      new ARP.mkARP(null, 'fff.fff.fff.fff');
    }).toThrow();

  });

  it('ARP Opcode match Pass', function() {
    expect(!!ARP).toBe(true);

    var a = ARP.mkOpcode('0x0123');
    var b = ARP.mkOpcode('0xffff');
    var c = ARP.mkOpcode('0x91ab');

    var every = ARP.mkOpcodeMatch('0x0000', '0x0000');
    var multi = ARP.mkOpcodeMatch('0x0100', '0x0100');
    var exact = ARP.mkOpcodeMatch('0x0123', '0xffff');

    expect(every.match(a)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(c)).toBe(true);

    expect(multi.match(a)).toBe(true);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(c)).toBe(true);

    expect(exact.match(a)).toBe(true);
    expect(exact.match(b)).toBe(false);
    expect(exact.match(c)).toBe(false);

  });

  it('ARP Opcode match fail', function() {
    expect(!!ARP).toBe(true);

    expect(function(){
      ARP.mkOpcodeMatch('0xgggg', '0xaaaa' );
    }).toThrow();

  });

  it('SHA match Pass', function() {
      var u = ARP.mkSha('00:11:22:33:44:55');
      var b = ARP.mkSha('ff:ff:ff:ff:ff:ff');
      var m = ARP.mkSha('91:ab:ba:ef:cd:45');

      var every = ARP.mkShaMatch(
        '00:00:00:00:00:00', '00:00:00:00:00:00'
        );
      var multi = ARP.mkShaMatch(
        '01:00:00:00:00:00', '01:00:00:00:00:00'
        );

      var exact = ARP.mkShaMatch( u, b);

      expect(every.match(u)).toBe(true);
      expect(every.match(b)).toBe(true);
      expect(every.match(m)).toBe(true);

      expect(multi.match(u)).toBe(false);
      expect(multi.match(b)).toBe(true);
      expect(multi.match(m)).toBe(true);

      expect(exact.match(u)).toBe(true);
      expect(exact.match(b)).toBe(false);
      expect(exact.match(m)).toBe(false);
  });

  it('THA match Pass', function() {
      var u = ARP.mkTha('00:11:22:33:44:55');
      var b = ARP.mkTha('ff:ff:ff:ff:ff:ff');
      var m = ARP.mkTha('91:ab:ba:ef:cd:45');

      var every = ARP.mkThaMatch(
        '00:00:00:00:00:00', '00:00:00:00:00:00'
        );
      var multi = ARP.mkThaMatch(
        '01:00:00:00:00:00', '01:00:00:00:00:00'
        );

      var exact = ARP.mkThaMatch( u, b);

      expect(every.match(u)).toBe(true);
      expect(every.match(b)).toBe(true);
      expect(every.match(m)).toBe(true);

      expect(multi.match(u)).toBe(false);
      expect(multi.match(b)).toBe(true);
      expect(multi.match(m)).toBe(true);

      expect(exact.match(u)).toBe(true);
      expect(exact.match(b)).toBe(false);
      expect(exact.match(m)).toBe(false);
  });

  it('Spa match Pass', function() {
    var u = ARP.mkSpa('70.168.1.1');
    var b = ARP.mkSpa('255.255.255.255');
    var m = ARP.mkSpa('157.168.1.1');

    var every = ARP.mkSpaMatch('0.0.0.0', '0.0.0.0');
    var multi = ARP.mkSpaMatch('1.0.0.0', '1.0.0.0');
    var exact = ARP.mkSpaMatch(u,b);

    expect(every.match(u)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(m)).toBe(true);

    expect(multi.match(u)).toBe(false);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(m)).toBe(true);

    expect(exact.match(u)).toBe(true);
    expect(exact.match(b)).toBe(false);
    expect(exact.match(m)).toBe(false);

  });

  it('TPA match Pass', function() {
    var u = ARP.mkTpa('70.168.1.1');
    var b = ARP.mkTpa('255.255.255.255');
    var m = ARP.mkTpa('157.168.1.1');

    var every = ARP.mkTpaMatch('0.0.0.0', '0.0.0.0');
    var multi = ARP.mkTpaMatch('1.0.0.0', '1.0.0.0');
    var exact = ARP.mkTpaMatch(u,b);

    expect(every.match(u)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(m)).toBe(true);

    expect(multi.match(u)).toBe(false);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(m)).toBe(true);

    expect(exact.match(u)).toBe(true);
    expect(exact.match(b)).toBe(false);
    expect(exact.match(m)).toBe(false);

  });

  it('TPA match equal Pass', function() {
    var a = new ARP.mkTpaMatch('1.1.1.1', '1.1.1.1');
    var b = new ARP.mkTpaMatch('2.2.2.2', '1.1.1.1');
    var c = new ARP.mkTpaMatch('1.1.1.1', '2.2.2.2');
    var d = new ARP.mkTpaMatch('2.2.2.2', '2.2.2.2');
    var e = new ARP.mkTpaMatch('1.1.1.1', '1.1.1.1');

    expect(a.equal(b)).toBe(false);
    expect(a.equal(c)).toBe(false);
    expect(a.equal(d)).toBe(false);
    expect(a.equal(e)).toBe(true);
  });

  it('SPA match equal Pass', function() {
    var a = new ARP.mkSpaMatch('1.1.1.1', '1.1.1.1');
    var b = new ARP.mkSpaMatch('2.2.2.2', '1.1.1.1');
    var c = new ARP.mkSpaMatch('1.1.1.1', '2.2.2.2');
    var d = new ARP.mkSpaMatch('2.2.2.2', '2.2.2.2');
    var e = new ARP.mkSpaMatch('1.1.1.1', '1.1.1.1');

    expect(a.equal(b)).toBe(false);
    expect(a.equal(c)).toBe(false);
    expect(a.equal(d)).toBe(false);
    expect(a.equal(e)).toBe(true);
  });

  it('SHA match equal Pass', function() {
    var a = new ARP.mkShaMatch('01:01:01:01:01:01', '01:01:01:01:01:01');
    var b = new ARP.mkShaMatch('02:02:02:02:02:02', '01:01:01:01:01:01');
    var c = new ARP.mkShaMatch('01:01:01:01:01:01', '02:02:02:02:02:02');
    var d = new ARP.mkShaMatch('02:02:02:02:02:02', '02:02:02:02:02:02');
    var e = new ARP.mkShaMatch('01:01:01:01:01:01', '01:01:01:01:01:01');

    expect(a.equal(b)).toBe(false);
    expect(a.equal(c)).toBe(false);
    expect(a.equal(d)).toBe(false);
    expect(a.equal(e)).toBe(true);
  });

  it('THA match equal Pass', function() {
    var a = new ARP.mkThaMatch('01:01:01:01:01:01', '01:01:01:01:01:01');
    var b = new ARP.mkThaMatch('02:02:02:02:02:02', '01:01:01:01:01:01');
    var c = new ARP.mkThaMatch('01:01:01:01:01:01', '02:02:02:02:02:02');
    var d = new ARP.mkThaMatch('02:02:02:02:02:02', '02:02:02:02:02:02');
    var e = new ARP.mkThaMatch('01:01:01:01:01:01', '01:01:01:01:01:01');

    expect(a.equal(b)).toBe(false);
    expect(a.equal(c)).toBe(false);
    expect(a.equal(d)).toBe(false);
    expect(a.equal(e)).toBe(true);
  });

  it('Opcode match equal Pass', function() {
    var a = new ARP.mkOpcodeMatch('0x0001', '0x0001');
    var b = new ARP.mkOpcodeMatch('0x0001', '0x0002');
    var c = new ARP.mkOpcodeMatch('0x0002', '0x0001');
    var d = new ARP.mkOpcodeMatch('0x0002', '0x0002');
    var e = new ARP.mkOpcodeMatch('0x0001', '0x0001');

    expect(a.equal(b)).toBe(false);
    expect(a.equal(c)).toBe(false);
    expect(a.equal(d)).toBe(false);
    expect(a.equal(e)).toBe(true);
  });


  it('should do something', function () {
    expect(!!ARP).toBe(true);
  });

});
