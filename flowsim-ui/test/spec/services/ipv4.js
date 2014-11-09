'use strict';

describe('Service: IPV4', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var IPV4;
  beforeEach(inject(function (_IPV4_) {
    IPV4 = _IPV4_;
  }));

  it('should do something', function () {
    expect(!!IPV4).toBe(true);
  });

  it('IPv4.IP Construction Fail', function () {
    expect(!!IPV4).toBe(true);

    expect(function() {
      new IPV4.IPv4.IP('aaaa');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.IP('888.888.88.888');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.IP('6.6.6.6.6');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.IP('6.6');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.IP('');
    }).toThrow();

  });

  it('IPv4.IP Construction Success', function(){
    expect(!!IPV4).toBe(true);

    new IPV4.IP();
    new IPV4.IP('127.1.1.1');
    new IPV4.IP(new IPV4.IP());
  });

  it('IPv4.IP Match success', function() {
    var ipAddr = new IPV4.IP('127.0.0.1');
    var ipMask = new IPV4.IP('127.0.0.1');
    var ip2 = new IPV4.IP('127.0.0.1');


    var ipMatch = new IPV4.IP.Match(null, ipAddr, ipMask);
    console.log('ipMatch', ipMatch);

    expect(ipMatch.match(ip2)).toBe(true);
  });

});
