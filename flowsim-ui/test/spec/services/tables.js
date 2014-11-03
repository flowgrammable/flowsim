'use strict';

describe('Service: tables', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var tables;
  beforeEach(inject(function (_tables_) {
    tables = _tables_;
  }));

  it('should do something', function () {
    expect(!!tables).toBe(true);
  });

});
