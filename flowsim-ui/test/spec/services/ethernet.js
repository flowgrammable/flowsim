'use strict';

describe('Service: ETHERNET', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ETHERNET;
  beforeEach(inject(function (_ETHERNET_) {
    ETHERNET = _ETHERNET_;
  }));

  it('should do something', function () {
    console.log('name: '+ETHERNET.name);
    expect(!!ETHERNET).toBe(true);
  });

});
