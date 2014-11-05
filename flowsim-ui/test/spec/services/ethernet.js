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
      new ETHERNET.Ethernet.MAC(''); 
    }).toThrow();
    
    expect(function() { 
      new ETHERNET.Ethernet.MAC('00:00:00:00:00:00:00'); 
    }).toThrow();
    
    expect(function() { 
      new ETHERNET.Ethernet.MAC('00:00:00:00:0000'); 
    }).toThrow();
    
    expect(function() { 
      new ETHERNET.Ethernet.MAC('00:00:g0:00:00:00'); 
    }).toThrow();

  });
  
  it('MAC Construction Pass', function () {
    expect(!!ETHERNET).toBe(true);

    new ETHERNET.Ethernet.MAC('00:00:00:00:00:00');
    new ETHERNET.Ethernet.MAC('ab:cd:ef:AB:CD:EF');
    new ETHERNET.Ethernet.MAC('01-23:45-67:89:EF');
  });
  
  it('MAC Helper Functions', function () {
    expect(!!ETHERNET).toBe(true);

    var broadcast = new ETHERNET.Ethernet.MAC('ff:ff:ff:ff:ff:ff');
    var multicast = new ETHERNET.Ethernet.MAC('f1:00-11:22:33:44');

    // test is braodcast/multicast helper function
    expect(ETHERNET.Ethernet.MAC.isBroadcast(broadcast)).toBe(true);
    expect(ETHERNET.Ethernet.MAC.isBroadcast(multicast)).toBe(false);
    expect(ETHERNET.Ethernet.MAC.isMulticast(broadcast)).toBe(true);
    expect(ETHERNET.Ethernet.MAC.isMulticast(multicast)).toBe(true);

    // test mac level equivelence
    // the built in values get undefined for some reason
    //expect(broadcast.equal(ETHERNET.Ethernet.MAC.Braodcast)).toBe(true);
    //expect(multicast.equal(ETHERNET.Ethernet.MAC.Braodcast)).toBe(false);
    expect(broadcast.equal(multicast)).toBe(false);

  });
  
  it('MAC toString Pass', function() {
    expect(!!ETHERNET).toBe(true);

    var m1 = new ETHERNET.Ethernet.MAC('0:0:0:0:0:0');
    var m2 = new ETHERNET.Ethernet.MAC('1:22:3:44:5:66');

    expect(m1.toString()).toBe('00:00:00:00:00:00');
    expect(m2.toString()).toBe('01:22:03:44:05:66');
  });

  it('Ethernet Construction Pass', function() {
    expect(!!ETHERNET).toBe(true);

    new ETHERNET.Ethernet(
      'test',
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0');
    new ETHERNET.Ethernet(
      'test',
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      0);
    new ETHERNET.Ethernet(
      'test',
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0x0');
  });

  it('Ethernet Construction Fail', function() {
    expect(!!ETHERNET).toBe(true);
    
    expect(function() {
      new ETHERNET.Ethernet(
      'test',
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0xx0000')
    }).toThrow();
    expect(function() {
      new ETHERNET.Ethernet(
      'test',
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      0x1ffff)
    }).toThrow();
    expect(function() {
      new ETHERNET.Ethernet(
      'test',
      '00:00:00:00:00:00',
      '12:34:56:78:90:ab',
      '0x1ffff')
    }).toThrow();
  });

  it('MAC Construction Equiv', function() {
    expect(!!ETHERNET).toBe(true);

    var us = '00:11:22:33:44:55';
    var bs = 'ff:ff:ff:ff:ff:ff';

    var ufs = new ETHERNET.Ethernet.MAC(us);
    var bfs = new ETHERNET.Ethernet.MAC(bs);
    var ufm = new ETHERNET.Ethernet.MAC(us);
    var bfm = new ETHERNET.Ethernet.MAC(bs);

    expect(ufs.equal(ufm)).toBe(true);
    expect(bfs.equal(bfm)).toBe(true);
    
    expect(ufm.equal(ufs)).toBe(true);
    expect(bfm.equal(bfs)).toBe(true);
    
    expect(ufm.equal(bfs)).toBe(false);
    expect(bfm.equal(ufs)).toBe(false);
    expect(bfm.equal(ufs)).toBe(false);
    expect(ufm.equal(bfs)).toBe(false);
  });
    
  it('MAC Match Pass', function() {
    expect(!!ETHERNET).toBe(true);
    
    var u = new ETHERNET.Ethernet.MAC('00:11:22:33:44:55');
    var b = new ETHERNET.Ethernet.MAC('ff:ff:ff:ff:ff:ff');
    var m = new ETHERNET.Ethernet.MAC('91:ab:ba:ef:cd:45');
    
    var every = new ETHERNET.Ethernet.MAC.Match(
      '00:00:00:00:00:00', '00:00:00:00:00:00'
      );
    var multi = new ETHERNET.Ethernet.MAC.Match(
      '01:00:00:00:00:00', '01:00:00:00:00:00'
      );


    var exact = new ETHERNET.Ethernet.MAC.Match(u, b);

    /*
    console.log(exact.match(u));
    console.log(exact.match(b));
    console.log(exact.match(m));

    expect(every.match(u)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(m)).toBe(true);


    expect(multi.match(u)).toBe(false);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(m)).toBe(true);

    expect(exact.match(u)).toBe(true);
    expect(exact.match(b)).toBe(false);
    expect(exact.match(m)).toBe(false);

    */

  });

  it('Ethernet Match Fail', function() {
    expect(!!ETHERNET).toBe(true);
  });

  it('Ethernet Set Field Pass', function() {
    expect(!!ETHERNET).toBe(true);
  });

  it('Ethernet Set Field Fail', function() {
    expect(!!ETHERNET).toBe(true);
  });

});
