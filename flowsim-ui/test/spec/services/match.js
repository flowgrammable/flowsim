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

  it('IPv4 Match', function () {
    expect(!!Match).toBe(true);

    var match = new Match.Set();

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
  });

});
