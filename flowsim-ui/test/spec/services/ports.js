'use strict';

describe('Service: ports', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ports;
  beforeEach(inject(function (_Ports_) {
    ports = _Ports_;
  }));

  it('should do something', function () {
    expect(!!ports).toBe(true);
  });

});
