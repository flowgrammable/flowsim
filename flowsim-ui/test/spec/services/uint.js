'use strict';

describe('Service: uint', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var UInt;
  beforeEach(inject(function (_UInt_) {
    UInt = _UInt_;
  }));

  it('UInt Import', function () {
    expect(!!UInt).toBe(true);
  });

  it('howMany_, maxFrom_', function () {
    var tmp;

    expect(UInt.howManyBits(0)).toBe(1);
    expect(UInt.howManyBits(0x0)).toBe(1);
    expect(UInt.howManyBytes(0)).toBe(1);
    expect(UInt.howManyBytes(0x0)).toBe(1);

    expect(UInt.howManyBits(0)).toBe(1);

    tmp = 1;
    _.each(_.range(31), function(i) {
      expect(UInt.howManyBits(tmp)).toBe(i+1);
      tmp <<= 1;
    });
    expect(UInt.howManyBytes(0)).toBe(1);

    tmp = 1;
    _.each(_.range(31), function(i) {
      expect(UInt.howManyBytes(tmp)).toBe(Math.ceil((i+1)/8));
      tmp <<= 1;
    });

    _.each(_.range(31), function(i) {
      expect(UInt.maxFromBits(i+1)).toBe(Math.pow(2, i+1)-1);
    });

    _.each(_.range(4), function(i) {
      expect(UInt.maxFromBytes(i+1)).toBe(Math.pow(2, (8*(i+1)))-1);
    });
  });


  it('UInt(null, 0x1ffff, 2) should fail', function() {
    expect(function() {
      new UInt.UInt(null, 0x1ffff, 2);
    }).toThrow();
  });

  it('UInt(null, "0x1ffff", 2) should fail', function() {
    expect(function() {
      new UInt.UInt(null, '0x1ffff', 2);
    }).toThrow();
  });

  it('UInt(null, -1, 2) should fail', function() {
    expect(function() {
      new UInt.UInt(null, -1, 2);
    }).toThrow();
  });

  it('UInt(null, "-65536", 2) should fail', function() {
    expect(function() {
      new UInt.UInt(null, '-65536', 2);
    }).toThrow();
  });

  it('UInt(null, 0x800, 2).toString()', function() {
    var v = new UInt.UInt(null, '0x800', 2);
    expect(v.toString(16)).toBe('0x0800');
  });

  it('UInt(null, 12345, 2).toString()', function() {
    var v = new UInt.UInt(null, 12345, 2);
    expect(v.toString(16)).toBe('0x3039');
  });

  it('UInt(null, "0xx0000", 2)', function() {
    expect(function() {
      new UInt.UInt(null, '0xx0000', 2);
    }).toThrow();
  });

  it('UInt Construction', function() {
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

  it('UInt No-Throw Construction', function() {
    var type_ip  = new UInt.UInt(null, 0x0800, 2);
    var type_arp = new UInt.UInt(null, 0x0806, 2);
    var type     = new UInt.UInt(null, null, 2);

    var inval  = new UInt.UInt(null, 0x0a0101f0, 4);
    var outval = new UInt.UInt(null, 0x0b0101f0, 4);
  });

  it('UInt Copy Construction', function() {
    var uint16 = new UInt.UInt(null, 0x0800, 2);
    var uint24 = new UInt.UInt(null, 0x800, 3);
    var uint32 = new UInt.UInt(null, 0xFEED0806, 4);

    var copy16 = new UInt.UInt(uint16);
    expect(copy16.toString(16)).toBe('0x0800');
    var copy24 = new UInt.UInt(uint24);
    expect(copy24.toString(16)).toBe('0x000800');
    var copy32 = new UInt.UInt(uint32);
    expect(copy32.toString(16)).toBe('0xfeed0806');
  });

  it('UInt Match - Ethernet Type', function() {
    var type1 = new UInt.UInt(null, 0x0800, 2);
    var type2 = new UInt.UInt(null, 0x0806, 2);

    var exact1 = new UInt.Match(null,
        new UInt.UInt(null, 0x0800, 2),
        new UInt.UInt(null, 0xffff, 2));

    var exact2 = new UInt.Match.mkExact(type1);

    var wildcard1 = new UInt.Match(null,
        new UInt.UInt(null, 0x0000, 2),
        new UInt.UInt(null, 0x0000, 2));

    var wildcard2 = new UInt.Match.mkWildcard(type1);
    var wildcard3 = new UInt.Match.mkWildcard(2);

    expect(exact1.match(type1)).toBe(true);
    expect(exact2.match(type1)).toBe(true);
    expect(wildcard1.match(type1)).toBe(true);
    expect(wildcard2.match(type1)).toBe(true);
    expect(wildcard3.match(type1)).toBe(true);

    expect(exact1.match(type2)).toBe(false);
    expect(exact2.match(type2)).toBe(false);
    expect(wildcard1.match(type2)).toBe(true);
    expect(wildcard2.match(type2)).toBe(true);
    expect(wildcard3.match(type2)).toBe(true);

  });

  it('UInt Match - Wildcard', function() {
    var type1 = new UInt.UInt(null, 0x0800, 2);
    var type2 = new UInt.UInt(null, 0x1, 2);

    var wildcard1 = new UInt.Match(null,
        new UInt.UInt(null, 0x1, 2),
        new UInt.UInt(null, 0x0, 2));

    expect(wildcard1.match(type1)).toBe(true);
    expect(wildcard1.match(type2)).toBe(true);
  });

  it('UInt Match - Ethernet MAC', function() {
    var empty     = new UInt.UInt(null, null, 6);
    var broadcast = (new UInt.UInt(null, null, 6)).neg();

    var mac1 = new UInt.UInt(null, [0, 1, 2, 3, 4, 5], 6);
    var mac2 = new UInt.UInt(null, [0, 1, 2, 3, 4, 6], 6);

    var exact1_mac1 = new UInt.Match(null,
        new UInt.UInt(null, [0, 1, 2, 3, 4, 5], 6),
        new UInt.UInt(null, [0xff, 0xff, 0xff, 0xff, 0xff, 0xff], 6));
    var exact2_mac1 = new UInt.Match.mkExact(mac1);

    var exact1_mac2 = new UInt.Match(null,
        new UInt.UInt(null, [0, 1, 2, 3, 4, 6], 6),
        new UInt.UInt(null, [0xff, 0xff, 0xff, 0xff, 0xff, 0xff], 6));
    var exact2_mac2 = new UInt.Match.mkExact(mac2);

    var wildcard1_mac1 = new UInt.Match(null,
        new UInt.UInt(null, null, 6),
        new UInt.UInt(null, null, 6));
    var wildcard2_mac1 = new UInt.Match.mkWildcard(mac1);
    var wildcard3_mac1 = new UInt.Match.mkWildcard(6);

    var wildcard1_mac2 = new UInt.Match(null,
        new UInt.UInt(null, null, 6),
        new UInt.UInt(null, null, 6));
    var wildcard2_mac2 = new UInt.Match.mkWildcard(mac2);
    var wildcard3_mac2 = new UInt.Match.mkWildcard(6);

    expect(exact1_mac1.match(mac1)).toBe(true);
    expect(exact2_mac1.match(mac1)).toBe(true);
    expect(wildcard1_mac1.match(mac1)).toBe(true);
    expect(wildcard2_mac1.match(mac1)).toBe(true);
    expect(wildcard3_mac1.match(mac1)).toBe(true);
    expect(exact1_mac1.match(mac2)).toBe(false);
    expect(exact2_mac1.match(mac2)).toBe(false);
    expect(wildcard1_mac1.match(mac2)).toBe(true);
    expect(wildcard2_mac1.match(mac2)).toBe(true);
    expect(wildcard3_mac1.match(mac2)).toBe(true);

    expect(exact1_mac2.match(mac1)).toBe(false);
    expect(exact2_mac2.match(mac1)).toBe(false);
    expect(wildcard1_mac2.match(mac1)).toBe(true);
    expect(wildcard2_mac2.match(mac1)).toBe(true);
    expect(wildcard3_mac2.match(mac1)).toBe(true);
    expect(exact1_mac2.match(mac2)).toBe(true);
    expect(exact2_mac2.match(mac2)).toBe(true);
    expect(wildcard1_mac2.match(mac2)).toBe(true);
    expect(wildcard2_mac2.match(mac2)).toBe(true);
    expect(wildcard3_mac2.match(mac2)).toBe(true);
  });

  it('UInt Prefix', function() {
    var route1 = new UInt.Match(null,
      new UInt.UInt(null, 0x0a000000, 4),
      new UInt.UInt(null, 0xff000000, 4));
    var route2 = new UInt.Match(null,
      new UInt.UInt(null, 0x0a0b0000, 4),
      new UInt.UInt(null, 0xffff0000, 4));
    var dst1 = new UInt.UInt(null, 0x0a0a0101, 4);
    var dst2 = new UInt.UInt(null, 0x0a0b0101, 4);
    var dst3 = new UInt.UInt(null, 0x0b0b0101, 4);

    expect(route1.match(dst1)).toBe(true);
    expect(route1.match(dst2)).toBe(true);
    expect(route1.match(dst3)).toBe(false);

    expect(route2.match(dst1)).toBe(false);
    expect(route2.match(dst2)).toBe(true);
    expect(route2.match(dst3)).toBe(false);

  });

  it('UInt Exact', function(){
    var route3 = new UInt.Match(null,
      new UInt.UInt(null, 0xfedcbaaa, 4),
      new UInt.UInt(null, 0xffffffff, 4));
    var dst4 = new UInt.UInt(null, 0xfedcbaaa, 4);

    expect(route3.match(dst4)).toBe(true);
  });

  it('UInt Mask', function() {
    var metadata = new UInt.UInt(null, [1, 2, 3, 4, 5, 6, 7, 8], 8);
    var mask1 = new UInt.UInt(null, [0, 0xff, 0, 0xff, 0, 0xff, 0, 0xff], 8);
    var mask2 = new UInt.UInt(null, [0xff, 0, 0xff, 0, 0xff, 0, 0xff, 0], 8);
    var value = new UInt.UInt(null, [8, 7, 6, 5, 4, 3, 2, 1], 8);

    expect(metadata.toString(16)).toBe('0x0102030405060708');

    var result = UInt.mask(metadata, value, mask1);
    expect(result.toString(16)).toBe('0x0107030505030701');

    metadata.mask(value, mask2);
    expect(metadata.toString(16)).toBe('0x0802060404060208');
  });

  it('UInt toString', function() {
    var uint32 = new UInt.UInt(null, 101, 4);
    var uint24 = new UInt.UInt(null, 101, 3);
    var uint16 = new UInt.UInt(null, 101, 2);
    var uint8 = new UInt.UInt(null, 3, 1);

    expect(uint32.toString()).toBe('101');
    expect(uint32.toString(16)).toBe('0x00000065');
    expect(uint24.toString()).toBe('101');
    expect(uint24.toString(16)).toBe('0x000065');
    expect(uint16.toString()).toBe('101');
    expect(uint16.toString(16)).toBe('0x0065');
    expect(uint8.toString()).toBe('3');
    expect(uint8.toString(16)).toBe('0x03');
  });

  it('UInt equal', function() {
    var uint1 = new UInt.UInt(null, 101, 4);
    var uint2 = new UInt.UInt(null, 101, 4);

    expect(UInt.equal(uint1, uint2)).toBe(true);
  });

  it('UInt Match equal', function() {
    var uint1 = new UInt.Match(null, new UInt.UInt(null, 111,4), new UInt.UInt(null, 222,4));
    var uint2 = new UInt.Match(null, new UInt.UInt(null, 111,4), new UInt.UInt(null, 222,4));

    expect(uint1.equal(uint2)).toBe(true);
  });

});
