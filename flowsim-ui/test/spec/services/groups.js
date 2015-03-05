'use strict';

describe('Service: groups', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Groups;
  beforeEach(inject(function (_Groups_) {
    Groups = _Groups_;
  }));

  iit('Group profile construct', function () {
    expect(!!Groups).toBe(true);
    var gp = new Groups.Profile();
    var gpj = JSON.stringify(gp);
    var gp_ = new Groups.Profile(JSON.parse(gpj));
  });

});
