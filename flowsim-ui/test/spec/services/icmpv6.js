'use strict';

describe('Service: ICMPv6', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ICMPV6;
  beforeEach(inject(function (_ICMPV6_) {
    ICMPV6 = _ICMPV6_;
  }));

  it('Type/Code Construction Pass', function () {
    expect(!!ICMPV6).toBe(true);
    
    ICMPV6.mkType();
    var port1 = ICMPV6.mkType('255');
    ICMPV6.mkType(port1);

    ICMPV6.mkCode();
    var port2 = ICMPV6.mkCode('0xff');
    ICMPV6.mkCode(port2);
  });

  it('Construction Pass', function () {
    expect(!!ICMPV6).toBe(true);

    var icmpv61 = new ICMPV6.ICMPv6(null, '0xff', '255');
    var icmpv62 = new ICMPV6.ICMPv6(icmpv61);
    icmpv62.clone();
    ICMPV6.mkICMPv6('0', '255');
  });
  
  it('Construction Fail', function () {
    expect(!!ICMPV6).toBe(true);

    var type1 = '256';
    var type2 = '-1';
    var type3 = '130';
    var code1 = type1;
    var code2 = type2;
    var code3 = type3;

    expect(function() {new ICMPV6.ICMPv6(null, type1, code3);}).toThrow();
    expect(function() {ICMPV6.mkICMPv6(type2, code3);}).toThrow();
    expect(function() {new ICMPV6.ICMPv6(null, type3, code1);}).toThrow();
    expect(function() {ICMPV6.mkICMPv6(type3, code2);}).toThrow();
  });

  it('Match Tests', function () {
    expect(!!ICMPV6).toBe(true);

    var type1 = ICMPV6.mkType('255');
    var type2 = ICMPV6.mkType('0');
    var code1 = ICMPV6.mkCode('255');
    var code2 = ICMPV6.mkCode('0');

    var match1 = ICMPV6.mkTypeMatch('255', '0xff');
    var match2 = ICMPV6.mkTypeMatch('0', '0x00');
    var match3 = ICMPV6.mkCodeMatch('255', '0xff');
    var match4 = ICMPV6.mkCodeMatch('0', '0x00');

    expect(match1.match(type1)).toBe(true);
    expect(match1.match(type2)).toBe(false);
    expect(match2.match(type1)).toBe(true);
    expect(match2.match(type2)).toBe(true);
    expect(match3.match(code1)).toBe(true);
    expect(match3.match(code2)).toBe(false);
    expect(match4.match(code1)).toBe(true);
    expect(match4.match(code2)).toBe(true);

  });

  it('Set fields Tests', function () {
    expect(!!ICMPV6).toBe(true);

    var icmpv61 = ICMPV6.mkICMPv6('255', '0xff');
    expect(icmpv61.type().toString()).toBe('255');
    expect(icmpv61.code().toString()).toBe('255');

    icmpv61.type('0');
    icmpv61.code('0x7f');

    expect(icmpv61.type().toString()).toBe('0');
    expect(icmpv61.code().toString()).toBe('127');
  });

  it('JSON Construction Equivalency Tests', function () {
    expect(!!ICMPV6).toBe(true);
    
    var icmpv61 = ICMPV6.mkICMPv6('0', '255');
    var icmpv62 = new ICMPV6.ICMPv6(JSON.parse(JSON.stringify(icmpv61)));

    expect(icmpv62.toString()).toBe(icmpv61.toString());
  });

  it('Summarize Tests', function () {
    expect(!!ICMPV6).toBe(true);

    var match = ICMPV6.mkTypeMatch('255', '0xff');
    expect(match.summarize()).toBe('icmpv6');

    var match = ICMPV6.mkCodeMatch('255', '0xff');
    expect(match.summarize()).toBe('icmpv6');
  });

  it('Equal Tests', function() {
    expect(!!ICMPV6).toBe(true);

    var match1 = ICMPV6.mkTypeMatch('255', '0xff');
    var match2 = ICMPV6.mkTypeMatch('255', '0xff');
    var match4 = ICMPV6.mkTypeMatch('0', '0xff');
    var match5 = ICMPV6.mkTypeMatch('255', '0xf0');

    expect(match1.equal(match2)).toBe(true);
    expect(match2.equal(match1)).toBe(true);

    expect(match4.equal(match1)).toBe(false);
    expect(match5.equal(match1)).toBe(false);
    expect(match1.equal(match4)).toBe(false);
    expect(match1.equal(match5)).toBe(false);

    expect(match4.equal(match5)).toBe(false);
    expect(match5.equal(match4)).toBe(false);

    match1 = ICMPV6.mkCodeMatch('255', '0xff');
    match2 = ICMPV6.mkCodeMatch('255', '0xff');
    match4 = ICMPV6.mkCodeMatch('0', '0xff');
    match5 = ICMPV6.mkCodeMatch('255', '0xf0');

    expect(match1.equal(match2)).toBe(true);
    expect(match2.equal(match1)).toBe(true);

    expect(match4.equal(match1)).toBe(false);
    expect(match5.equal(match1)).toBe(false);
    expect(match1.equal(match4)).toBe(false);
    expect(match1.equal(match5)).toBe(false);

    expect(match4.equal(match5)).toBe(false);
    expect(match5.equal(match4)).toBe(false);
  });

});
