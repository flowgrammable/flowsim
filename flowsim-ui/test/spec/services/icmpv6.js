'use strict';

describe('Service: ICMPV6', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ICMPV6;
  beforeEach(inject(function (_ICMPV6_) {
    ICMPV6 = _ICMPV6_;
  }));

  it('should do something', function () {
    expect(!!ICMPV6).toBe(true);
  });

});
