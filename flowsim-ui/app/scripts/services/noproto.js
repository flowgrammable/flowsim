'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.noproto
 * @description
 * # noproto
 * Service in the flowsimUiApp.
 */

angular.module('flowsimUiApp')
  .factory('Noproto', function(UInt) {

function MatchProfile(mp, protocol, field, tip, enabled, wildcardable, 
                      maskable) {
  if(_(mp).isObject) {
    _.extend(this, mp);
  } else {
    // Fixed properties
    this.protocol = protocol;
    this.field    = field;
    this.tip      = tip;
    // UI Editable properties
    this.enabled      = enabled;
    this.wildcardable = wildcardable;
    this.maskable     = maskable;
    this.maskableBits = '';
  }
}

MatchProfile.prototype.clone = function() {
  return new MatchProfile(this);
};

function ActionProfile(ap, protocol, field, tip, enabled) {
  if(_(ap).isObject) {
    _.extend(this, ap);
  } else {
    // Fiexed properties
    this.protocol = protocol;
    this.field    = field;
    this.tip      = tip;
    // UI Editable properties
    this.enabled = enabled;
  }
}

ActionProfile.prototype.clone = function() {
  return new ActionProfile(this);
};

function Field(params) {
  if(!params.protocol) {
    throw 'Fail Construction: Field('+params.protocol+')';
  }
  if(!params.name) {
    throw 'Fail Construction: Field('+params.name+')';
  }
  if(!_(params.bitwidth).isFinite()) {
    throw 'Fail Construction: Field('+params.bitwidth+')';
  }
  // Display string about the parent protocol
  this.protocol = params.protocol;
  // Display string for this field
  this.name = params.name;
  // Display string that is small
  this.shortName = params.shortName || this.name.toLowerCase();
  // Bit precision of this field
  this.bitwidth = params.bitwidth;
  // Can this field be matched against
  this.matchable = params.matchable || false;
  // Can this field be modified
  this.setable = params.setable || false;
  // Can this feild be decremented
  this.decable = params.decable || false;
  // String input test function 
  this.testStr = params.testStr || null;
  // Display string conversion function
  this.toString = params.toString || null;
  // Display string describing the field
  this.tip = params.tip || this.protoName + ' ' + this.name;
}

Field.prototype.attachDefaultFunctions = function() {
  var bitwidth = this.bitwidth;
  // Attach a generic string input test function
  if(this.testStr === null) {
    this.testStr = UInt.is(this.bitwidth);
  }
  // Attach a generic toString function
  if(this.toString === null) {
    this.toString = function(value, base) {
      if(_(value).isArray) {
        return "0x"+_(value).map(function(octet) {
          return UInt.padZeros(octet.toString(16), 2);
        });
      } else if(_(value).isFinite()) {
        if(base === 16) {
          return '0x'+UInt.padZeros(value.toString(16), 2*(bitwidth/8));
        } else {
          return value.toString(base);
        }
      } else {
        throw 'toString on bad value: '+value;
      }
    };
  }
};

Field.prototype.getMatchProfile = function() {
  return new MatchProfile(
    // Display names for the UI
    this.protocol,
    this.name,
    this.tip,
    // Default enable the match
    true,   // available
    true,   // wildcardable
    true    // bit maskable
  );
};

Field.prototype.getActionProfile = function() {
  return new ActionProfile(
    // Display names for the UI
    this.protocol,
    this.name,
    this.tip,
    // Default enable the action
    true
  );
};

function Protocol(params) {
  // Display string of the protocol
  this.name = params.name;
  // Display string that is small
  this.shortName = params.shortName || this.name.toLowerCase();
  // Size of the protocol in bytes
  this.bytes = params.bytes;
  // Can this protocol be tag/label pushed
  this.pushable = params.pushable || false;
  // Can this protocol be tag/label popped
  this.popable = params.popable || false;
  // Construct the protocol fields
  this.fields = _(params.fields).map(function(field) {
    field.protoName = this.name;
    return new Field(field);
  }, this);
  // Attach a name/key for each field
  _(this.fields).each(function(field) {
    if(_(this).has(field.name)) {
      throw 'Duplicate Field: '+this.name+'('+field.name+')';
    }
    this[field.name] = field;
    // Attach default functions if none where provided
    field.attachDefaultFunctions();
  }, this);
}

Protocol.prototype.getMatchProfiles = function() {
  return _(this.fields).filter(function(field) {
    return field.matchable;
  }).map(function(field) {
    return field.getMatchProfile();
  });
};

Protocol.prototype.getActionProfiles = function() {
  var result = [];
  if(this.pushable) {
    //FIXME
    //result.concat();
  }
  if(this.popable) {
    //FIXME
    //result.concat();
  }
  result.concat(_(this.fields).filter(function(field) {
    return field.setable || field.decable;
  }).map(function(field) {
    return field.getActionProfile();
  }));
  return result;
};

// Extraction

// Action

return {
  Protocol: Protocol
};

});
