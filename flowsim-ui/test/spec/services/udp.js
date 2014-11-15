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

    expect(function(){UDP.mkPort(69422);}).toThrow();
    expect(function(){UDP.mkPort('66422');}).toThrow();
  });

  it('Construction Pass', function () {
    expect(!!UDP).toBe(true);

    UDP.mkUDP(null, 0, 0);

    var src = UDP.mkPort(12345);
    var dst = UDP.mkPort('54689');
    var udp1 = UDP.mkUDP(src, dst);
    var udp2 = new UDP.UDP(udp1);
    var udp3 = new UDP.UDP(null, src, dst);
    var udp4 = new UDP.UDP(null, 12345, '54689');
    var udp5 = udp1.clone();

    var testStr = udp1.toString();
    expect(udp2.toString()).toBe(testStr);
    expect(udp3.toString()).toBe(testStr);
    expect(udp4.toString()).toBe(testStr);
    expect(udp5.toString()).toBe(testStr);
  });

  it('Construction Fail', function () {
    expect(!!UDP).toBe(true);

    expect(function(){UDP.mkUDP(0, 69422);}).toThrow();
    expect(function(){UDP.mkUDP('66422', 234);}).toThrow();
  });

  it('Set Field Pass', function () {
    expect(!!UDP).toBe(true);

    var src = UDP.mkPort(12345);
    var dst = UDP.mkPort('54689');
    var udp1 = UDP.mkUDP(src, dst);

    expect(udp1.src().toString()).toBe('12345');
    expect(udp1.dst().toString()).toBe('54689');
    udp1.src(5000);
    expect(udp1.src().toString()).toBe('5000');
    expect(udp1.dst().toString()).toBe('54689');
    udp1.dst('0xFFFF');
    expect(udp1.src().toString()).toBe('5000');
    expect(udp1.dst().toString()).toBe('65535');
  });

  it('Set Field Fail', function () {
    expect(!!UDP).toBe(true);

    var src = UDP.mkPort(12345);
    var dst = UDP.mkPort('54689');
    var udp1 = UDP.mkUDP(src, dst);

    expect(udp1.src().toString()).toBe('12345');
    expect(udp1.dst().toString()).toBe('54689');
    expect(function(){udp1.src(70000);}).toThrow();
    expect(udp1.src().toString()).toBe('12345');
    expect(udp1.dst().toString()).toBe('54689');
    expect(function(){udp1.dst('0x10000');}).toThrow();
    expect(udp1.src().toString()).toBe('12345');
    expect(udp1.dst().toString()).toBe('54689');
    expect(function(){udp1.dst(-1);}).toThrow();
    expect(udp1.src().toString()).toBe('12345');
    expect(udp1.dst().toString()).toBe('54689');

    //expect(udp1.dst().toString(16)).toBe('0xd5a1');
    // not sure  why this is outputting '0x0xd4a1'
  });

  it('Port Match Pass', function() {
    expect(!!UDP).toBe(true);

    var src = UDP.mkPort(12345);
    var dst = UDP.mkPort('54689');
    var zero = UDP.mkPort(0);
    var ssh = UDP.mkPort(22);

    var every = new UDP.mkPortMatch(2, '0');
    var multi = new UDP.mkPortMatch(14, '0xff00');
    var exact = new UDP.mkPortMatch(src, 0xffff);

    expect(every.match(src)).toBe(true);
    expect(every.match(dst)).toBe(true);
    expect(every.match(zero)).toBe(true);
    expect(every.match(ssh)).toBe(true);

    expect(multi.match(src)).toBe(false);
    expect(multi.match(dst)).toBe(false);
    expect(multi.match(zero)).toBe(true);
    expect(multi.match(ssh)).toBe(true);

    expect(exact.match(src)).toBe(true);
    expect(exact.match(dst)).toBe(false);
    expect(exact.match(zero)).toBe(false);
    expect(exact.match(ssh)).toBe(false);
  });

  it('UDP Match equal Pass', function() {
    expect(!!UDP).toBe(true);

    var every = UDP.mkPortMatch(2, '0');
    var multi = UDP.mkPortMatch(14, '0xff00');
    expect(every.equal(multi)).toBe(false);

    var multi2 = UDP.mkPortMatch(14, 0xff00);
    expect(multi.equal(multi2)).toBe(true);

    var multi3 = UDP.mkPortMatch(14, 0xffff);
    expect(multi.equal(multi3)).toBe(false);
  });

  it ('JSON stringify', function() {
    expect(!!UDP).toBe(true);

    var udp1 = UDP.mkUDP(65535, '123');
    var udp1_json = JSON.stringify(udp1);
    var udp1_ = new UDP.UDP(JSON.parse(udp1_json));

    expect(udp1_.toString()).toBe(udp1.toString());
  });

});
