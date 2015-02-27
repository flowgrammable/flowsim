'use strict';

describe('Service: fgstore', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var fgStore;
  beforeEach(inject(function (_fgStore_) {
    fgStore = _fgStore_;
  }));

  it('should do something', function () {
    expect(!!fgStore).toBe(true);
  });

});
