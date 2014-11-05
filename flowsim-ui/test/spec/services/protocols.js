'use strict';

describe('Service: protocols', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var protocols;
  beforeEach(inject(function (_Protocols_) {
    protocols = _Protocols_;
  }));

  it('should do something', function () {
    expect(!!protocols).toBe(true);
  });

});
