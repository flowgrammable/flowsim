'use strict';

describe('Service: Tables', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Tables;
  var tableProfile;
  var Flow;
  beforeEach(inject(function (_Tables_, _Flow_) {
    Tables = _Tables_;
    Flow = _Flow_;
    tableProfile = new Tables.TableProfile(null, 0);
  }));

  it('Priority construction test', function(){
    var pri = new Tables.Priority(null, 1);
    expect(pri.priority).toBe(1);
    expect(pri.flows.length).toBe(0);
  });

  it('Priority add flow test', function(){
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1, tableProfile);

    pri.add(flow);
    expect(pri.flows.length).toBe(1);
  });

  it('Priority delete flow test', function(){
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1, tableProfile);

    pri.add(flow);
    expect(pri.flows.length).toBe(1);
    pri.del(flow);
    expect(pri.flows.length).toBe(0);
  });


  it('Table construction test', function(){
    var table = new Tables.Table(null, tableProfile);
    var j = table.toBase();
    var t2 = new Tables.Table(j);
    expect(t2.priorities.length).toBe(0);
  });

  it('Table insert flow pass', function(){
    var table = new Tables.Table(null, tableProfile);
    var f = new Flow.Flow(null, 1, tableProfile);
  });

});
