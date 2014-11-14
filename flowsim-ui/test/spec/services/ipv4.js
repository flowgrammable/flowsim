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
    expect(addressValue).toBe(2164260863);

    var address1 = new IPV4.mkAddress('128.1.1.1');
    expect(address1._ip.value).toBe(2147549441);

    var address2 = new IPV4.mkAddress('255.255.255.255');
    expect(address2._ip.value).toBe(4294967295);
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

    var ip4 = new IPV4.mkAddress(null, '128.1.1.1');
    var ipMatch4 = new IPV4.Address.Match(null, '128.1.1.1', '255.255.255.255');

  });

  it('IPv4 Construction Pass', function() {
    IPV4.mkIPv4();
    IPV4.mkIPv4('0x1', '0x1', '0x06', '0xaa', '128.0.0.1','127.0.0.1');
    new IPV4.IPv4();
    new IPV4.IPv4(null, '0xff', '0xff', '0xff', '0xaa', '255.255.255.255', '255.255.255.255');
  });

  it('IPv4 Construction Fail', function() {
    expect(function(){
      IPV4.mkIPv4('0x222');
    }).toThrow();

    expect(function(){
      IPV4.mkIPv4('0x22', '0x1', '0x06', 0xffffffff, 'g.g.g.g');
    }).toThrow();
  });

  it('equivalency', function() {
    var ip = IPV4.mkIPv4('0x11', '0x22', '0x33', '0xaa', '10.10.10.10',
      '25.25.25.25');

    var ip_json = JSON.stringify(ip);
    var ip_ = new IPV4.IPv4(JSON.parse(ip_json));

    expect(ip_.dscp().toString(16)).toBe('0x11');
    expect(ip_.ecn().toString(16)).toBe('0x22');
    expect(ip_.proto().toString(16)).toBe('0x33');
    expect(ip_.ttl().toString(16)).toBe('0xaa');
    expect(ip_.src().toString()).toBe('10.10.10.10');
    expect(ip_.dst().toString()).toBe('25.25.25.25');

    ip_.dscp('0x55');
    ip_.ecn('0x55');
    ip_.proto('0xff');
    ip_.ttl('0xbb');
    ip_.src('192.168.1.1');
    ip_.dst('255.255.255.255');

    expect(ip_.dscp().toString(16)).toBe('0x55');
    expect(ip_.ecn().toString(16)).toBe('0x55');
    expect(ip_.proto().toString(16)).toBe('0xff');
    expect(ip_.ttl().toString(16)).toBe('0xbb');
    expect(ip_.src().toString()).toBe('192.168.1.1');
    expect(ip_.dst().toString()).toBe('255.255.255.255');
  });

  it('IPv4 Dscp Matches', function(){
    var exact = IPV4.mkDscpMatch('0xed', '0xff');
    var multi = IPV4.mkDscpMatch('0xe0', '0xe0');
    var every = IPV4.mkDscpMatch('0x00', '0x00');

    var dscp = IPV4.mkDscp('0xed');
    var dscp2 = IPV4.mkDscp('0xe5');
    var dscp3 = IPV4.mkDscp('0xaa');

    expect(exact.match(dscp)).toBe(true);
    expect(exact.match(dscp2)).toBe(false);
    expect(exact.match(dscp3)).toBe(false);

    expect(multi.match(dscp)).toBe(true);
    expect(multi.match(dscp2)).toBe(true);
    expect(multi.match(dscp3)).toBe(false);

    expect(every.match(dscp)).toBe(true);
    expect(every.match(dscp2)).toBe(true);
    expect(every.match(dscp3)).toBe(true);
  });

  it('IPv4 Ecn Matches', function(){
    var exact = IPV4.mkEcnMatch('0xed', '0xff');
    var multi = IPV4.mkEcnMatch('0xe0', '0xe0');
    var every = IPV4.mkEcnMatch('0x00', '0x00');

    var ecn  = IPV4.mkEcn('0xed');
    var ecn2 = IPV4.mkEcn('0xe5');
    var ecn3 = IPV4.mkEcn('0xaa');

    expect(exact.match(ecn)).toBe(true);
    expect(exact.match(ecn2)).toBe(false);
    expect(exact.match(ecn3)).toBe(false);

    expect(multi.match(ecn)).toBe(true);
    expect(multi.match(ecn2)).toBe(true);
    expect(multi.match(ecn3)).toBe(false);

    expect(every.match(ecn)).toBe(true);
    expect(every.match(ecn2)).toBe(true);
    expect(every.match(ecn3)).toBe(true);
  });

  it('IPv4 Ecn Matches', function(){
    var exact = IPV4.mkProtoMatch('0xed', '0xff');
    var multi = IPV4.mkProtoMatch('0xe0', '0xe0');
    var every = IPV4.mkProtoMatch('0x00', '0x00');

    var proto  = IPV4.mkProto('0xed');
    var proto2 = IPV4.mkProto('0xe5');
    var proto3 = IPV4.mkProto('0xaa');

    expect(exact.match(proto)).toBe(true);
    expect(exact.match(proto2)).toBe(false);
    expect(exact.match(proto3)).toBe(false);

    expect(multi.match(proto)).toBe(true);
    expect(multi.match(proto2)).toBe(true);
    expect(multi.match(proto3)).toBe(false);

    expect(every.match(proto)).toBe(true);
    expect(every.match(proto2)).toBe(true);
    expect(every.match(proto3)).toBe(true);
  });

  it('IPv4 Dst Matches', function(){
    var exact = IPV4.mkDstMatch('192.168.1.1', '255.255.255.255');
    var multi = IPV4.mkDstMatch('192.5.5.5', '192.0.0.0');
    var every = IPV4.mkDstMatch('0.0.0.0', '0.0.0.0');

    var dst  = IPV4.mkDst('192.168.1.1');
    var dst2 = IPV4.mkDst('192.66.66.66');
    var dst3 = IPV4.mkDst('172.0.2.1');

    expect(exact.match(dst)).toBe(true);
    expect(exact.match(dst2)).toBe(false);
    expect(exact.match(dst3)).toBe(false);

    expect(multi.match(dst)).toBe(true);
    expect(multi.match(dst2)).toBe(true);
    expect(multi.match(dst3)).toBe(false);

    expect(every.match(dst)).toBe(true);
    expect(every.match(dst2)).toBe(true);
    expect(every.match(dst3)).toBe(true);
  });

  it('IPv4 Src Matches', function(){
    var exact = IPV4.mkSrcMatch('192.168.1.1', '255.255.255.255');
    var multi = IPV4.mkSrcMatch('192.5.5.5', '192.0.0.0');
    var every = IPV4.mkSrcMatch('0.0.0.0', '0.0.0.0');

    var src  = IPV4.mkSrc('192.168.1.1');
    var src2 = IPV4.mkSrc('192.66.66.66');
    var src3 = IPV4.mkSrc('172.0.2.1');

    expect(exact.match(src)).toBe(true);
    expect(exact.match(src2)).toBe(false);
    expect(exact.match(src3)).toBe(false);

    expect(multi.match(src)).toBe(true);
    expect(multi.match(src2)).toBe(true);
    expect(multi.match(src3)).toBe(false);

    expect(every.match(src)).toBe(true);
    expect(every.match(src2)).toBe(true);
    expect(every.match(src3)).toBe(true);
  });


});
