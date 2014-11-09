'use strict';

describe('Service: match', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Match;
  beforeEach(inject(function (_Match_) {
    Match = _Match_;
  }));
  
  var UInt;
  beforeEach(inject(function (_UInt_) {
    UInt = _UInt_;
  }));

  var ETHERNET;
  beforeEach(inject(function (_ETHERNET_) {
    ETHERNET = _ETHERNET_;
  }));

  var Context;
  beforeEach(inject(function(_Context_) {
    Context = _Context_;
  }));

  it('Default Match', function() {
    var key = new Context.Key(null, 0);
    var match = new Match.Set();
    expect(match.match(key)).toBe(true);
  });

  it('IPv4 Match', function () {
    expect(!!Match).toBe(true);

    var match = new Match.Set();

    var key = new Context.Key(null, 0);

    match.push(
      new Match.Match(null,
        'eth_src',
        new ETHERNET.MAC.Match(
          null,
          '00:00:00:00:00:00',
          '00:00:00:00:00:00')));

    match.push(
      new Match.Match(null,
        'eth_dst',
        ETHERNET.mkMACMatch(
          'ff:ff:ff:ff:ff:ff',
          'ff:ff:ff:ff:ff:ff')));
    
    match.push(
      new Match.Match(null,
        'eth_type',
        ETHERNET.mkTypeMatch('0x0800', '0xffff')));

    expect(match.match(key)).toBe(false);

    key.eth_src = new ETHERNET.mkMAC('00:00:00:00:00:00');
    key.eth_dst = new ETHERNET.mkMAC('ff:ff:ff:ff:ff:ff');
    key.eth_type = new ETHERNET.mkType(0x0800);

    expect(match.match(key)).toBe(true);
    
    key.eth_src = new ETHERNET.mkMAC('00:00:00:00:00:01');
    expect(match.match(key)).toBe(true);

    key.eth_type = new ETHERNET.mkType('0x0806');
    expect(match.match(key)).toBe(false);
    
  });

});
