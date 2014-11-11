'use strict';

describe('Service: port', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Port;
  beforeEach(inject(function (_Port_) {
    Port = _Port_;
  }));

  it('should do something', function () {
    expect(!!Port).toBe(true);
  });

  it('port constructor pass', function() {
    new Port.mkPort();
  });

});
