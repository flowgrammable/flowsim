'use strict';

describe('Service: ipv62', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ipv62;
  beforeEach(inject(function (_ipv62_) {
    ipv62 = _ipv62_;
  }));

  it('should do something', function () {
    expect(!!ipv62).toBe(true);
  });

});
