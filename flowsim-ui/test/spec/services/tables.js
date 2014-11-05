'use strict';

describe('Service: tables', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Tables;
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
  }));

  it('should do something', function () {
    expect(!!Tables).toBe(true);
  });

});
