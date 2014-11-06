'use strict';

describe('Service: Utils', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Utils;
  beforeEach(inject(function (_Utils_) {
    Utils = _Utils_;
  }));

  it('howMany_, maxFrom_', function () {

    var tmp;

    expect(Utils.howManyBits(0)).toBe(1);
    expect(Utils.howManyBits(0x0)).toBe(1);
    expect(Utils.howManyBytes(0)).toBe(1);
    expect(Utils.howManyBytes(0x0)).toBe(1);
 
    expect(Utils.howManyBits(0)).toBe(1);
    tmp = 1;
    _.each(_.range(31), function(i) {
      expect(Utils.howManyBits(tmp)).toBe(i+1);
        tmp <<= 1;
    });

    expect(Utils.howManyBytes(0)).toBe(1);
    tmp = 1;
    _.each(_.range(31), function(i) {
      expect(Utils.howManyBytes(tmp)).toBe(Math.ceil((i+1)/8));
        tmp <<= 1;
    });

    _.each(_.range(31), function(i) {
      expect(Utils.maxFromBits(i+1)).toBe(Math.pow(2, i+1)-1);
    });
    _.each(_.range(4), function(i) {
      expect(Utils.maxFromBytes(i+1)).toBe(Math.pow(2, (8*(i+1)))-1);
    });
  });

  it('UInt construction, UInt.Match.match', function() {

    var type_ip = new Utils.UInt(0x0800);
    var type_arp = new Utils.UInt(0x0806);


    var inval  = new Utils.UInt(0x0a0101f0);
    var outval = new Utils.UInt(0x0b0101f0);
    var def    = new Utils.UInt.Match(0, 0);
    var prefix = new Utils.UInt.Match(0xa010102, 0xffffff00);

  });

  it('UInt(0x1ffff, 16) should fail', function() {
    expect(function() {
      new Utils.UInt(0x1ffff, 16)
    }).toThrow();
  });
  
  it('UInt("0x1ffff", 16) should fail', function() {
    expect(function() {
      new Utils.UInt('0x1ffff', 16)
    }).toThrow();
  });

  it('UInt(0x800).toString()', function() {

    var v = new Utils.UInt('0x800', 16);
    expect(v.toString(16)).toBe('0x0800');

  });

  it('UInt("0xx0000", 16)', function() {
    expect(function() {
      new Utils.UInt('0xx0000', 16);
    }).toThrow();
  });

});
