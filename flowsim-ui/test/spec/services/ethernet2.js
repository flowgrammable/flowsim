'use strict';

describe('Service: Ethernet2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Ethernet2;
  beforeEach(inject(function (_Ethernet2_) {
    Ethernet2 = _Ethernet2_;
  }));

  it('should do something', function () {
    expect(!!Ethernet2).toBe(true);
  });

});
