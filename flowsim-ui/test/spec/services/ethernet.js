'use strict';

describe('Service: ETHERNET', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ETHERNET;
  beforeEach(inject(function (_ETHERNET_) {
    ETHERNET = _ETHERNET_;
  }));

  it('MAC Construction Fail', function () {
    expect(!!ETHERNET).toBe(true);

    expect(function() {
      new ETHERNET.MAC(null, '');
    }).toThrow();
    
    expect(function() {
      ETHERNET.mkMAC('');
    }).toThrow();

    expect(function() {
      new ETHERNET.MAC(null, '00:00:00:00:00:00:00');
    }).toThrow();
    
    expect(function() {
      ETHERNET.mkMAC('00:00:00:00:00:00:00');
    }).toThrow();

    expect(function() {
      new ETHERNET.MAC(null, '00:00:00:00:0000');
    }).toThrow();
    
    expect(function() {
      ETHERNET.mkMAC('00:00:00:00:0000');
    }).toThrow();

    expect(function() {
      new ETHERNET.MAC(null, '00:00:g0:00:00:00');
    }).toThrow();
    
    expect(function() {
      ETHERNET.mkMAC('00:00:g0:00:00:00');
    }).toThrow();

  });

  it('MAC Construction Pass', function () {
    expect(!!ETHERNET).toBe(true);

    new ETHERNET.MAC(null, '00:00:00:00:00:00');
    new ETHERNET.MAC(null, 'ab:cd:ef:AB:CD:EF');
    new ETHERNET.MAC(null, '01-23:45-67:89:EF');
    
    ETHERNET.mkMAC('00:00:00:00:00:00');
    ETHERNET.mkMAC('ab:cd:ef:AB:CD:EF');
    ETHERNET.mkMAC('01-23:45-67:89:EF');
  });

  it('MAC Helper Functions', function () {
    expect(!!ETHERNET).toBe(true);

    var broadcast = new ETHERNET.MAC(null, 'ff:ff:ff:ff:ff:ff');
    var multicast = new ETHERNET.MAC(null, 'f1:00-11:22:33:44');

    // test is braodcast/multicast helper function
    expect(ETHERNET.MAC.isBroadcast(broadcast)).toBe(true);
    expect(ETHERNET.MAC.isBroadcast(multicast)).toBe(false);
    expect(ETHERNET.MAC.isMulticast(broadcast)).toBe(true);
    expect(ETHERNET.MAC.isMulticast(multicast)).toBe(true);

    // test mac level equivelence
    // the built in values get undefined for some reason
    //expect(broadcast.equal(MAC.Braodcast)).toBe(true);
    //expect(multicast.equal(MAC.Braodcast)).toBe(false);
    expect(ETHERNET.MAC.equal(multicast, broadcast)).toBe(false);

  });

  it('MAC toString Pass', function() {
    expect(!!ETHERNET).toBe(true);

    var m1 = new ETHERNET.MAC(null, '0:0:0:0:0:0');
    var m2 = new ETHERNET.MAC(null, '1:22:3:44:5:66');

    expect(m1.toString()).toBe('00:00:00:00:00:00');
    expect(m2.toString()).toBe('01:22:03:44:05:66');
  });

  it('Ethernet Construction Pass', function() {
    expect(!!ETHERNET).toBe(true);

    new ETHERNET.Ethernet(
       null,
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0');
    new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      0);
    new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0x0');
    new ETHERNET.Ethernet(
      null);
    new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab');
    new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00');
  });

  it('Ethernet Construction Fail', function() {
    expect(!!ETHERNET).toBe(true);

    expect(function() {
      new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0xx0000')
    }).toThrow();
    expect(function() {
      new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      0x1ffff)
    }).toThrow();
    expect(function() {
      new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0x1ffff')
    }).toThrow();
  });

  it('MAC Construction Equiv', function() {
    expect(!!ETHERNET).toBe(true);

    var us = '00:11:22:33:44:55';
    var bs = 'ff:ff:ff:ff:ff:ff';

    var ufs = new ETHERNET.MAC(null, us);
    var bfs = new ETHERNET.MAC(null, bs);
    var ufm = new ETHERNET.MAC(null, us);
    var bfm = new ETHERNET.MAC(null, bs);

    expect(ETHERNET.MAC.equal(ufs, ufm)).toBe(true);
    expect(ETHERNET.MAC.equal(bfs, bfm)).toBe(true);
  });

  it('MAC Match Multi', function() {
    expect(!!ETHERNET).toBe(true);

    var match1 = new ETHERNET.MAC.Match(
      null,
      '00:00:00:00:00:00',
      new ETHERNET.MAC(
        null,
        '00:00:00:00:00:00'
        )
      );

    var match2 = new ETHERNET.MAC.Match(
      null,
      new ETHERNET.MAC(null, '00:00:00:00:00:00'),
      '00:00:00:00:00:00'
      );

    var match3 = new ETHERNET.MAC.Match(
      null,
      '00:00:00:00:00:00', '00:00:00:00:00:00');

    var match4 = new ETHERNET.MAC.Match(
      null,
      new ETHERNET.MAC(null, '00:00:00:00:00:00'),
      new ETHERNET.MAC(null, '00:00:00:00:00:00')
    );

    expect(match1.match(ETHERNET.mkMAC('01:02:03:04:05:06'))).toBe(true);
    expect(match2.match(new ETHERNET.MAC(null, '01:02:03:04:05:06'))).toBe(true);
    expect(match3.match(new ETHERNET.MAC(null, '01:02:03:04:05:06'))).toBe(true);
    expect(match4.match(new ETHERNET.MAC(null, '01:02:03:04:05:06'))).toBe(true);
  });

  it('MAC Match Pass', function() {
    expect(!!ETHERNET).toBe(true);

    var u = new ETHERNET.MAC(null, '00:11:22:33:44:55');
    var b = new ETHERNET.MAC(null, 'ff:ff:ff:ff:ff:ff');
    var m = new ETHERNET.MAC(null, '91:ab:ba:ef:cd:45');

    var every = new ETHERNET.MAC.Match(
      null,
      '00:00:00:00:00:00', '00:00:00:00:00:00'
      );
    var multi = new ETHERNET.MAC.Match(
      null,
      '01:00:00:00:00:00', '01:00:00:00:00:00'
      );

    var exact = new ETHERNET.MAC.Match(null, u, b);

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

  it('Ethernet Set Field Pass', function() {
    expect(!!ETHERNET).toBe(true);

    var dhcp_disco = new ETHERNET.Ethernet(
      null,
      '00:00:00:00:00:00',
      'ff:ff:ff:ff:ff:ff',
      '0x0806'
      );
    
    var dhcp2 = JSON.stringify(dhcp_disco);
    var dhcp2_ = new ETHERNET.Ethernet(JSON.parse(dhcp2));

    dhcp_disco.dst('00:11:22:33:44:55');
    expect(dhcp_disco.dst().toString()).toBe('00:11:22:33:44:55');

    dhcp_disco.src('10:11:22:33:44:55');
    expect(dhcp_disco.src().toString()).toBe('10:11:22:33:44:55');

    dhcp_disco.type('0x800');
    expect(dhcp_disco.type().toString(16)).toBe('0x0800');

    dhcp2_.dst('00:11:22:33:44:55');
    expect(dhcp2_.dst().toString()).toBe('00:11:22:33:44:55');

    dhcp2_.src('10:11:22:33:44:55');
    expect(dhcp2_.src().toString()).toBe('10:11:22:33:44:55');

    dhcp2_.type('0x800');
    expect(dhcp2_.type().toString(16)).toBe('0x0800');

  });

  it('Ethernet Set Field Fail', function() {
    expect(!!ETHERNET).toBe(true);
  });

});
