'use strict';

describe('Service: simulator', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Simulator;
  beforeEach(inject(function (_Simulator_) {
    Simulator = _Simulator_;
  }));

  it('should do something', function () {
    expect(!!simulator).toBe(true);
  });

});
