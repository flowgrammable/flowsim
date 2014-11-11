'use strict';

describe('Service: regex', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Regex;
  beforeEach(inject(function (_Regex_) {
    Regex = _Regex_;
  }));

  it('should do something', function () {
    expect(!!Regex).toBe(true);
  });

});
