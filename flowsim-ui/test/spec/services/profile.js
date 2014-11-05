'use strict';

describe('Service: profile', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var profile;
  beforeEach(inject(function (_Profile_) {
    profile = _Profile_;
  }));

  it('should do something', function () {
    expect(!!profile).toBe(true);
  });

});
