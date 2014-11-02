'use strict';

describe('Service: Subscriber', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Subscriber;
  beforeEach(inject(function (_Subscriber_) {
    Subscriber = _Subscriber_;
  }));

  it('should do something', function () {
    expect(!!Subscriber).toBe(true);
  });

});
