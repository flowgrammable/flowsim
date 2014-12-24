'use strict';

describe('Service: SCTP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var SCTP;
  beforeEach(inject(function (_SCTP_) {
    SCTP = _SCTP_;
  }));

  it('should do something', function () {
    expect(!!SCTP).toBe(true);
  });

});
