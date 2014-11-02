'use strict';

describe('Service: fgUi', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var fgUi;
  beforeEach(inject(function (_fgUi_) {
    fgUi = _fgUi_;
  }));

  it('should do something', function () {
    expect(!!fgUi).toBe(true);
  });

});
