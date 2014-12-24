'use strict';

describe('Service: fgCache', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var fgCache;
  beforeEach(inject(function (_fgCache_) {
    fgCache = _fgCache_;
  }));

  it('should do something', function () {
    expect(!!fgCache).toBe(true);
  });

});
