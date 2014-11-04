'use strict';

describe('Filter: capabilities', function () {

  // load the filter's module
  beforeEach(module('flowsimUiApp'));

  // initialize a new instance of the filter before each test
  var capabilities;
  beforeEach(inject(function ($filter) {
    capabilities = $filter('capabilities');
  }));

  it('should return the input prefixed with "capabilities filter:"', function () {
    var text = 'angularjs';
    expect(capabilities(text)).toBe('capabilities filter: ' + text);
  });

});
