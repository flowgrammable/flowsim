'use strict';

var macPattern = /^([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})$/;

function isMAC(str) {
  return macPattern.test(str);
}

function consMAC(str) {
  var tmp = input.match(macPattern);
  return _(_.range(6)).map(function(i) {
    return parseInt('0x'+tmp[2*i+1]);
  });
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
  var UInt;
  var Protocols;
  beforeEach(inject(function (_Noproto_, _UInt_, _Protocols_) {
    Noproto = _Noproto_;
    UInt = _UInt_;
    Protocols = _Protocols_;
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
        consStr: consMAC,
        dispStr: dispMAC,
        tip: 'Ethernet Src MAC Address'
      }, {
        name: 'Dst',
        bitwidth: 48,
        matchable: true,
        setable: true,
        testStr: isMAC,
        consStr: consMAC,
        dispStr: dispMAC,
        tip: 'Ethernet Dst MAC Address'
      }, {
        name: 'Type',
        bitwidth: 16,
        matchable: true,
        testStr: UInt.is(16),
        dispStr: function(val) {
          return '0x' + UInt.padZeros(val.toString(16), 4);
        },
        tip: 'Ethernet Payload Type/Length'
      }]
    });

  });

  it('Protocol clone', function(){
    var proto = Protocols.Protocols[1].clone();
    expect(proto.name).toBe('Ethernet');
    expect(proto.fields.length).toBe(3);
  })

  it('Match equality pass', function(){
    var proto = Protocols.Protocols[1].clone();
    var matchProfiles = proto.getMatchProfiles();
    expect(matchProfiles[0].protocol).toBe('Ethernet');
    expect(matchProfiles[0].enabled).toBe(true);
    var match1 = matchProfiles[0].mkType('aa:bb:Cc:Dd:Ee:Ff', 'aa:bb:cc:dd:Ee:Ff');
    var match2 = matchProfiles[0].mkType('aa:Bb:Cc:Dd:Ee:Ff', 'aa:bb:Cc:Dd:Ee:Ff');
    expect(match1.equal(match2)).toBe(true);

    var match3 = matchProfiles[2].mkType('0x0800', '');
    var match4 = matchProfiles[2].mkType('0x0800', '0xffff');
    expect(match3.equal(match4)).toBe(true);
  });

  it('Match equality fail', function(){
    var proto = Protocols.Protocols[1].clone();
    var matchProfiles = proto.getMatchProfiles();
    var match1 = matchProfiles[0].mkType('aa:bb:cc:dd:ee:ff', 'ff:ff:ff:ff:ff:ff');
    var match2 = matchProfiles[0].mkType('cc:dd:ee:ff:ff:ff', 'ff:ff:ff:ff:ff:ff');
    expect(match1.equal(match2)).toBe(false);

    var match3 = matchProfiles[0].mkType('aa:bb:cc:dd:ee:ff', 'ff:ff:ff:ff:ff:ff');
    var match4 = matchProfiles[1].mkType('aa:bb:cc:dd:ee:ff', 'ff:ff:ff:ff:ff:ff');
    expect(match3.equal(match4)).toBe(false);
  });

  it('MatchSet construction', function(){
    var set = new Noproto.MatchSet();
    expect(set.set.length).toBe(0);
  });

  it('MatchSet push match', function(){
    var set = new Noproto.MatchSet();
    var proto = Protocols.Protocols[1].clone();
    var matchProfiles = proto.getMatchProfiles();
    var ethsrcMatch = matchProfiles[0].mkType('aa:bb:Cc:dd:Ee:Ff', '');
    var ethdstMatch = matchProfiles[0].mkType('bb:bb:bb:bb:bb:bb', '');
    set.push(ethsrcMatch);
    expect(set.set.length).toBe(1);
  });

  it('MatchSet pop match', function(){
    var set = new Noproto.MatchSet();
    var proto = Protocols.Protocols[1].clone();
    var matchProfiles = proto.getMatchProfiles();
    var ethsrcMatch = matchProfiles[0].mkType('aa:bb:Cc:dd:Ee:Ff', '');
    var ethdstMatch = matchProfiles[0].mkType('bb:bb:bb:bb:bb:bb', '');
    set.push(ethsrcMatch);
    set.push(ethdstMatch);
    expect(set.set.length).toBe(2);

    set.pop();
    expect(set.set[0].field).toBe('Src');
    set.pop();
    expect(set.set.length).toBe(0);
  });

  it('MatchSet single equality pass', function(){
    var set = new Noproto.MatchSet();
    var set2 = new Noproto.MatchSet();
    var proto = Protocols.Protocols[1].clone();
    var matchProfiles = proto.getMatchProfiles();
    var ethsrcMatch = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethdstMatch = Protocols.mkMatch('Ethernet', 'Dst', 'a:b:c:d:e:f', '');

    // Test same order
    set.push(ethsrcMatch);
    expect(set.set.length).toBe(1);
    set2.push(ethdstMatch);
    expect(set.set.length).toBe(1);
    expect(set2.equal(set)).toBe(false);



  });

  it('MatchSet equality pass', function(){
    var set = new Noproto.MatchSet();
    var set2 = new Noproto.MatchSet();
    var proto = Protocols.Protocols[1].clone();
    var matchProfiles = proto.getMatchProfiles();
    var ethsrcMatch = matchProfiles[0].mkType('aa:bb:Cc:dd:Ee:Ff', '');
    var ethdstMatch = matchProfiles[1].mkType('bb:bb:bb:bb:bb:bb', '');

    // Test same order
    set.push(ethsrcMatch);
    set.push(ethdstMatch);
    set2.push(ethsrcMatch);
    set2.push(ethdstMatch);
    expect(set2.equal(set)).toBe(true);

    // Test different order
    set2.pop();
    set2.pop();
    set2.push(ethdstMatch);
    set2.push(ethsrcMatch);
    expect(set2.equal(set)).toBe(true);

  });

  it('Empty MatchSet equality pass', function(){
    var set = new Noproto.MatchSet();
    var set2 = new Noproto.MatchSet();
    var proto = Protocols.Protocols[1].clone();

    expect(set2.equal(set)).toBe(true);

  });

 it('MatchSet equality fail', function(){
    var set = new Noproto.MatchSet();
    var set2 = new Noproto.MatchSet();
    var proto = Protocols.Protocols[1].clone();
    var matchProfiles = proto.getMatchProfiles();
    var ethsrcMatch = matchProfiles[0].mkType('aa:bb:Cc:dd:Ee:Ff', '');
    var ethdstMatch = matchProfiles[1].mkType('bb:bb:bb:bb:bb:bb', '');
    var ethdstMatch2 = matchProfiles[1].mkType('cb:bb:bb:bb:bb:bb', '');

    // Test same order
    set.push(ethsrcMatch);
    set.push(ethdstMatch);
    set2.push(ethsrcMatch);
    set2.push(ethdstMatch2);
    expect(set2.equal(set)).toBe(false);

    // Test different order
    set2.pop();
    set2.pop();
    set2.push(ethdstMatch2);
    set2.push(ethsrcMatch);
    expect(set2.equal(set)).toBe(false);

  });

   it('Extractors test', function(){
    var extractors = _(Protocols.Protocols).map(function(proto){
      return proto.getExtractions();
    });
    expect(extractors.length).toBeGreaterThan(1);
    expect(extractors[1].length).toBe(3);
   });

   it('Match.matches exact pass', function(){
    var match1 = Protocols.mkMatch('Ethernet', 'Src', 'a:a:a:a:a:a', '');
    var field1 = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:a');
    expect(match1.matches(field1)).toBe(true);
   });

   it('Match.matches exact fail', function(){
    var match1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:a:a:a:a', '');
    var field1 = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:a');
    expect(match1.matches(field1)).toBe(false);
   });

   it('Match.matches wildcard match pass', function(){
    var match1 = Protocols.mkMatch('Ethernet', 'Src', '0:0:0:0:0:0', '0:0:0:0:0:0');
    var field1 = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:a');
    expect(match1.matches(field1)).toBe(true);
   });

   it('Match.matches masked pass', function(){
    var match1 = Protocols.mkMatch('Ethernet', 'Src', '0:1:0:1:0:1', '0:1:0:1:0:1');
    var field1 = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:1:b:1:c:1');
    expect(match1.matches(field1)).toBe(true);
   });

   it('Match.matches masked fail', function(){
    var match1 = Protocols.mkMatch('Ethernet', 'Src', '0:1:0:1:0:1', '0:1:0:1:0:1');
    var field1 = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:2:b:2:c:2');
    expect(match1.matches(field1)).toBe(false);
   });

   it('MatchSet key exact pass', function(){
    var matchSet = new Noproto.MatchSet();
    var match1 = Protocols.mkMatch('Ethernet', 'Src', 'a:a:a:a:a:a', '');
    var match2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    var src = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:a');
    var dst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:b');

    matchSet.push(match1);
    matchSet.push(match2);
    expect(matchSet.set[0].matches(src)).toBe(true);
    expect(matchSet.set[1].matches(dst)).toBe(true);
    expect(matchSet.set.length).toBe(2);

    var key = {Ethernet:{
      Dst: dst,
      Src: src
    }};

    expect(matchSet.match(key)).toBe(true);
    });

  it('MatchSet key exact fail', function(){
    var matchSet = new Noproto.MatchSet();
    var match1 = Protocols.mkMatch('Ethernet', 'Src', 'a:a:a:a:a:a', '');
    var match2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    var src = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:c');
    var dst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:b');

    matchSet.push(match1);
    matchSet.push(match2);
    expect(matchSet.set[0].matches(src)).toBe(false);
    expect(matchSet.set[1].matches(dst)).toBe(true);
    expect(matchSet.set.length).toBe(2);

    var key = {Ethernet:{
      Dst: dst,
      Src: src
    }};

    expect(matchSet.match(key)).toBe(false);
  });

  it('MatchSet key wildcard pass exact order', function(){
    var matchSet = new Noproto.MatchSet();
    var match1 = Protocols.mkMatch('Ethernet', 'Src', '0:0:0:0:0:0', '0:0:0:0:0:0');
    var match2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    var src = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:c');
    var dst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:b');

    matchSet.push(match1);
    matchSet.push(match2);
    expect(matchSet.set[0].matches(src)).toBe(true);

    var key = {Ethernet:{
      Dst: dst,
      Src: src
    }};

    expect(matchSet.match(key)).toBe(true);
  });

  it('MatchSet key wildcard pass ', function(){
    var matchSet = new Noproto.MatchSet();
    var match1 = Protocols.mkMatch('Ethernet', 'Src', '0:0:0:0:0:0', '0:0:0:0:0:0');
    var match2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    var match3 = Protocols.mkMatch('Ethernet', 'Type', '0x0800', '');
    var src = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:c');
    var dst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:b');
    var type = Protocols.mkFieldUInt('Ethernet', 'Type', '0x0800');

    matchSet.push(match3);
    matchSet.push(match1);
    matchSet.push(match2);
    expect(matchSet.set[0].matches(type)).toBe(true);

    var key = {Ethernet:{
      Dst: dst,
      Src: src,
      Type: type
    }};

    expect(matchSet.match(key)).toBe(true);
  });

  it('MatchSet key wildcard fail ', function(){
    var matchSet = new Noproto.MatchSet();
    var match1 = Protocols.mkMatch('Ethernet', 'Src', '0:0:0:0:0:0', '0:0:0:0:0:0');
    var match2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    var match3 = Protocols.mkMatch('Ethernet', 'Type', '0x0800', '');
    var src = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:c');
    var dst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:c');
    var type = Protocols.mkFieldUInt('Ethernet', 'Type', '0x0800');

    matchSet.push(match3);
    matchSet.push(match1);
    matchSet.push(match2);
    expect(matchSet.set[0].matches(type)).toBe(true);
    expect(matchSet.set[1].matches(src)).toBe(true);
    expect(matchSet.set[2].matches(dst)).toBe(false);

    var key = {Ethernet:{
      Dst: dst,
      Src: src,
      Type: type
    }};

    expect(matchSet.match(key)).toBe(false);
  });

  it('MatchSet empty pass ', function(){
    var matchSet = new Noproto.MatchSet();
    var src = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:a:a:a:a:c');
    var dst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:c');
    var type = Protocols.mkFieldUInt('Ethernet', 'Type', '0x0800');

    var key = {Ethernet:{
      Dst: dst,
      Src: src,
      Type: type
    }};

    expect(matchSet.match(key)).toBe(true);
  });

  it('MatchSet key internal wildcard pass exact order', function(){
    var matchSet = new Noproto.MatchSet();
    var match1 = Protocols.mkMatch('Internal', 'In_Port', '1', '0');

    var int1 = Protocols.mkFieldUInt('Internal', 'In_Port', '1');

    matchSet.push(match1);
    expect(matchSet.set[0].matches(int1)).toBe(true);

    var key = {Internal: {In_Port: int1}};

    expect(matchSet.match(key)).toBe(true);
  });

  it('Action SetField', function(){

  });

});
