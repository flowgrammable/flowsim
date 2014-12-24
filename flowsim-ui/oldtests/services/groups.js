'use strict';

describe('Service: groups', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var groups;
  beforeEach(inject(function (_Groups_) {
    groups = _Groups_;
  }));

  it('should do something', function () {
    expect(!!groups).toBe(true);
  });

});
