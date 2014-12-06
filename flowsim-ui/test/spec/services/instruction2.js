'use strict';

describe('Service: Instruction2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Instruction2;
  beforeEach(inject(function (_Instruction2_) {
    Instruction2 = _Instruction2_;
  }));

  it('should do something', function () {
    expect(!!Instruction2).toBe(true);
  });

});
