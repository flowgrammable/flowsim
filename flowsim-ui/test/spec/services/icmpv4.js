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
    ICMPV4.mkICMPV4(null, 0, 0, 9);

    var ts_req1 = ICMPV4.mkICMPV4(13, 2, 20);
    var ts_req2 = new ICMPV4.ICMPV4(ts_req1);
    var ts_req3 = new ICMPV4.ICMPV4(null, 13, 2, 20);
    var ts_req4 = ts_req1.clone();

    var testStr = ts_req1.toString();
    expect(ts_req2.toString()).toBe(testStr);
    expect(ts_req3.toString()).toBe(testStr);
    expect(ts_req4.toString()).toBe(testStr);
  });

  it('Construction Fail', function () {
    expect(!!ICMPV4).toBe(true);

    expect(function(){ICMPV4.mkICMPV4(0, 69422, 25);}).toThrow();
    expect(function(){ICMPV4.mkICMPV4('66422', 234, 100);}).toThrow();
  });

  it('Set Field Pass', function () {
    expect(!!ICMPV4).toBe(true);

    var icmp1 = ICMPV4.mkICMPV4(124, 255, 74);

    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    expect(icmp1.icmp_bytes().toString()).toBe('74');
    icmp1.type(45);
    expect(icmp1.type().toString()).toBe('45');
    expect(icmp1.code().toString()).toBe('255');
    expect(icmp1.icmp_bytes().toString()).toBe('74');
    icmp1.code('78');
    expect(icmp1.type().toString()).toBe('45');
    expect(icmp1.code().toString()).toBe('78');
    expect(icmp1.icmp_bytes().toString()).toBe('74');
    icmp1.icmp_bytes('140');
    expect(icmp1.type().toString()).toBe('45');
    expect(icmp1.code().toString()).toBe('78');
    expect(icmp1.icmp_bytes().toString()).toBe('140');
  });

  it('Set Field Fail', function () {
    expect(!!ICMPV4).toBe(true);

    expect(function(){ICMPV4.mkICMPV4(124, 256, 74);}).toThrow();
    expect(function(){ICMPV4.mkICMPV4(124, 255, 65536);}).toThrow();
    expect(function(){ICMPV4.mkICMPV4(256, 255, 0);}).toThrow();

    var icmp1 = ICMPV4.mkICMPV4(124, 255, 74);

    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    expect(icmp1.icmp_bytes().toString()).toBe('74');
    expect(function(){icmp1.type(256);}).toThrow();
    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    expect(icmp1.icmp_bytes().toString()).toBe('74');
    expect(function(){icmp1.code(1000);}).toThrow();
    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    expect(icmp1.icmp_bytes().toString()).toBe('74');
    expect(function(){icmp1.src(2484);}).toThrow();
    expect(icmp1.type().toString()).toBe('124');
    expect(icmp1.code().toString()).toBe('255');
    expect(icmp1.icmp_bytes().toString()).toBe('74');
  });

});
