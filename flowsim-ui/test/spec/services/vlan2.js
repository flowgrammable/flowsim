'use strict';

describe('Service: vlan2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var vlan2;
  beforeEach(inject(function (_vlan2_) {
    vlan2 = _vlan2_;
  }));

  it('should do something', function () {
    expect(!!vlan2).toBe(true);
  });

});
