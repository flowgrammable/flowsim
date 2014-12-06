'use strict';

describe('Service: icmpv62', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var icmpv62;
  beforeEach(inject(function (_icmpv62_) {
    icmpv62 = _icmpv62_;
  }));

  it('should do something', function () {
    expect(!!icmpv62).toBe(true);
  });

});
