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

  it('UInt', function() {
    expect(function() {
      new UInt.UInt(null, 'q');
    }).toThrow();
    expect(function() {
      new UInt.UInt(null, '0xx00');
    }).toThrow();
    expect(function() {
      new UInt.UInt(null, 1.2);
    }).toThrow();
    expect(function() {
      new UInt.UInt(null, null, 0);
    }).toThrow();
  });

  it('', function() {
    var left = new UInt.UInt(null, 0xffffffff);
    var mask = new UInt.UInt(null, 0x0000ff00);
    var right = new UInt.UInt(null, 0x11223344);

    console.log(UInt.and(mask, right).toString(16));
    console.log(UInt.neg(mask).toString(16));
    console.log(UInt.and(UInt.neg(mask), left).toString(16));

    var r = UInt.or(UInt.and(mask, right), UInt.and(UInt.neg(mask), left));
    console.log(r.toString(16));
  });

});
