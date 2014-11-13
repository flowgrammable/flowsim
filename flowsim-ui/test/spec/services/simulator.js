'use strict';

describe('Service: simulator', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Simulator;
  beforeEach(inject(function (_Simulation_) {
    Simulator = _Simulation_;
  }));

  it('should do something', function () {
    expect(!!Simulator).toBe(true);
  });

});
