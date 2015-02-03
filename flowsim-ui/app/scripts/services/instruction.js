'use strict';

var gotoPattern = /^([0-9]+)(\.\.([0-9]+))?$/;

function gotoTest(v) { return gotoPattern.test(v); }

angular.module('flowsimUiApp')
  .factory('Instruction', function(UInt, Protocols, Noproto, Action, Errors) {

function Profile(profile) {
  if(_(profile).isObject()) {
    // Copy the simple properties
    this.meter    = new MeterProfile(profile.meter);
    this.apply    = new ApplyProfile(profile.apply);
    this.clear    = new ClearProfile(profile.clear);
    this.write    = new WriteProfile(profile.write);
    this.metadata = new MetadataProfile(profile.metadata);
    this.goto_    = new GotoProfile(profile.goto_);
  } else {
    this.meter = new MeterProfile();
    this.apply = new ApplyProfile();
    this.clear = new ClearProfile();
    this.write = new WriteProfile();
    this.metadata = new MetadataProfile();
    this.goto_ = new GotoProfile();
  }
  // Attach test functions in a uniform way regardless of data source
  this.meter.valueTest           = UInt.is(32);
  this.metadata.maskableBitsTest = UInt.is(64);
  this.goto_.targetTest          = gotoTest;
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

Profile.prototype.toBase = function() {
  return {
    meter: this.meter.toBase(),
    apply: this.apply.toBase(),
    clear: this.clear.toBase(),
    write: this.write.toBase(),
    metadata: this.metadata.toBase(),
    goto_: this.goto_.toBase()
  };
};

function GotoProfile(goto_){
  if(_.isObject(goto_)){
    _.extend(this, goto_);
    this.tagets = _(goto_.targets).map(function(target){
      return [target[0], target[1]];
    });
  } else {
    this.enabled = true;
    this.targets = [[1, 254]];
  }

  this.name = 'Goto';
  this.tip = 'Advances processing to an indicated table';
  this.targetTip = 'Indicates which tables can be goto targets';
  this.targetTest = gotoTest;
}

GotoProfile.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    targets: this.targets
  };
};

function MetadataProfile(metadata){
  if(_.isObject(metadata)){
    _.extend(this, metadata);
  } else {
    this.enabled = true;
    this.maskableBits = '0xffffffffffffffff';
  }

  this.name = 'Metadata';
  this.tip = 'Updates the masked bits of the metadata property in the packet key';
  this.maskableBitsTip = 'Indicates which bits are writable in this table';
  this.maskableBitsTest = UInt.is(64);
}

MetadataProfile.prototype.toBase = function(){
  return {
    enabled: this.enabled
  };
};

function WriteProfile(write){
  if(_.isObject(write)){
    _.extend(this, write);
    this.profiles = new Protocols.ActionProfiles(write.profiles);
  } else {
    this.enabled = true;
    this.profiles = new Protocols.ActionProfiles();
  }

  this.name = 'Write';
  this.tip = 'Merges action set with packet contexts action set';
}

WriteProfile.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    profiles: this.profiles.toBase()
  };
};

function ClearProfile(clear){
  if(_.isObject(clear)){
    _.extend(this, clear);
  } else {
    this.enabled = true;
  }

  this.name = 'Clear';
  this.tip = 'Clears packet contexts action set';
}

ClearProfile.prototype.toBase = function(){
  return {
    enabled: this.enabled
  };
};

function ApplyProfile(apply){
  if(_.isObject(apply)){
    _.extend(this, apply);
    this.profiles = new Protocols.ActionProfiles(apply.profiles);
  } else {
    this.enabled = true;
    this.profiles = new Protocols.ActionProfiles();
  }

  this.name = 'Apply';
  this.tip = 'Immediately executes action list';
}

ApplyProfile.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    profiles: this.profiles.toBase()
  };
};

