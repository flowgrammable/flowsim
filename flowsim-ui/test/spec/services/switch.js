'use strict';

describe('Service: switch', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Switch_;
  beforeEach(inject(function (_Switch_) {
    Switch_ = _Switch_;
  }));

  it('should do something', function () {
    expect(!!Switch_).toBe(true);
  });

});
