'use strict';

describe('Service: ListManager', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ListManager;
  beforeEach(inject(function (_ListManager_) {
    ListManager = _ListManager_;
  }));

  it('should do something', function () {
    expect(!!ListManager).toBe(true);
  });

});
