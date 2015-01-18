'use strict';

describe('Service: errors', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var errors;
  beforeEach(inject(function (_errors_) {
    errors = _errors_;
  }));

  it('should do something', function () {
    expect(!!errors).toBe(true);
  });

});
