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
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
    tableProf = new Tables.TableProfile(null, 0);
  }));

  it('Flow construction test', function(){
    var flow = new Flow.Flow(null, 0, tableProf);

    var j = JSON.stringify(flow);
    var j_ = new Flow.Flow(JSON.parse(j));

    expect(j_.priority).toBe(0);

  });


  it('Flow empty match equality Pass', function(){
    var flow1 = new Flow.Flow(null, 0, tableProf);
    var flow2 = new Flow.Flow(null, 0, tableProf);

    expect(flow1.equal(flow2)).toBe(true);
  });

  it('Flow strict equality match pass', function(){
    var flow1 = new Flow.Flow(null, 0, tableProf);
    var flow2 = new Flow.Flow(null, 0, tableProf);

  });

  it('Flow equality Fail', function(){
    var tblProfile = new Tables.TableProfile(null, 0);
    var tbl = new Tables.Table(null, tblProfile);
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1, tbl.capabilities);
    var out = new Action.Output(null, 5);
    var flow2 = new Flow.Flow(null, 1, tbl.capabilities);
    flow.match.push(new Match.Match(null, 'internals_port',
    Internals.mkPortMatch('0x01')));
    flow2.ins._apply.actions.push(out);
    expect(flow2.ins._apply.actions.length).toBe(1);

    expect(flow.equal(flow2)).toBe(false);
  });

});
