'use strict';

describe('Service: mpls2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var mpls2;
  beforeEach(inject(function (_mpls2_) {
    mpls2 = _mpls2_;
  }));

  it('should do something', function () {
    expect(!!mpls2).toBe(true);
  });

});
