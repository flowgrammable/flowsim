'use strict';

describe('Service: uint', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var UInt;
  beforeEach(inject(function (_UInt_) {
    UInt = _UInt_;
  }));

  it('should do something', function () {
    expect(!!UInt).toBe(true);
  });

  it('', function() {
    var src  = new UInt.UInt(null, null, 6);
    var dst  = new UInt.UInt(null, [255, 255, 255, 255, 255, 255], 6);
    var type = new UInt.UInt(null, 0x0800, 2);

    var x1 = UInt.and(src, dst);
    var x2 = UInt.or(src, dst);
    var x3 = UInt.neg(src);
    var x4 = UInt.neg(dst);

    console.log(x1.toString(16));
    console.log(x2.toString(16));
    console.log(x3.toString(16));
    console.log(x4.toString(16));

    expect(function() {
      UInt.equal(src, type);
    }).toThrow();


  });

});
