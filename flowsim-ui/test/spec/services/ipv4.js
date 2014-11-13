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
      new IPV4.IPv4.Address('aaaa');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.Address('888.888.88.888');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.Address('6.6.6.6.6');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.Address('6.6');
    }).toThrow();

    expect(function() {
      new IPV4.IPv4.Address('');
    }).toThrow();

  });

  it('IPv4.IP Construction Pass', function(){
    expect(!!IPV4).toBe(true);

    IPV4.mkAddress();

    new IPV4.Address();
    new IPV4.Address(null, '127.1.1.1');
    new IPV4.Address(new IPV4.Address());

    var addressValue = IPV4.dot2num('128.255.255.255');
    expect(addressValue).toBe(2164260863)

    var address1 = new IPV4.mkAddress('128.1.1.1');
    expect(address1._ip.value).toBe(2147549441);

    var address2 = new IPV4.mkAddress('255.255.255.255');
    expect(address2._ip.value).toBe(4294967295)
  });

  it('IPv4.IP Match Pass', function() {
    var ip1 = IPV4.mkAddress('10.0.0.0');
    var ip2 = IPV4.mkAddress('255.255.255.255');
    var ip3 = IPV4.mkAddress('10.0.0.1');

    var ipMatch = new IPV4.Address.Match(null, ip1, ip2);
    var ipMatch2 = new IPV4.Address.Match(null, '0.0.0.0', '0.0.0.0');
    var ipMatch3 = new IPV4.Address.Match(null, '1.0.0.0', '1.0.0.0');

    expect(ipMatch.match(ip1)).toBe(true);
    expect(ipMatch.match(ip3)).toBe(false);

    expect(ipMatch2.match(ip1)).toBe(true);
    expect(ipMatch2.match(ip2)).toBe(true);

    expect(ipMatch3.match(ip1)).toBe(false);
    expect(ipMatch3.match(ip2)).toBe(true);

  });

  it('IPv4 Construction Pass', function() {
    IPV4.mkIPv4();
    IPV4.mkIPv4('0x1', '0x1', '0x06', '128.0.0.1','127.0.0.1');
  });

  it('IPv4 Construction Fail', function() {
    expect(function(){
      IPV4.mkIPv4('0x222');
    }).toThrow();
  });


});
