'use strict';

describe('Service: Internal', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Internal;
  beforeEach(inject(function (_Internal_) {
    Internal = _Internal_;
  }));

  it('should do something', function () {
    expect(!!Internal).toBe(true);
  });

});
