'use strict';

describe('Service: protocols', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var protocols;
  beforeEach(inject(function (_protocols_) {
    protocols = _protocols_;
  }));

  it('should do something', function () {
    expect(!!protocols).toBe(true);
  });

});
