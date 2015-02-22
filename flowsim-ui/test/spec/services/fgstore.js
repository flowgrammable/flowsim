'use strict';

describe('Service: fgstore', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var fgstore;
  beforeEach(inject(function (_fgstore_) {
    fgstore = _fgstore_;
  }));

  it('should do something', function () {
    expect(!!fgstore).toBe(true);
  });

});
