'use strict';

describe('Service: IPV6', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var IPV6;
  beforeEach(inject(function (_IPV6_) {
    IPV6 = _IPV6_;
  }));

  it('IPv6 Address construction PASS', function () {
    expect(!!IPV6).toBe(true);
    var x = IPV6.mkAddress('2001:0db8:0000:0000:0000:ff00:0042:8329');
    IPV6.mkAddress();
    new IPV6.Address(null, '2001:db8:0:0:0:ff00:42:8329');
    new IPV6.Address(null, '2001:db8::ff00:42:8329');
  });

  it('IPv6 Address construction FAIL', function() {
    expect(function(){
      IPV6.mkAddress('192.168.1.1');
    }).toThrow();

    expect(function(){
      new IPV6.Address(null, '::::::::');
    }).toThrow();
  });

  it('IPv6 Addres Match Multi', function(){
    var match1 = new IPV6.Address.Match(null,
      '0001::0000',
      '0001::0000');

    expect(match1.match(IPV6.mkAddress('0000::1111'))).toBe(false);
    expect(match1.match(IPV6.mkAddress('ffff::ffff'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('FE91:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);
  });

  it('IPv6 Address Match Exact', function(){
    var match1 = new IPV6.Address.Match(null,
      '2001:0db8:0000:0000:0000:ff00:0042:8329',
      'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');

    var match2 = new IPV6.Address.Match(null,
      'FE80::0202:B3FF:FE1E:8329', 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');

    expect(match1.match(IPV6.mkAddress('2001:0db8:0000:0000:0000:ff00:0042:8329'))).toBe(true);
    expect(match2.match(IPV6.mkAddress('FE80::0202:B3FF:FE1E:8329'))).toBe(true);
    expect(match2.match(IPV6.mkAddress('FE80:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);

    expect(match1.match(IPV6.mkAddress('aaaa::bbbb'))).toBe(false);
    expect(match2.match(IPV6.mkAddress('EE80::0202:B3FF:FE1E:8329'))).toBe(false);
  });

  it('IPv6 Address Match Every', function(){
    var match1 = new IPV6.Address.Match(null,
      '0000::0000',
      '0000::0000');

    expect(match1.match(IPV6.mkAddress('2001:0db8:0000:0000:0000:ff00:0042:8329'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('FE80::0202:B3FF:FE1E:8329'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('FE80:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);

    expect(match1.match(IPV6.mkAddress('aaaa::bbbb'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('EE80:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);
  });

  it('IPV6 flabel match', function(){
    var u = new IPV6.mkFlabel('0x000203');
    var b = new IPV6.mkFlabel('0xffffff');
    var m = new IPV6.mkFlabel('0x912222');

    var every = IPV6.mkFlabelMatch('0x000000', '0x000000');
    var multi = IPV6.mkFlabelMatch('0x010000', '0x010000');
    var exact = IPV6.mkFlabelMatch('0x000203', '0x0fffff');

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

  it('IPv6 construct', function(){
    var c = IPV6.mkIPv6('0xaaaaaa', '0x77',
    '2001:0db8:0000:0000:0000:ff00:0042:8329',
    'FE80:0000:0000:0000:0202:B3FF:FE1E:8329');

    var j = JSON.stringify(c);
    var j_ = new IPV6.IPv6(JSON.parse(j));

    expect(j_.flabel().toString(16)).toBe('0xaaaaaa');
    expect(j_.ttl().toString(16)).toBe('0x77');
    expect(j_.src().toString()).toBe('2001:db8:0:0:0:ff00:42:8329');
    expect(j_.dst().toString()).toBe('fe80:0:0:0:202:b3ff:fe1e:8329');

    j_.flabel('0xbbbbbb');
    j_.ttl('0x33');
    j_.src('FEBE:0db8:0:0:0:ff00:0042:8329');
    j_.dst('2001:0:0:0:202:B3FF:FE1E:8329');

    expect(j_.flabel().toString(16)).toBe('0xbbbbbb');
    expect(j_.ttl().toString(16)).toBe('0x33');
    expect(j_.src().toString()).toBe('febe:db8:0:0:0:ff00:42:8329');
    expect(j_.dst().toString()).toBe('2001:0:0:0:202:b3ff:fe1e:8329');
  });


});
