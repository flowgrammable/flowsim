'use strict';

describe('Service: fgConstraints', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var fgConstraints;
  beforeEach(inject(function (_fgConstraints_) {
    fgConstraints = _fgConstraints_;
  }));

  it('should do something', function () {
    expect(!!fgConstraints).toBe(true);
  });

});
