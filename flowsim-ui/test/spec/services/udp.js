'use strict';

describe('Service: UDP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var UDP;
  beforeEach(inject(function (_UDP_) {
    UDP = _UDP_;
  }));

  it('should do something', function () {
    expect(!!UDP).toBe(true);
  });

});
