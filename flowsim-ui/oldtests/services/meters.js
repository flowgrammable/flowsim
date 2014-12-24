'use strict';

describe('Service: meters', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var meters;
  beforeEach(inject(function (_Meters_) {
    meters = _Meters_;
  }));

  it('should do something', function () {
    expect(!!meters).toBe(true);
  });

});
