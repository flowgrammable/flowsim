'use strict';

describe('Service: ipv42', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ipv42;
  beforeEach(inject(function (_ipv42_) {
    ipv42 = _ipv42_;
  }));

  it('should do something', function () {
    expect(!!ipv42).toBe(true);
  });

});
