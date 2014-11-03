'use strict';

describe('Service: ports', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ports;
  beforeEach(inject(function (_ports_) {
    ports = _ports_;
  }));

  it('should do something', function () {
    expect(!!ports).toBe(true);
  });

});
