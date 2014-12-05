'use strict';

describe('Service: arp2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var arp2;
  beforeEach(inject(function (_arp2_) {
    arp2 = _arp2_;
  }));

  it('should do something', function () {
    expect(!!arp2).toBe(true);
  });

});