function MeterProfile(meter){
  if(_.isObject(meter)){
    _.extend(this, meter);
  } else {
    this.enabled = true;
  }

  this.name = 'Meter';
  this.tip = 'Used to meter flow rates';
  this.valueTip = 'Id of an existing Meter';
  this.valueTest = UInt.is(32);
}

MeterProfile.prototype.toBase = function(){
  return {
    enabled: this.enabled
  };
};

function Meter(meter){
  if(_.isObject(meter)){
    _.extend(this, meter);
  } else {
    this.enabled = false;
    this.id = '';
  }
  this.name   = 'Meter';
  this.tip    = 'Used to meter flow rates';
  this.idTip  = 'Id of an existing Meter';
  this.idTest = UInt.is(32);
}

Meter.prototype.step = function(dp, ctx){
  var tarMtr = parseInt(this.id);
  //check for meter
  ctx.meter = tarMtr;
};

Meter.prototype.isValid = function(){
  return this.idTest(this.id);
};

Meter.prototype.toView = function(){
  return {
    name: this.name,
    shortName: 'm',
    tip: 'meter('+this.id+')',
    value: this.id
  };
};

Meter.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    id: this.id
  };
};

function Apply(apply){
  if(_.isObject(apply)){
    _.extend(this, apply);
    this.actions = _(apply.actions).map(function(action) {
      return new Noproto.Action(action);
    });
  } else {
    this.enabled = false;
    this.actions = [];
  }
  this.name = 'Apply';
  this.tip  = 'Immediately executes action list';
}

Apply.prototype.addAction = function(action){
  this.actions.push(action);
};

Apply.prototype.step = function(dp, ctx){
  var act;
  if(this.actions.length > 0){
    act = this.actions.shift();
    act.step(dp, ctx);
    if(act.field === 'Output'){
      dp.branchStage = 7;
    } else {
      dp.branchStage = 0;
    }
  }
};

Apply.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    actions: this.actions
  };
};


Apply.prototype.toView = function(){
  return {
    name: this.name,
    shortName: 'a',
    actions: _(this.actions).map(function(act){
      return act.toView();
    })
  };
};

function Clear(clear){
  if(_.isObject(clear)){
    _.extend(this, clear);
  } else {
    this.enabled = false;
  }
  this.name = 'Clear';
  this.tip  = 'Clears the packet contexts action set';
}

Clear.prototype.step = function(dp, ctx){
  ctx.actionSet.clear();
};

Clear.prototype.toView = function(){
  return {
    name: this.name,
    shortName: 'c'
  };
};

Clear.prototype.toBase = function(){
  return {
    enabled: this.enabled
  };
};

function Write(write){
  if(_.isObject(write)){
    _.extend(this, write);
    this.actions = new Action.Set(write.actions);
  } else {
    this.enabled = false;
    this.actions = new Action.Set();
  }
  this.name = 'Write';
  this.tip  = 'Merges action set with packet contexts action set';
}

Write.prototype.step = function(dp, ctx){
  // write action to ctx actionSet
  var act;
  if(!this.actions.isEmpty()){
    act = this.actions.actions.shift();
    ctx.actionSet.add(act);
  }
};

Write.prototype.addAction = function(action){
  this.actions.add(action);
};

Write.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    actions: this.actions.toBase()
  };
};

Write.prototype.toView = function(){
  return {
    name: this.name,
    shortName: 'w',
    actions: _(this.actions.actions).map(function(act){
      return act.toView();
    })
  };
};

