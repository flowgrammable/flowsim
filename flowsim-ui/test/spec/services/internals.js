'use strict';

describe('Service: internals', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var INTERNALS;
  beforeEach(inject(function (_INTERNALS_) {
    INTERNALS = _INTERNALS_;
  }));

  it('Internals Construction', function () {
    var int = new INTERNALS.mkInternals(
      '0x12345678', '0x87654321', '0x1122334455667788'
    );
  });

  it('bbMetadata construction pass', function(){
    var md = INTERNALS.mkMetadata('0x0011223344556677');
  });

  it('Metadata construction pass', function(){
    var md = new INTERNALS.Metadata(null, '0x1122334455667788');
  });


  it('Internals Metadata Multi Match Pass', function() {
    var u = INTERNALS.mkMetadata('0x0011223344556677');
    var b = INTERNALS.mkMetadata('0xffffffffffffffff');
    var m = INTERNALS.mkMetadata('0x91abbaefcd450000');
    var e = INTERNALS.mkMetadata('0x0000000000000000');
    var o = INTERNALS.mkMetadata('0x0100000000000000');


    var every = INTERNALS.mkMetadataMatch(e, e);

    var multi = INTERNALS.mkMetadataMatch(o, o);

    var exact = INTERNALS.mkMetadataMatch(
      u, b
    );


    expect(every.match(u)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(m)).toBe(true);

    expect(multi.match(u)).toBe(false);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(m)).toBe(true);

    expect(exact.match(u)).toBe(true);
    expect(exact.match(b)).toBe(false);
    expect(exact.match(m)).toBe(false);

  });

  it('Internals Port Match Pass', function() {
    var u = INTERNALS.mkPort('0x11223344');
    var b = INTERNALS.mkPort('0x11111111');
    var c = INTERNALS.mkPort('0x11223344');

    var exact = INTERNALS.mkPortMatch(u);

    expect(exact.match(c)).toBe(true);
    expect(exact.match(b)).toBe(false);

  });

  it('Internals PhyPort Match Pass', function() {
    var u = INTERNALS.mkPhyport('0x11223344');
    var b = INTERNALS.mkPhyport('0x11111111');
    var c = INTERNALS.mkPhyport('0x11223344');

    var exact = INTERNALS.mkPhyportMatch(u);

    expect(exact.match(c)).toBe(true);
    expect(exact.match(b)).toBe(false);

  });

  it('JSON construct', function(){
    var intern = INTERNALS.mkInternals(
      '0x11223344', '0x44332211', '0x1122334455667788');

    var j = JSON.stringify(intern);
    var j_ = new INTERNALS.INTERNALS(JSON.parse(j));

    expect(j_.port().toString(16)).toBe('0x11223344');
    expect(j_.phyPort().toString(16)).toBe('0x44332211');
    expect(j_.metadata().toString(16)).toBe('0x1122334455667788');
  });

});
