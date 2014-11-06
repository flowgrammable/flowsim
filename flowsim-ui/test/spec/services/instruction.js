'use strict';

describe('Service: instruction', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var instruction;
  beforeEach(inject(function (_Instruction_) {
    instruction = _Instruction_;
  }));

  it('should do something', function () {
    expect(!!instruction).toBe(true);
  });

});
