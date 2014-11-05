'use strict';

describe('Service: backend', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var backend;
  beforeEach(inject(function (_Backend_) {
    backend = _Backend_;
  }));

  it('should do something', function () {
    expect(!!backend).toBe(true);
  });

});
