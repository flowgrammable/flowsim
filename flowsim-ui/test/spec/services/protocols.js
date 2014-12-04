'use strict';

describe('Service: Protocols', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Protocols;
  beforeEach(inject(function (_Protocols_) {
    Protocols = _Protocols_;
  }));

  it('should do something', function () {
    expect(!!Protocols).toBe(true);
  });

});
