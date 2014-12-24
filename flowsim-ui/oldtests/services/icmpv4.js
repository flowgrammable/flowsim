'use strict';

describe('Service: ICMPV4', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ICMPV4;
  beforeEach(inject(function (_ICMPV4_) {
    ICMPV4 = _ICMPV4_;
  }));

  it('Service Test', function () {
    expect(!!ICMPV4).toBe(true);
  });

  it('Construction Pass', function () {
    expect(!!ICMPV4).toBe(true);

    ICMPV4.mkICMPV4(null, 0, 0);

    var ts_req1 = ICMPV4.mkICMPV4(13, 2);
    var ts_req2 = new ICMPV4.ICMPV4(ts_req1);
    var ts_req3 = new ICMPV4.ICMPV4(null, 13, 2);
    var ts_req4 = ts_req1.clone();

    var testStr = ts_req1.toString();
    expect(ts_req2.toString()).toBe(testStr);
    expect(ts_req3.toString()).toBe(testStr);
    expect(ts_req4.toString()).toBe(testStr);
  });

  it('Construction Fail', function () {
    expect(!!ICMPV4).toBe(true);

    expect(function(){ICMPV4.mkICMPV4(0, 69422);}).toThrow();
    expect(function(){ICMPV4.mkICMPV4('66422', 234);}).toThrow();
  });

  it('Make Helper Construction Pass', function () {
    expect(!!ICMPV4).toBe(true);

    var type = ICMPV4.mkType(13);
    var code = ICMPV4.mkCode(2);

    var ts_req1 = ICMPV4.mkICMPV4(type, code);
    var ts_req2 = new ICMPV4.ICMPV4(ts_req1);
    var ts_req3 = new ICMPV4.ICMPV4(null, type, code);
    var ts_req4 = ts_req1.clone();

    var testStr = ts_req1.toString();
    expect(ts_req2.toString()).toBe(testStr);
    expect(ts_req3.toString()).toBe(testStr);
    expect(ts_req4.toString()).toBe(testStr);
  });

  it('Make Helper Construction Fail', function () {
    expect(!!ICMPV4).toBe(true);

    expect(function(){ ICMPV4.mkType(256); }).toThrow();
    expect(function(){ ICMPV4.mkCode(-1); }).toThrow();
  });

  it('Set Field Pass', function () {
    expect(!!ICMPV4).toBe(true);

    var icmp1 = ICMPV4.mkICMPV4(124, 255);

    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    icmp1.type(45);
    expect(icmp1.type().toString()).toBe('45');
    expect(icmp1.code().toString()).toBe('255');
    icmp1.code('78');
    expect(icmp1.type().toString()).toBe('45');
    expect(icmp1.code().toString()).toBe('78');
  });

  it('Set Field Fail', function () {
    expect(!!ICMPV4).toBe(true);

    expect(function(){ICMPV4.mkICMPV4(124, 256);}).toThrow();
    expect(function(){ICMPV4.mkICMPV4(256, 255);}).toThrow();

    var icmp1 = ICMPV4.mkICMPV4(124, 255);

    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    expect(function(){icmp1.type(256);}).toThrow();
    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    expect(function(){icmp1.code(1000);}).toThrow();
    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
  });

  it('Type Match Pass', function() {
    expect(!!ICMPV4).toBe(true);

    var t1 = ICMPV4.mkType(13);
    var t2 = ICMPV4.mkType(0);
    var t3 = ICMPV4.mkType(99);
    var t4 = ICMPV4.mkType(128);

    var type = ICMPV4.mkType(13);

    var everyType = new ICMPV4.mkTypeMatch(13, '0');
    var multiType = new ICMPV4.mkTypeMatch(13, '0x80');
    var exactType = new ICMPV4.mkTypeMatch(type, 0xff);

    expect(everyType.match(t1)).toBe(true);
    expect(everyType.match(t2)).toBe(true);
    expect(everyType.match(t3)).toBe(true);
    expect(everyType.match(t4)).toBe(true);

    expect(multiType.match(t1)).toBe(true);
    expect(multiType.match(t2)).toBe(true);
    expect(multiType.match(t3)).toBe(true);
    expect(multiType.match(t4)).toBe(false);

    expect(exactType.match(t1)).toBe(true);
    expect(exactType.match(t2)).toBe(false);
    expect(exactType.match(t3)).toBe(false);
    expect(exactType.match(t4)).toBe(false);
  });

  it('Code Match Pass', function() {
    expect(!!ICMPV4).toBe(true);

    var c1 = ICMPV4.mkCode(9);
    var c2 = ICMPV4.mkCode(0);
    var c3 = ICMPV4.mkCode(99);
    var c4 = ICMPV4.mkCode(128);

    var code = ICMPV4.mkCode(9);

    var everyCode = new ICMPV4.mkCodeMatch(9, '0');
    var multiCode = new ICMPV4.mkCodeMatch(9, '0xf0');
    var exactCode = new ICMPV4.mkCodeMatch(code, 0xff);

    expect(everyCode.match(c1)).toBe(true);
    expect(everyCode.match(c2)).toBe(true);
    expect(everyCode.match(c3)).toBe(true);
    expect(everyCode.match(c4)).toBe(true);

    expect(multiCode.match(c1)).toBe(true);
    expect(multiCode.match(c2)).toBe(true);
    expect(multiCode.match(c3)).toBe(false);
    expect(multiCode.match(c4)).toBe(false);

    expect(exactCode.match(c1)).toBe(true);
    expect(exactCode.match(c2)).toBe(false);
    expect(exactCode.match(c3)).toBe(false);
    expect(exactCode.match(c4)).toBe(false);
  });

  it('Type Match equal Pass', function() {
    expect(!!ICMPV4).toBe(true);

    var everyType = new ICMPV4.mkTypeMatch(13, '0x00');
    var multiType = new ICMPV4.mkTypeMatch(13, '0x80');
    var exactType = new ICMPV4.mkTypeMatch(13, '0xff');
    expect(everyType.equal(multiType)).toBe(false);
    expect(everyType.equal(exactType)).toBe(false);

    var t1 = new ICMPV4.mkTypeMatch(13, '0');
    expect(everyType.equal(t1)).toBe(true);

    var t2 = new ICMPV4.mkTypeMatch(13, '0xff');
    expect(exactType.equal(t2)).toBe(true);
    expect(multiType.equal(t2)).toBe(false);

    var t3 = new ICMPV4.mkTypeMatch(0, '0xff');
    expect(exactType.equal(t3)).toBe(false);
    expect(multiType.equal(t3)).toBe(false);
  });

  it('Summarize Tests', function () {
    expect(!!ICMPV4).toBe(true);

    var match = ICMPV4.mkTypeMatch('255', '0xff');
    expect(match.summarize()).toBe('icmpv4');

    var match = ICMPV4.mkCodeMatch('255', '0xff');
    expect(match.summarize()).toBe('icmpv4');
  });

  it ('JSON stringify', function() {
    expect(!!ICMPV4).toBe(true);

    var icmp1 = ICMPV4.mkICMPV4(124, 255);
    var icmp1_json = JSON.stringify(icmp1);
    var icmp1_ = new ICMPV4.ICMPV4(JSON.parse(icmp1_json));

    expect(icmp1_.toString()).toBe(icmp1.toString());

    var icmp2 = ICMPV4.mkICMPV4(124, 254);
    var icmp2_json = JSON.stringify(icmp2);
    var icmp2_ = new ICMPV4.ICMPV4(JSON.parse(icmp2_json));

    expect(icmp2_.toString()).toBe(icmp2.toString());
    expect(icmp1_.toString()).not.toBe(icmp2_.toString());
  });

});
