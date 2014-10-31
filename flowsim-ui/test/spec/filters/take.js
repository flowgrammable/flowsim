'use strict';

describe('Filter: take', function () {

  // load the filter's module
  beforeEach(module('flowsimUiApp'));

  // initialize a new instance of the filter before each test
  var take;
  beforeEach(inject(function ($filter) {
    take = $filter('take');
  }));

  it('should return the input prefixed with "take filter:"', function () {
    var text = 'angularjs';
    expect(take(text)).toBe('take filter: ' + text);
  });

});
