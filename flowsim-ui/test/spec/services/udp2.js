'use strict';

describe('Service: udp2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var udp2;
  beforeEach(inject(function (_udp2_) {
    udp2 = _udp2_;
  }));

  it('should do something', function () {
    expect(!!udp2).toBe(true);
  });

});
