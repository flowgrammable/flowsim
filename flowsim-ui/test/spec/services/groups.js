'use strict';

describe('Service: groups', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var groups;
  beforeEach(inject(function (_groups_) {
    groups = _groups_;
  }));

  it('should do something', function () {
    expect(!!groups).toBe(true);
  });

});
