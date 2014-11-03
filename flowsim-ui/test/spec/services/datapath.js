'use strict';

describe('Service: datapath', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var datapath;
  beforeEach(inject(function (_datapath_) {
    datapath = _datapath_;
  }));

  it('should do something', function () {
    expect(!!datapath).toBe(true);
  });

});
