'use strict';

describe('Service: flow', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Flow;
  beforeEach(inject(function (_Flow_) {
    Flow = _Flow_;
  }));

  var Tables;
  var tableProf;
  var Protocols;
  beforeEach(inject(function (_Tables_, _Protocols_) {
    Tables = _Tables_;
    Protocols = _Protocols_;
    tableProf = new Tables.TableProfile(null, 0);
  }));

  it('Flow construction test', function(){
    var flow = new Flow.Flow(null, 0);

    var j = JSON.stringify(flow);
    var j_ = new Flow.Flow(JSON.parse(j));

    expect(j_.priority).toBe(0);

  });


  it('Flow empty match equality Pass', function(){
    var flow1 = new Flow.Flow(null, 0);
    var flow2 = new Flow.Flow(null, 0);

    expect(flow1.equal(flow2)).toBe(true);
  });

  it('Flow strict equality match pass', function(){
    var flow1 = new Flow.Flow(null, 0);
    var flow2 = new Flow.Flow(null, 0);
    var protoFields = Protocols.Protocols[1].getMatchProfiles();
    flow1.match.set.push(protoFields[0].mkType('aa:bb:cc:dd:ee:ff', ''));
    flow1.match.set.push(protoFields[1].mkType('cc:cc:cc:cc:cc:cc', ''));

    flow2.match.set.push(protoFields[1].mkType('cc:cc:cc:cc:cc:cc', ''));
    flow2.match.set.push(protoFields[0].mkType('aa:bb:cc:dd:ee:ff', ''));

    expect(flow2.equal(flow1)).toBe(true);

  });

  it('Flow equality Fail', function(){
    var flow1 = new Flow.Flow(null, 0);
    var flow2 = new Flow.Flow(null, 0);
    var protoFields = Protocols.Protocols[1].getMatchProfiles();
    flow1.match.set.push(protoFields[1].mkType('cc:cc:cc:cc:cc:cc', ''));
    flow1.match.set.push(protoFields[0].mkType('aa:bb:cc:dd:ee:ff', ''));

    flow2.match.set.push(protoFields[1].mkType('cc:cc:cc:cc:cc:cc', ''));
    flow2.match.set.push(protoFields[0].mkType('aa:bb:cc:dd:ee:ff', ''));

    flow2.match.set.pop();
    expect(flow2.equal(flow1)).toBe(false);
    expect(flow1.equal(flow2)).toBe(false);
  });

});
