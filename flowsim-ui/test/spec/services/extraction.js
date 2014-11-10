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

  var VLAN;
  beforeEach(inject(function (_VLAN_) {
    VLAN = _VLAN_;
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

  it('extraction VLAN Pass', function () {
    expect(!!extraction).toBe(true);
    expect(!!VLAN).toBe(true);
    expect(!!Context).toBe(true);

    // create protocols to match on

    var vlan = VLAN.mkVLAN(
      '0x01',
      '0x02',
      '0x7777',
      '0x8100');

    // create key to extract into
    var key = new Context.Key(null, 0);

    expect(key.vlan_vid).toBe(undefined);
    expect(key.vlan_pcp).toBe(undefined);

    extraction.extract_vlan(vlan, key);

    expect(key.vlan[0].vid).toBe(vlan.vid());
    expect(key.vlan[0].pcp).toBe(vlan.pcp());
  });

});
