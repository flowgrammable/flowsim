'use strict';

describe('Service: Packet', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Packet;
  beforeEach(inject(function (_Packet_) {
    Packet = _Packet_;
  }));

  it('should do something', function () {
    expect(!!Packet).toBe(true);
  });

});
