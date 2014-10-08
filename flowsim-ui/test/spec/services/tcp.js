'use strict';

describe('Service: TCP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var TCP;
  beforeEach(inject(function (_TCP_) {
    TCP = _TCP_;
  }));

  it('should do something', function () {
    expect(!!TCP).toBe(true);
  });

});
