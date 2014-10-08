'use strict';

describe('Service: IPV4', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var IPV4;
  beforeEach(inject(function (_IPV4_) {
    IPV4 = _IPV4_;
  }));

  it('should do something', function () {
    expect(!!IPV4).toBe(true);
  });

});
