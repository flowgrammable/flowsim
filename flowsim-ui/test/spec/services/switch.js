'use strict';

describe('Service: switch', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var switch;
  beforeEach(inject(function (_switch_) {
    switch = _switch_;
  }));

  it('should do something', function () {
    expect(!!switch).toBe(true);
  });

});
