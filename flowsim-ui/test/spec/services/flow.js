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

});
