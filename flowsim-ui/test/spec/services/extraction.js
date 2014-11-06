'use strict';

describe('Service: extraction', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var extraction;
  beforeEach(inject(function (_Extraction_) {
    extraction = _Extraction_;
  }));

  it('should do something', function () {
    expect(!!extraction).toBe(true);
  });

});
