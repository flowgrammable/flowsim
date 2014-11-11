'use strict';

describe('Service: ARP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ARP;
  beforeEach(inject(function (_ARP_) {
    ARP = _ARP_;
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


  it('should do something', function () {
    expect(!!ARP).toBe(true);
  });

});
