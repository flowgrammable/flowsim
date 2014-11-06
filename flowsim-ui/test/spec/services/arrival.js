'use strict';

describe('Service: arrival', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var arrival;
  beforeEach(inject(function (_arrival_) {
    arrival = _arrival_;
  }));

  it('should do something', function () {
    expect(!!arrival).toBe(true);
  });

});
