'use strict';

describe('Service: VLAN', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var VLAN;
  beforeEach(inject(function (_VLAN_) {
    VLAN = _VLAN_;
  }));

  it('should do something', function () {
    expect(!!VLAN).toBe(true);
  });

});
