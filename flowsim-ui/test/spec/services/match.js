'use strict';

describe('Service: match', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Match;
  beforeEach(inject(function (_Match_) {
    Match = _Match_;
  }));

  it('should do something', function () {
    expect(!!Match).toBe(true);

    var m = new Match.Match(
      new Match.Ethernet.Src(
        '00:00:00:00:00:00',
        '00:00:00:00:00:00'
      ),
      new Match.Ethernet.Dst(
        'ff:ff:ff:ff:ff:ff',
        'ff:ff:ff:ff:ff:ff'
      ),
      new Match.Ethernet.Type('0', '0')
    );


  });

});
