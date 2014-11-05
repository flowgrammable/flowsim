'use strict';

describe('Service: portsview', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var portsview;
  beforeEach(inject(function (_portsView_) {
    portsview = _portsView_;
  }));

  it('should do something', function () {
    expect(!!portsview).toBe(true);
  });

});
