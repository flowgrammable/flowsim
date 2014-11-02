'use strict';

describe('Service: ICMPV4', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ICMPV4;
  beforeEach(inject(function (_ICMPV4_) {
    ICMPV4 = _ICMPV4_;
  }));

  it('should do something', function () {
    expect(!!ICMPV4).toBe(true);
  });

});
