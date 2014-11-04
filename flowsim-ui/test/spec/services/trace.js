'use strict';

describe('Service: trace', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var trace;
  beforeEach(inject(function (_trace_) {
    trace = _trace_;
  }));

  it('should do something', function () {
    expect(!!trace).toBe(true);
  });

});
