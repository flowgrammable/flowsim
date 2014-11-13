'use strict';

describe('Service: context', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var context;
  beforeEach(inject(function (_Context_) {
    context = _Context_;
  }));

  it('should do something', function () {
    expect(!!context).toBe(true);
  });

});
