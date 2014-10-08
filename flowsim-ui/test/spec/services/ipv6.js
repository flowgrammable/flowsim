'use strict';

describe('Service: IPV6', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var IPV6;
  beforeEach(inject(function (_IPV6_) {
    IPV6 = _IPV6_;
  }));

  it('should do something', function () {
    expect(!!IPV6).toBe(true);
  });

});
