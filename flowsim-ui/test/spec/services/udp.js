'use strict';

describe('Service: UDP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var UDP;
  beforeEach(inject(function (_UDP_) {
    UDP = _UDP_;
  }));

  it('mkPort Pass', function () {
    expect(!!UDP).toBe(true);

    UDP.mkPort(0);
    var src = UDP.mkPort(54689);
    var dst = UDP.mkPort('54689');
    expect(src.toString()).toBe(dst.toString());
  });

  it('mkPort Fail', function () {
    expect(!!UDP).toBe(true);

    expect(function(){UDP.mkPort(69422)}).toThrow();
    expect(function(){UDP.mkPort('66422')}).toThrow();
  });

  it('Construction Pass', function () {
    expect(!!UDP).toBe(true);

    UDP.mkUDP(null, 0, 0);

    var src = UDP.mkPort(12345);
    var dst = UDP.mkPort('54689');
    var udp1 = UDP.mkUDP(src, dst);
    var udp2 = UDP.UDP(udp1);
    var udp3 = UDP.UDP(null, src, dst);
    var udp3 = UDP.UDP(null, 12345, '54689');
    var udp4 = udp1.clone();

    var testStr = udp1.toString();
    expect(udp2.toString()).toBe(testStr);
    expect(udp3.toString()).toBe(testStr);
    expect(udp4.toString()).toBe(testStr);
  });

  it('Construction Fail', function () {
    expect(!!UDP).toBe(true);

    expect(function(){UDP.mkUDP(0, 69422)}).toThrow();
    expect(function(){UDP.mkUDP('66422', 234)}).toThrow();
  });


});
