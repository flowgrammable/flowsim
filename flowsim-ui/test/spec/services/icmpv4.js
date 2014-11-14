'use strict';

describe('Service: ICMPV4', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var ICMPV4;
  beforeEach(inject(function (_ICMPV4_) {
    ICMPV4 = _ICMPV4_;
  }));

  it('Service Test', function () {
    expect(!!ICMPV4).toBe(true);
  });

  it('Construction Pass', function () {
    expect(!!ICMPV4).toBe(true);

    ICMPV4.mkICMPV4(null, 0, 0);

    var ts_req1 = ICMPV4.mkICMPV4(13, 0, 20);
    var ts_req2 = new ICMPV4.ICMPV4(ts_req1);
    var ts_req3 = new ICMPV4.ICMPV4(null, 13, 0, 20);
    var ts_req4 = ts_req1.clone();

    var testStr = ts_req1.toString();
    expect(ts_req2.toString()).toBe(testStr);
    expect(ts_req3.toString()).toBe(testStr);
    expect(ts_req4.toString()).toBe(testStr);
  });

  it('Construction Fail', function () {
    expect(!!ICMPV4).toBe(true);

    expect(function(){ICMPV4.mkICMPV4(0, 69422, 25);}).toThrow();
    expect(function(){ICMPV4.mkICMPV4('66422', 234, 25);}).toThrow();
  });

});
