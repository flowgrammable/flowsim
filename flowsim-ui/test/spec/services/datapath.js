'use strict';

describe('Service: datapath', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Datapath;
  beforeEach(inject(function (_Datapath_) {
    Datapath = _Datapath_;
  }));

  it('Datapath profile construction pass', function () {
    var dpProf = new Datapath.Profile();
    expect(dpProf.ip_reassembly).toBe(true);

    var j = JSON.stringify(dpProf);
    var j_ = new Datapath.Profile(JSON.parse(j));

    expect(j_.ip_reassembly).toBe(dpProf.ip_reassembly);
  });

});
