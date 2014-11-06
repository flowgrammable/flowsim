'use strict';

describe('Service: action', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var action;
  beforeEach(inject(function (_Action_) {
    action = _Action_;
  }));

  it('should do something', function () {
    expect(!!action).toBe(true);
  });

});
