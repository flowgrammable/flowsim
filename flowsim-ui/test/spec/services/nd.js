'use strict';

describe('Service: nd', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ND;
  beforeEach(inject(function (_ND_) {
    ND = _ND_;
  }));

  var IPV6;
  beforeEach(inject(function (_IPV6_) {
    IPV6 = _IPV6_;
  }));

  var ETHERNET;
  beforeEach(inject(function (_ETHERNET_) {
    ETHERNET = _ETHERNET_;
  }));

  it('ND constructor PASS', function () {
    var nd = new ND.ND();
    ND.mkND();
    var nd1 = ND.mkND(IPV6.mkAddress(), ETHERNET.mkMAC());

    var nd2 = ND.mkND(IPV6.mkAddress('1::1'),
        ETHERNET.mkMAC('aa:bb:cc:dd:ee:ff'));

    expect(nd2.hw().toString()).toBe('aa:bb:cc:dd:ee:ff');
    expect(nd2.target().toString()).toBe('1:0:0:0:0:0:0:1');

  });

  it('ND constructor FAIL', function () {
    expect(function(){
      ND.mkND('aa:bb:cc:dd:ee:ff', 100)
    }).toThrow();
  });

  it('ND JSON', function() {
    var c = ND.mkND('1::1', 'aa:bb:cc:dd:ee:ff');

    var j = JSON.stringify(c);
    var j_ = new ND.ND(JSON.parse(j));

    expect(j_.target().toString()).toBe('1:0:0:0:0:0:0:1');
    expect(j_.hw().toString()).toBe('aa:bb:cc:dd:ee:ff');

    j_.target('b::b');
    j_.hw('11:22:33:44:55:66');

    expect(j_.target().toString()).toBe('b:0:0:0:0:0:0:b');
    expect(j_.hw().toString()).toBe('11:22:33:44:55:66');
  });

  it('ND Target MAtch multi Pass', function(){
    var match1 = ND.mkTargetMatch(
      '0001::0000',
      '0001::0000');

    expect(match1.match(IPV6.mkAddress('0000::1111'))).toBe(false);
    expect(match1.match(IPV6.mkAddress('ffff::ffff'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('FE91:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);
  });

  it('ND Target Match Exact', function(){
    var match1 = ND.mkTargetMatch(
      '2001:0db8:0000:0000:0000:ff00:0042:8329',
      'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');

    var match2 = ND.mkTargetMatch(
      'FE80::0202:B3FF:FE1E:8329', 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');

    expect(match1.match(IPV6.mkAddress('2001:0db8:0000:0000:0000:ff00:0042:8329'))).toBe(true);
    expect(match2.match(IPV6.mkAddress('FE80::0202:B3FF:FE1E:8329'))).toBe(true);
    expect(match2.match(IPV6.mkAddress('FE80:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);

    expect(match1.match(IPV6.mkAddress('aaaa::bbbb'))).toBe(false);
    expect(match2.match(IPV6.mkAddress('EE80::0202:B3FF:FE1E:8329'))).toBe(false);
  });

  it('ND Target Match Every', function(){
    var match1 = ND.mkTargetMatch(
      '0000::0000',
      '0000::0000');

    expect(match1.match(IPV6.mkAddress('2001:0db8:0000:0000:0000:ff00:0042:8329'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('FE80::0202:B3FF:FE1E:8329'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('FE80:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);

    expect(match1.match(IPV6.mkAddress('aaaa::bbbb'))).toBe(true);
    expect(match1.match(IPV6.mkAddress('EE80:0000:0000:0000:0202:B3FF:FE1E:8329'))).toBe(true);
  });

});
