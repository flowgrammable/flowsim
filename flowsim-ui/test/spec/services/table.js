'use strict';

describe('Service: table', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var table;
  beforeEach(inject(function (_Table_) {
    table = _Table_;
  }));

  it('should do something', function () {
    expect(!!table).toBe(true);
  });

});
