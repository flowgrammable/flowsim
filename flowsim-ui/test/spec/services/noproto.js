'use strict';

var macPattern = /^([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})$/;

function isMAC(str) {
  return macPattern.test(str);
}

function dispMAC(array) {
  return array[0].toString(16) + ':' +
         array[1].toString(16) + ':' +
         array[2].toString(16) + ':' +
         array[3].toString(16) + ':' +
         array[4].toString(16) + ':' +
         array[5].toString(16);
}

describe('Service: noproto', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Noproto;
  beforeEach(inject(function (_Noproto_) {
    Noproto = _Noproto_;
  }));

  it('Construction', function () {
    expect(!!Noproto).toBe(true);

    var eth = new Noproto.Protocol({
      name: 'Ethernet',
      shortName: 'eth',
      bytes: 18,
      fields: [{
        name: 'Src',
        bitwidth: 48,
        matchable: true,
        setable: true,
        testStr: isMAC,
        consStr: function() { return [0, 0, 0, 0, 0, 0] },
        dispStr: dispMAC,
        tip: 'Ethernet Src MAC Address'
      }, {
        name: 'Dst',
        bitwidth: 48,
        matchable: true,
        setable: true,
        testStr: isMAC,
        consStr: function() { return [0, 0, 0, 0, 0, 0] },
        dispStr: dispMAC,
        tip: 'Ethernet Dst MAC Address'
      }, {
        name: 'Type',
        bitwidth: 16,
        matchable: true,
        testStr: UInt.is(16),
        consStr: function() { return [0, 0, 0, 0, 0, 0] },
        dispStr: function(val) { 
          return '0x' + UInt.padZeros(val.toString(16), 4);
        },
        tip: 'Ethernet Payload Type/Length'
      }]
    });

  });



});
