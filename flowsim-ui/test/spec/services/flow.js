'use strict';

describe('Service: flow', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Flow;
  beforeEach(inject(function (_Flow_) {
    Flow = _Flow_;
  }));

  var Action;
  beforeEach(inject(function (_Action_) {
    Action = _Action_;
  }));

  var Tables;
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
  }));

  var Match;
  beforeEach(inject(function(_Match_){
    Match = _Match_;
  }));

  var Internals;
  beforeEach(inject(function(_INTERNALS_){
    Internals = _INTERNALS_;
  }));

  it('Flow construction test', function(){
    var flow = new Flow.Flow(null, 0, {});
    var out = new Action.Output(null, 1);

    flow.ins.pushApply(out);
    expect(flow.ins._apply.actions.length).toBe(1);
    expect(flow.ins._apply.actions[0].toValue()).toBe(1);

    var j = JSON.stringify(flow);
    var j_ = new Flow.Flow(JSON.parse(j));

    expect(j_.ins._apply.actions.length).toBe(1);
    expect(j_.ins._apply.actions[0].toValue()).toBe(1);

  });

  it('Priority construction test', function(){
    var flow = new Flow.Flow(null, 1, {});
    var out = new Action.Output(null, 1);
    flow.ins.pushApply(out);

    var priority = new Tables.Priority(null, 1);
    priority.add(flow);
    expect(priority.flows.length).toBe(1);


    var j = JSON.stringify(priority);
    var j_ = new Tables.Priority(JSON.parse(j));

    expect(j_.flows.length).toBe(1);

    expect(j_.flows[0].ins._apply.actions[0].toValue()).toBe(1);
  });

  it('Flow equality Pass', function(){
    var tblProfile = new Tables.TableProfile(null, 0);
    var tbl = new Tables.Table(null, tblProfile);
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1, tbl.capabilities);
    var flow2 = new Flow.Flow(null, 1, tbl.capabilities);
    flow.match.push(new Match.Match(null, 'internals_port',
      Internals.mkPortMatch('0x01')));

    flow2.match.push(new Match.Match(null, 'internals_port',
    Internals.mkPortMatch('0x01')));

    expect(flow.equal(flow2)).toBe(true);
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
