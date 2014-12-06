'use strict';

var gotoPattern = /^([0-9]+)(\.\.([0-9]+))?$/;

function gotoTest(v) { return gotoPattern.test(v); }

angular.module('flowsimUiApp')
  .factory('Instruction2', function(UInt, Protocols, Noproto) {

function Profile(profile) {
  if(_(profile).isObject()) {
    // Copy the simple properties
    this.meter    = _.clone(profile.meter);
    this.apply    = _.clone(profile.apply);
    this.clear    = _.clone(profile.clear);
    this.write    = _.clone(profile.write);
    this.metadata = _.clone(profile.metadata);
    this.goto_    = _.clone(profile.goto_);
    // Copy construct the more detailed properties
    this.apply.profiles = new Protocols.ActionProfiles(profile.apply.profiles);
    this.write.profiles = new Protocols.ActionProfiles(profile.write.profiles);
    this.goto_.targets  = _(profile.goto_.targets).map(function(target) {
      return [target[0], target[1]];
    });
  } else {
    this.meter = {
      name: 'Meter',
      enabled: true,
      tip: 'Used to meter flow rates',
      valueTip: 'Id of an existing Meter'
    };
    this.apply = {
      name: 'Apply',
      enabled: true,
      tip: 'Immediately executes action list',
      profiles: new Protocols.ActionProfiles()
    };
    this.clear = {
      name: 'Clear',
      enabled: true,
      tip: 'Clears packet context\'s action set'
    };
    this.write = {
      name: 'Write',
      enabled: true,
      tip: 'Merges action set with packet context\'s action set',
      profiles: new Protocols.ActionProfiles()
    };
    this.metadata = {
      name: 'Metadata',
      enabled: true,
      tip: 'Updates the masked bits of the metadata property in the packet key',
      maskableBits: '0xffffffffffffffff',
      maskableBitsTip: 'Indicates which bits are writable in this table'
    };
    this.goto_ = {
      name: 'Goto',
      enabled: true,
      tip: 'Advances processing to an indicated table',
      targets: [[1, 254]],
      targetTip: 'Inidcates which tables can be goto targets'
    };
  }
  // Attach test functions in a uniform way regardless of data source
  this.meter.valueTest           = UInt.is(32);
  this.metadata.maskableBitsTest = UInt.is(64);
  this.goto_.targetTest          = gotoTest;
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

function Set(set, profile) {
  if(_(set).isObject()) {
    // Copy the set native capabilities
    this.profile  = new Profile(set.profile);
    // Copy the simple properties
    this.meter    = _.clone(set.meter);
    this.apply    = _.clone(set.apply);
    this.clear    = _.clone(set.clear);
    this.write    = _.clone(set.write);
    this.metadata = _.clone(set.metadata);
    this.goto_    = _.clone(set.goto_);
    // Copy construct the more detailed properties
    this.apply.actions = _(set.apply.actions).map(function(action) {
      return new Noproto.Action(action);
    });
    this.write.actions = _(set.write.actions).map(function(action) {
      return new Noproto.Action(action);
    });
  } else {
    // Create a local copy of the set capabilities
    this.profile = profile.clone();
    this.meter = {
      name: 'Meter',
      enabled: false,
      tip: 'Used to meter flow rates',
      id: '',
      idTip: 'Id of an existing Meter'
    };
    this.apply = {
      name: 'Apply',
      enabled: false,
      tip: 'Immediately executes action list',
      actions: []
    };
    this.clear = {
      name: 'Clear',
      enabled: false,
      tip: 'Clears packet context\'s action set'
    };
    this.write = {
      name: 'Write',
      enabled: false,
      tip: 'Merges action set with packet context\'s action set',
      actions: []
    };
    this.metadata = {
      name: 'Metadata',
      enabled: false,
      tip: 'Updates the masked bits of the metadata property in the packet key',
      value: '',
      mask: '',
      valueTip: 'Value to write into the metadata register in the packet key',
      maskTip: 'Mask to screen bits during write operation'
    };
    this.goto_ = {
      name: 'Goto',
      enabled: false,
      tip: 'Advances processing to an indicated table',
      target: '',
      targetTip: 'Table Id to target'
    };
  }
  // Attach test functions in a uniform matter, regardless of source
  this.meter.idTest       = UInt.is(32);
  this.metadata.valueTest = UInt.is(64);
  this.metadata.maskTest  = UInt.is(64);
  this.goto_.targetTest   = UInt.is(8);
}

Set.prototype.clone = function() {
  return new Set(this);
};

Set.prototype.step = function (dp, ctx) {
  if(this.meter.enabled) {
    //FIXME
    this.meter.enabled = false;
  } else if(this.apply.enabled) {
    //FIXME
    if(this.apply.actions.length === 0) { 
      this.apply.enabled = false; 
    }
  } else if(this.clear.enabled) {
    //FIXME
    this.clear.enabled = false;
  } else if(this.write.enabled) {
    //FIXME
    if(this.write.actions.length === 0) { 
      this.write.enabled = false; 
    }
  } else if(this.metadata.enabled) {
    //FIXME
    this.metadata.enabled = false;
  } else if(this.goto_.enabled) {
    //FIXME
    this.goto_.enabled = false;
  }
};

Set.prototype.toView = function() {
  if(this.meter.enabled) {
  //FIXME
  }
  if(this.apply.enabled) {
  //FIXME
  }
  if(this.clear.enabled) {
  //FIXME
  }
  if(this.write.enabled) {
  //FIXME
  }
  if(this.metadata.enabled) {
  //FIXME
  }
  if(this.goto_.enabled) {
  //FIXME
  }
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

return {
  Profile: Profile,
  Set: Set
};

});
