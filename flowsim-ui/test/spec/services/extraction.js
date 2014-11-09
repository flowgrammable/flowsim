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
  
  var Context;
  beforeEach(inject(function (_Context_) {
    Context = _Context_;
  }));

  it('extraction Ethernet Pass', function () {
    expect(!!extraction).toBe(true);
    expect(!!ETHERNET).toBe(true);
    expect(!!Context).toBe(true);

    // create protocols to match on
    
    var eth = ETHERNET.mkEthernet( 
      'de:ad:be:ef:00:01',
      '12:34:56:78:90:ab',
      '0x8100');

    // create key to extract into
    var key = new Context.Key(null, 0);

    expect(key.eth_src).toBe(undefined);
    expect(key.eth_dst).toBe(undefined);
    expect(key.eth_type).toBe(undefined);

    extraction.extract_ethernet(eth, key);
    
    expect(key.eth_src).toBe(eth.src());
    expect(key.eth_dst).toBe(eth.dst());
    expect(key.eth_type).toBe(eth.type());
  });

});
