'use strict';

describe('Service: flow', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var flow;
  beforeEach(inject(function (_Flow_) {
    flow = _Flow_;
  }));

  it('should do something', function () {
    expect(!!flow).toBe(true);
  });

});
