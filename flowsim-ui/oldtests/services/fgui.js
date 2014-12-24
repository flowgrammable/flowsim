'use strict';

describe('Service: fgUi', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var fgUi;
  beforeEach(inject(function (_fgUI_) {
    fgUi = _fgUI_;
  }));

  it('should do something', function () {
    expect(!!fgUi).toBe(true);
  });

});