function Metadata(meta){
  if(_.isObject(meta)){
    this.enabled = meta.enabled;
    if(_.isObject(meta.value)){
      this.value = new UInt.UInt(meta.value);
    } else {
      this.value = '';
    }
    if(_.isObject(meta.mask)){
      this.mask = new UInt.UInt(meta.mask);
    } else {
      this.mask = '';
    }
  } else {
    this.enabled = false;
    this.value = '';
    this.mask = '';
  }
  this.name      = 'Metadata';
  this.tip       = 'Updates the masked bits of the metadata property in the packet key';
  this.valueTip  = 'Value to write into the metadata register in the packet key';
  this.maskTip   = 'Mask to screen bits during write operation';  
  this.valueTest = UInt.is(64);
  this.maskTest  = UInt.is(64);
  this.consStr   = Protocols.getField('Internal', 'Metadata').consStr;
  this.profileTest = function(maskCaps){
    // check that meter.mask is equal to mask defined in meter profile
    if(!this.mask.equal(new UInt.UInt(null, this.consStr(maskCaps), 8))){
      return false;
    }
    return true;
  };
}

Metadata.prototype.mkMaskedValue = function(value, mask){
  this.mkValue(value);
  this.mkMask(mask);
  this.value = this.value.and(this.mask); 
};

//Make value from string
Metadata.prototype.mkValue = function(str){
  this.value = new UInt.UInt(null, this.consStr(str), 8);
};

Metadata.prototype.mkMask = function(str){
  this.mask = new UInt.UInt(null, this.consStr(str), 8);
};

Metadata.prototype.step = function(dp, ctx){
  ctx.key.Internal.Metadata = this.value;
};

Metadata.prototype.toView = function(){
  return {
    name: this.name,
    shortName: 'md',
    tip: 'metadata(value='+this.value+',mask='+this.mask+')'
  };
};

Metadata.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    value: this.value,
    mask: this.mask
  };
};

Metadata.prototype.isValid = function(){
  return this.enabled;
};

function Goto(goto_){
  if(_.isObject(goto_)){
    _.extend(this, goto_);
  } else {
    this.enabled = false;
    this.target = '';
  }
  this.name       = 'Goto';
  this.tip        = 'Advances processing to an indicated table';
  this.targetTip  = 'Table Id to target';
  this.targetTest = UInt.is(8);
}

Goto.prototype.step = function(dp, ctx){
  var targetTable = parseInt(this.target);
  // Check tables allowed to transition to
  var availTbls = dp.table.capabilities.instruction.goto_.targets;

  if(targetTable > dp.tables.length){
    throw Errors.goToNoTable(targetTable);
  } else if(targetTable <= dp.table.id){
    throw Errors.goToBackwards(dp.table.id, targetTable);
  } else if(targetTable === dp.table.id){
    throw Errors.goToRange(dp.table.id, targetTable);
  } else {
    var tblsInRange = _(availTbls).filter(function(range){
      if(targetTable >= range[0] && targetTable <= range[1]){
        return true;
      }
    });
    if(!tblsInRange.length){
      throw Errors.goToRange(dp.table.id, targetTable);
    }
  }
  ctx._nxtTable = parseInt(this.target);
};

Goto.prototype.toBase = function(){
  return {
    enabled: this.enabled,
    target: this.target
  };
};

Goto.prototype.toView = function(){
  return {
    name: this.name,
    shortName: 'g',
    tip: 'goto('+this.target+')'
  };
};

Goto.prototype.tableTest = function(tarVal, caps){
  if(!this.targetTest(tarVal)){
    return false;
  }
  var tarTbl = parseInt(tarVal);

  var availTbls = caps.instruction.goto_.targets;
  if(tarTbl >= caps.n_tables){
    return Errors.goToNoTable(tarTbl);
  } else if(tarTbl === caps.id){
    console.log('cannot target table with same id');
    return 'Cannot target current table';
  } else if(tarTbl <= caps.id ){
    console.log('cannot target table with id less than current table');
    return Errors.goToBackwards(caps.id, tarTbl);
  } else {
    var tblsInRange = _(availTbls).filter(function(range){
      if(tarTbl >= range[0] && tarTbl <= range[1]){
        return true;
      }
    });
    if(!tblsInRange.length){
      console.log('cannot target table out of goto profile range');
      return Errors.goToRange(caps.id, tarTbl);
    }
  }
  return true;
};

