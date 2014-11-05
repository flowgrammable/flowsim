'use strict';

describe('Service: datapath', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var datapath;
  beforeEach(inject(function (_Datapath_) {
    datapath = _Datapath_;
  }));

  it('should do something', function () {
    expect(!!datapath).toBe(true);
  });

});
