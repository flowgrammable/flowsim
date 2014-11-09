'use strict';

describe('Service: ARP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ARP;
  beforeEach(inject(function (_ARP_) {
    ARP = _ARP_;
  }));

  it('Opcode Construction Fail', function() {
      expect(!!ARP).toBe(true);

      expect(function() {
        new ARP.ARP.Opcode('3');
      }).toThrow();

      expect(function() {
        new ARP.ARP.Opcode('0');
      }).toThrow();

      expect(function() {
        new ARP.ARP.Opcode(0);
      }).toThrow();

      expect(function() {
        new ARP.ARP.Opcode(3);
      }).toThrow();
  });

  it('Opcode Construction Pass', function() {
    expect(!!ARP).toBe(true);
    new ARP.ARP.Opcode(null,'1');
    new ARP.ARP.Opcode(null,'2');
    new ARP.ARP.Opcode(null,1);
    new ARP.ARP.Opcode(null, 2);
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

  it('should do something', function () {
    expect(!!ARP).toBe(true);
  });

});
