'use strict';

describe('Service: dataplane', function() {
  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Dataplane;
  beforeEach(inject(function (_Dataplane_) {
    Dataplane = _Dataplane_;
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

  var Flow;
  beforeEach(inject(function (_Flow_) {
    Flow = _Flow_;
  }));

  var Tables;
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
  }));

  var Profile;
  beforeEach(inject(function (_Profile_) {
    Profile = _Profile_;
  }));

  var Switch_;
  beforeEach(inject(function(_Switch_) {
    Switch_ = _Switch_;
  }));

  it('Device construction Pass', function(){
      var prof = Profile.create('test profile name');
      var swi = Switch_.create(null, prof);

      var dp = new Dataplane.Dataplane(swi);
  });


  it('Device construction Fail', function(){
      expect(function() {
      var dp = new Dataplane.Dataplane();
      }).toThrow();
  });


  it('Device construction Pass', function(){
      var prof = Profile.create('test profile name');
      var swi = Switch_.create(null, prof);

      var dp = new Dataplane.Dataplane(swi);
  });

});
