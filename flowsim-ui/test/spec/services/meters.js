'use strict';

describe('Service: meters', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var meters;
  beforeEach(inject(function (_meters_) {
    meters = _meters_;
  }));

  it('should do something', function () {
    expect(!!meters).toBe(true);
  });

});
