'use strict';

describe('Service: ARP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ARP;
  beforeEach(inject(function (_ARP_) {
    ARP = _ARP_;
  }));

  var ETHERNET;
  beforeEach(inject(function (_Ethernet_) {
    ETHERNET = _Ethernet_;
  }));

  it('should do something', function () {
    expect(!!ARP).toBe(true);
  });

});
