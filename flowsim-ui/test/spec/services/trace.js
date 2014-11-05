'use strict';

describe('Service: trace', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Trace;
  beforeEach(inject(function (_Trace_) {
    Trace = _Trace_;
  }));

  it('should do something', function () {
    expect(!!Trace).toBe(true);
  });

});
