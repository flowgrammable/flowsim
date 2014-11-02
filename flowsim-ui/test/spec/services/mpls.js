'use strict';

describe('Service: MPLS', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var MPLS;
  beforeEach(inject(function (_MPLS_) {
    MPLS = _MPLS_;
  }));

  it('should do something', function () {
    expect(!!MPLS).toBe(true);
  });

});
