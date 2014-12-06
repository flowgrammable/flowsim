'use strict';

describe('Service: sctp2', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var sctp2;
  beforeEach(inject(function (_sctp2_) {
    sctp2 = _sctp2_;
  }));

  it('should do something', function () {
    expect(!!sctp2).toBe(true);
  });

});
