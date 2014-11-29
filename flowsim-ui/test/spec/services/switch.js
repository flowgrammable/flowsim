'use strict';

describe('Service: switch', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Switch_;
  beforeEach(inject(function (_Switch_) {
    Switch_ = _Switch_;
  }));

  var Profile;
  beforeEach(inject(function (_Profile_) {
    Profile = _Profile_;
  }));

  it('Switch construction test Pass', function () {
    var prof = new Profile.create('a test profile');
    var swi = new Switch_.create(null, prof);
  });

  it('Switch construction fail', function() {
    expect(function() {
      Switch_.create()
    }).toThrow();
  });


  it('Switch construction test Pass', function () {
    var prof = Profile.create('a test profile');
    var swi = Switch_.create('test switch', prof);

    expect(swi.datapath.capabilities.n_buffers).toBe(1024);
  });
});
