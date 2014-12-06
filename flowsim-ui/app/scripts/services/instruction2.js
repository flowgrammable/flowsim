'use strict';

var gotoPattern = /^([0-9]+)(\.\.([0-9]+))?$/;

function gotoTest(v) { return gotoPattern.test(v); }

angular.module('flowsimUiApp')
  .factory('Instruction2', function(UInt, Protocols) {

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
      valueTip: 'Id of an existing Meter',
      valueTest: UInt.is(32)
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
      maskableBitsTip: 'Indicates which bits are writable in this table',
      maskableBitsTest: UInt.is(64)
    };
    this.goto_ = {
      name: 'Goto',
      enabled: true,
      tip: 'Advances processing to an indicated table',
      targets: [[1, 254]],
      targetTip: 'Inidcates which tables can be goto targets',
      targetTest: gotoTest
    };
  }
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

function Set(set, profile) {
  if(_(set).isObject()) {
  } else {
    this.meter = {
      name: 'Meter',
      enabled: false,
      value: '',
      tip: ''
    };
  }
}

Set.prototype.clone = function() {
  return new Set(this);
};

return {
  Profile: Profile,
  Set: Set
};

});
