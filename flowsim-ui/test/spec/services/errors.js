'use strict';

describe('Service: errors', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var errors;
  beforeEach(inject(function (_Errors_) {
    errors = _Errors_;
  }));

  it('should do something', function () {
    expect(!!errors).toBe(true);
  });

});
