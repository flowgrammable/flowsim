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

  it('MPLS TC match pass', function() {
    var a = MPLS.mkTc('0x00');
    var b = MPLS.mkTc('0xf0');
    var c = MPLS.mkTc('0xff')

    var every = MPLS.mkTcMatch('0x00', '0x00');
    var multi = MPLS.mkTcMatch('0x10', '0x10');
    var exact = MPLS.mkTcMatch('0xf0', '0xff');

    expect(every.match(a)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(c)).toBe(true);

    expect(multi.match(a)).toBe(false);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(c)).toBe(true);

    expect(exact.match(b)).toBe(true);
    expect(exact.match(a)).toBe(false);
    expect(exact.match(c)).toBe(false);
  });

  it('MPLS json construct', function(){
    var c = MPLS.mkMPLS('0xabcdef', '0xaa', '0x1', '0xff');

    var j = JSON.stringify(c);
    var j_ = new MPLS.MPLS(JSON.parse(j));

    expect(j_.label().toString(16)).toBe('0xabcdef');
    expect(j_.tc().toString(16)).toBe('0xaa');
    expect(j_.bos().toString(16)).toBe('0x01');
    expect(j_.ttl().toString(16)).toBe('0xff');

    j_.label('0xbbbbbb');
    j_.tc('0x33');
    j_.bos('0x0');
    j_.ttl('0x01');

    expect(j_.label().toString(16)).toBe('0xbbbbbb');
    expect(j_.tc().toString(16)).toBe('0x33');
    expect(j_.bos().toString(16)).toBe('0x00');
    expect(j_.ttl().toString(16)).toBe('0x01');
  })
});
