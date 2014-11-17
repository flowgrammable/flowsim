'use strict';

ddescribe('Service: dataplane', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var dataplane;
  beforeEach(inject(function (_Dataplane_) {
    dataplane = _Dataplane_;
  }));

  var Instruction;
  beforeEach(inject(function (_Instruction_) {
    Instruction = _Instruction_;
  }));

  var Action;
  beforeEach(inject(function (_Action_) {
    Action = _Action_;
  }));

  var fgConstraints;
  beforeEach(inject(function (_fgConstraints_) {
    fgConstraints = _fgConstraints_;
  }));

  var IPV4;
  beforeEach(inject(function (_IPV4_) {
    IPV4 = _IPV4_;
  }));

  var Flow;
  beforeEach(inject(function (_Flow_) {
    Flow = _Flow_;
  }));

  var Tables;
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
  }));

  it('Output action construction', function(){
    var out = new Action.Output(null, 1);
    expect(out.toValue()).toBe(1);

    var j = JSON.stringify(out);
    var j_ = new Action.Output(JSON.parse(j));

    expect(j_.toValue()).toBe(1);
  });

  it('Apply Instruction construction', function(){
    var out = new Action.Output(null, 1);
    var app = new Instruction.Apply();

    expect(app.actions.length).toBe(0);
    app.push(out);
    expect(app.actions.length).toBe(1);

    var j = JSON.stringify(app);

    var j_ = new Instruction.Apply(JSON.parse(j));

    expect(j_.actions[0].toValue()).toBe(1);

  });


  it('Instruction Set Construction', function(){
    var out = new Action.Output(null, 1);
    var app = new Instruction.Apply();
    app.push(out);
    expect(app.actions.length).toBe(1);

    var set = new Instruction.Set();
    set.apply(app);
    expect(set.apply().actions.length).toBe(1);

    var j = JSON.stringify(set);
    var j_ = new Instruction.Set(JSON.parse(j));

    expect(j_.apply().actions.length).toBe(1);
    expect(j_.apply().actions[0].toValue()).toBe(1);
  });

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

  it('Table construction test', function(){

  });




  it('ActionField_UI construction', function(){
    var af = new Action.ActionField_UI(null,
      'Internal', 'Output', 'forward', Action.Output, 'Egress port id',
        fgConstraints.isUInt(0,0xffff));

    var j = JSON.stringify(af);
    var j_ = new Action.ActionField_UI(JSON.parse(j));

    expect(j_.category).toBe('Internal');
    expect(j_.name).toBe('Output');
    expect(j_.key).toBe('forward');
  });

});
