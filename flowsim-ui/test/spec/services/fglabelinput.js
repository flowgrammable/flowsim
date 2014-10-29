'use strict';

describe('Service: fgLabelInput', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var fgLabelInput;
  beforeEach(inject(function (_fgLabelInput_) {
    fgLabelInput = _fgLabelInput_;
  }));

  it('should do something', function () {
    expect(!!fgLabelInput).toBe(true);
  });

});
