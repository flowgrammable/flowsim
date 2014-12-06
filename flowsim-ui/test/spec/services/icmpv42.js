'use strict';

describe('Service: icmpv42', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var icmpv42;
  beforeEach(inject(function (_icmpv42_) {
    icmpv42 = _icmpv42_;
  }));

  it('should do something', function () {
    expect(!!icmpv42).toBe(true);
  });

});
