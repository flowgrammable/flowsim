'use strict';

describe('Service: tables', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Tables;
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
  }));

  var Action;
  beforeEach(inject(function(_Action_){
    Action = _Action_;
  }));

  var Flow;
  beforeEach(inject(function(_Flow_){
    Flow = _Flow_;
  }));

  var Match;
  beforeEach(inject(function(_Match_){
    Match = _Match_;
  }));

  var Internals;
  beforeEach(inject(function(_INTERNALS_){
    Internals = _INTERNALS_;
  }));

  it('Tables profile construction Pass', function () {
    var tblProfile = new Tables.Profile();
  });

  it('Tables profile copy construction', function() {
    var tblProfile = new Tables.Profile();
    tblProfile.n_tables = 100;
    var tbl2 = new Tables.Profile(tblProfile);
    expect(tbl2.n_tables).toBe(100);
  });

  it('Tables profile json construction', function() {
    var tblProfile = new Tables.Profile();
    tblProfile.n_tables = 100;
    var j = JSON.stringify(tblProfile);
    var j_ = new Tables.Profile(JSON.parse(j));
    expect(j_.n_tables).toEqual(tblProfile.n_tables);
  });

  it('Tables profile rebuild', function() {
    var tblProfile = new Tables.Profile();
    expect(tblProfile.tables.length).toBe(8);

    tblProfile.n_tables = 2;
    tblProfile.rebuild();
    expect(tblProfile.tables.length).toBe(2);
    expect(tblProfile.n_tables).toBe(2);
    expect(tblProfile.tables[0].name).toBe('table0');
    expect(tblProfile.tables[1].name).toBe('table1');

    tblProfile.n_tables = 5;
    tblProfile.rebuild();
    expect(tblProfile.tables.length).toBe(5);
    expect(tblProfile.n_tables).toBe(5);
    expect(tblProfile.tables[0].name).toBe('table0');
    expect(tblProfile.tables[4].name).toBe('table4');

  });

  it('Table construction', function(){
    var tblProfile = new Tables.TableProfile(null, 0);
    var tbl = new Tables.Table(null, tblProfile);
  //  var pri = new Tables.Priority(null, 1);
    var out = new Action.Output(null, 2);

    var flow = new Flow.Flow(null, 1, tbl.capabilities);
    flow.ins.pushApply(out);
    expect(flow.ins.summarize()[0]).toBe('apply');
    tbl.add(1, flow);
    expect(tbl.priorities.length).toBe(1);
    expect(tbl.prioritiesPresent['1']).toBe(true);
    expect(tbl.priorities[0].flows.length).toBe(1);
    expect(tbl.priorities[0].flows[0].priority).toBe(1);

    var j = JSON.stringify(tbl);
    var j_ = new Tables.Table(JSON.parse(j));

    expect(j_.prioritiesPresent['1']).toBe(true);
    expect(j_.priorities[0].flows[0].priority).toBe(1);
  });

  it('Priority Construction', function(){
    var pri = new Tables.Priority(null, 1);
    expect(pri.priority).toBe(1);

    var j = JSON.stringify(pri);
    var j_ = new Tables.Priority(JSON.parse(j));

    expect(j_.priority).toBe(1);

  });

  it('Priority add flows', function(){
    var tblProfile = new Tables.TableProfile(null, 0);
    var tbl = new Tables.Table(null, tblProfile);
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1, tbl.capabilities );
    expect(pri.priority).toBe(1);

    pri.add(flow);
    expect(pri.flows.length).toBe(1);


    var j = JSON.stringify(pri);
    var j_ = new Tables.Priority(JSON.parse(j));

    expect(j_.priority).toBe(1);
    expect(j_.flows.length).toBe(1);

  });

  it('Priority remove flows', function(){
    var tblProfile = new Tables.TableProfile(null, 0);
    var tbl = new Tables.Table(null, tblProfile);
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1, tbl.capabilities );
    flow.match.push(new Match.Match(null, 'internals_port',
    Internals.mkPortMatch('0x01')));
    pri.add(flow);
    expect(pri.priority).toBe(1);
    expect(pri.flows.length).toBe(1);

    pri.del(flow);
    expect(pri.flows.length).toBe(0);

    var j = JSON.stringify(pri);
    var j_ = new Tables.Priority(JSON.parse(j));
    expect(j_.priority).toBe(1);
    expect(j_.flows.length).toBe(0);

    var flow2 = new Flow.Flow(null, 1, tbl.capabilities);
    var out = new Action.Output(null, 5);
    flow2.ins._apply.push(out);
    j_.add(flow);
    j_.add(flow2);
    expect(j_.flows.length).toBe(2);
    expect(j_.flows[1].ins._apply.actions.length).toBe(1);
    expect(j_.flows[0].ins._apply.actions.length).toBe(0);

    j_.del(flow2);
    expect(j_.flows.length).toBe(1);
    expect(j_.flows[0].ins._apply.actions.length).toBe(0);
  });

  it('Flow deletion', function(){
    var tblProfile = new Tables.TableProfile(null, 0);
    var tbl = new Tables.Table(null, tblProfile);
    //  var pri = new Tables.Priority(null, 1);
    var out = new Action.Output(null, 2);

    var flow = new Flow.Flow(null, 1, tbl.capabilities);
    flow.ins.pushApply(out);
    flow.match.push(new Match.Match(null, 'internals_port',
    Internals.mkPortMatch('0x01')));

    expect(flow.ins.summarize()[0]).toBe('apply');
    expect(flow.match.summarize()[0]).toBe('internals');
    tbl.add(1, flow);
    expect(tbl.priorities.length).toBe(1);
    expect(tbl.prioritiesPresent['1']).toBe(true);
    expect(tbl.priorities[0].flows.length).toBe(1);
    expect(tbl.priorities[0].flows[0].priority).toBe(1);

    var j = JSON.stringify(tbl);
    var j_ = new Tables.Table(JSON.parse(j));

  });

});
