'use strict';

describe('Service: protocol/ethernet', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var protocol/ethernet;
  beforeEach(inject(function (_protocol/ethernet_) {
    protocol/ethernet = _protocol/ethernet_;
  }));

  it('should do something', function () {
    expect(!!protocol/ethernet).toBe(true);
  });

});
