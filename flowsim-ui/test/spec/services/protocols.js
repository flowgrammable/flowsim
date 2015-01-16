'use strict';

describe('Service: Protocols', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Protocols;
  beforeEach(inject(function (_Protocols_) {
    Protocols = _Protocols_;
  }));

  it('Protocols util mkField', function () {
    var ethSrc = Protocols.mkFieldUInt('Ethernet', 'Dst', 'a:b:c:d:e:f');
    expect(ethSrc.value.length).toBe(6);
  });

  it('Protocols util mkMatch', function() {
    var ethSrcMatch = Protocols.mkMatch('Ethernet', 'Dst', 'a:a:a:a:a:a', '');
    expect(ethSrcMatch.protocol).toBe('Ethernet');
    expect(ethSrcMatch.field).toBe('Dst');

    var typMatch = Protocols.mkMatch('Ethernet', 'Type', '0x0800', '');
    expect(typMatch.field).toBe('Type');
    expect(typMatch._match.value.bytes).toBe(2);
    expect(typMatch._match.mask.value).toBe(0xffff);

  });

  it('Protocols fieldFilter', function(){
    var protos = Protocols.fieldFilter('copyIn');
    console.log('protos', protos);
  })

});
