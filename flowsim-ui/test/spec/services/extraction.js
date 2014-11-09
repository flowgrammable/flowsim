'use strict';

describe('Service: extraction', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate services
  var extraction;
  beforeEach(inject(function (_Extraction_) {
    extraction = _Extraction_;
  }));
  var ETHERNET;
  beforeEach(inject(function (_ETHERNET_) {
    ETHERNET = _ETHERNET_;
  }));

  it('extraction Ethernet Pass', function () {
    expect(!!extraction).toBe(true);
    expect(!!ETHERNET).toBe(true);

    // create protocols to match on
    var eth1 = new ETHERNET.Ethernet(
      'eth1',
      'de:ad:be:ef:00:01',
      '12:34:56:78:90:ab',
      '0x8100');

    // create key to extract into
    var key1 = new extraction.Key(null);

    // extract ethernet
    extraction.extract_ethernet(eth1, key1);
    expect(key1.eth_src.toString()).toBe('de:ad:be:ef:00:01');
    expect(key1.eth_dst.toString()).toBe('12:34:56:78:90:ab');
    expect(key1.eth_type.value).toBe(0x8100);
  });

});
