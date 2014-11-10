'use strict';

describe('Service: MPLS', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var MPLS;
  beforeEach(inject(function (_MPLS_) {
    MPLS = _MPLS_;
  }));

  it('should do something', function () {
    expect(!!MPLS).toBe(true);
  });

  it('Label construction Pass', function() {
    expect(!!MPLS).toBe(true);
    var label = MPLS.mkLabel();
    expect(label.toString(16)).toBe('0x000000');
  });

  it('Tc construction Pass', function() {
    expect(!!MPLS).toBe(true);
    var tc = MPLS.mkTc();
    expect(tc.toString(16)).toBe('0x00');
  });

  it('Bos construction Pass', function() {
    expect(!!MPLS).toBe(true);
    var bos = MPLS.mkBos();
    expect(bos.toString(16)).toBe('0x00');
  });

  it('Ttl construction Pass', function() {
    expect(!!MPLS).toBe(true);
    var ttl = MPLS.mkTtl();
    expect(ttl.toString(16)).toBe('0x00');
  });

  it('MPLS construction PASS', function() {
    new MPLS.mkMPLS();
    new MPLS.mkMPLS('0x012380','0x01','0x1', '0xaa');
  });

  it('MPLS construction fail', function() {
    expect(function(){
      new MPLS.mkMPLS('0xffffffff', '0xffff', '0xffffff', '0xffffffff');
    }).toThrow();
  });

  it('MPLS label match pass', function() {
    var a = MPLS.mkLabel('0x010000');
    var b = MPLS.mkLabel('0xffffff');
    var c = MPLS.mkLabel('0x911111');

    var every = MPLS.mkLabelMatch('0x000000', '0x000000');
    var multi = MPLS.mkLabelMatch('0x010000', '0x010000');
    var exact = MPLS.mkLabelMatch('0x010000', '0xffffff');

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

  it('MPLS bos match pass', function() {
    var a = MPLS.mkBos('0x0');
    var b = MPLS.mkBos('0x1');

    var every = MPLS.mkBosMatch('0x0', '0x0');
    var multi = MPLS.mkBosMatch('0x1', '0x1');
    var exact = MPLS.mkBosMatch('0x0', '0x1');

    expect(every.match(a)).toBe(true);
    expect(every.match(b)).toBe(true);

    expect(multi.match(a)).toBe(false);
    expect(multi.match(b)).toBe(true);

    expect(exact.match(a)).toBe(true);
    expect(exact.match(b)).toBe(false);
  });
});
