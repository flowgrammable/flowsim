'use strict';

describe('Service: tcp2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var tcp2;
  beforeEach(inject(function (_tcp2_) {
    tcp2 = _tcp2_;
  }));

  it('should do something', function () {
    expect(!!tcp2).toBe(true);
  });

});