Goto.prototype.isValid = function(){
  return this.target.length > 0;
};

function Set(set) {
  if(_(set).isObject()) {
    // Copy the simple properties
    this.meter    = new Meter(set.meter);
    this.apply    = new Apply(set.apply);
    this.clear    = new Clear(set.clear);
    this.write    = new Write(set.write);
    this.metadata = new Metadata(set.metadata);
    this.goto_     = new Goto(set.goto_);
  } else {
    // Create a local copy of the set capabilities
    this.meter = new Meter();
    this.apply = new Apply();
    this.clear = new Clear();
    this.write = new Write();
    this.metadata = new Metadata();
    this.goto_ = new Goto();
  }
}

Set.prototype.toBase = function(){
  return {
    meter: this.meter.toBase(),
    apply: this.apply.toBase(),
    clear: this.clear.toBase(),
    write: this.write.toBase(),
    metadata: this.metadata.toBase(),
    goto_: this.goto_.toBase()
  };
};

Set.prototype.clone = function() {
  return new Set(this);
};

Set.prototype.step = function (dp, ctx) {
  if(this.meter.enabled) {
    //FIXME
    this.meter.step(dp, ctx);
    this.meter.enabled = false;
  } else if(this.apply.enabled) {
    //FIXME
    this.apply.step(dp, ctx);
    if(this.apply.actions.length === 0){
      this.apply.enabled = false;
    }
  } else if(this.clear.enabled) {
    //FIXME
    this.clear.step(dp, ctx);
    this.clear.enabled = false;
  } else if(this.write.enabled) {
    //FIXME
    this.write.step(dp, ctx);
    if(this.write.actions.isEmpty()) { 
      this.write.enabled = false; 
    }
  } else if(this.metadata.enabled) {
    //FIXME
    this.metadata.step(dp, ctx);
    this.metadata.enabled = false;
  } else if(this.goto_.enabled) {
    //FIXME
    this.goto_.step(dp, ctx);
    this.goto_.enabled = false;
  }
};

Set.prototype.toView = function() {
  var view = [];
  if(this.meter.enabled) {
  //FIXME
  view.push(this.meter.toView());
  }
  if(this.apply.enabled) {
  //FIXME
  view.push(this.apply.toView());
  }
  if(this.clear.enabled) {
  //FIXME
  view.push(this.clear.toView());
  }
  if(this.write.enabled) {
  //FIXME
  view.push(this.write.toView());
  }
  if(this.metadata.enabled) {
  //FIXME
  view.push(this.metadata.toView());
  }
  if(this.goto_.enabled) {
  //FIXME
  view.push(this.goto_.toView());
  }
  return view;
};

Set.prototype.summarize = function() {
  var result = [];
  if(this.meter.enabled) {
    result.push(this.meter.name.toLowerCase());
  }
  if(this.apply.enabled) {
    result.push(this.apply.name.toLowerCase());
  }
  if(this.clear.enabled) {
    result.push(this.clear.name.toLowerCase());
  }
  if(this.write.enabled) {
    result.push(this.write.name.toLowerCase());
  }
  if(this.metadata.enabled) {
    result.push(this.metadata.name.toLowerCase());
  }
  if(this.goto_.enabled) {
    result.push(this.goto_.name.toLowerCase());
  }
  return result;
};

Set.prototype.isEmpty = function(){
  return !this.meter.enabled && !this.apply.enabled && 
  !this.clear.enabled && !this.write.enabled && 
  !this.metadata.enabled && !this.goto_.enabled;
};

Set.prototype.isValid = function(){
  if(this.meter.enabled && !this.meter.isValid()){
    return false;
  }
  if(this.goto_.enabled && !this.goto_.isValid()){
    return false;
  }
  return true;
};

return {
  Profile: Profile,
  Set: Set
};

});
