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

var testFuncs = {};

function setTestFunction(protocol, field, func, profile) {
  var key = protocol + '-' + field + (profile ? '-profile' : '');
  testFuncs[key] = func;
}

function getTestFunction(protocol, field, profile) {
  var key = protocol + '-' + field + (profile ? '-profile' : '');
  if(!_(testFuncs).has(key)) {
    throw 'Bad testFunc key: '+ key;
  }
  return testFuncs[key];
}

function Match(match, protocol, field, bitwidth, tip, wildcardable, maskable, 
               value, mask) {
  if(_(match).isObject) {
    _.extend(this, match);
    this._match = match._match.clone();
  } else {
    // Store some of the metadata
    this.protocol     = protocol;
    this.field        = field;
    this.bitwidth     = bitwidth;
    this.tip          = tip;
    this.wildcardable = wildcardable;
    this.maskable     = maskable;
    // Remember the mask input
    this.value = value;
    this.mask  = mask;
    // If no mask, make it an exact match
    if(!mask || mask.length === 0) {
      this._match = UInt.mkExact(
        new UInt.UInt(null, value, Math.ceil(this.bitwidth / 8))
      );
    } else {
      // otherwise use the mask
      this._match = new UInt.Match(null, 
        new UInt.UInt(null, value, Math.ceil(this.bitwidth / 8)),
        new UInt.UInt(null, mask, Math.ceil(this.bitwidth / 8))
      );
    }
    
    // Attach the necessary tool tips
    this.valueTip = this.tip + ' to match against';
    this.maskTip  = 'Bitmask to use in match';
  }

  // Set the input test functions
  this.valueTest = getTestFunction(this.protocol, this.field);
  this.maskTest  = getTestFunction(this.protocol, this.field);
}

Match.prototype.clone = function() {
  return new Match(this);
};

Match.prototype.match = function(value) {
  return this._match.match(value);
};

function MatchProfile(mp, protocol, field, bitwidth, tip, enabled, wildcardable,
                      maskable) {
  if(_(mp).isObject) {
    _.extend(this, mp);
  } else {
    // Fixed properties
    this.protocol = protocol;
    this.field    = field;
    this.bitwidth = bitwidth;
    this.tip      = tip;
    // UI Editable properties
    this.enabled      = enabled;
    this.wildcardable = wildcardable;
    this.maskable     = maskable;
    this.maskableBits = '';
    
    // Attach the necessary tool tips
    this.enabledTip      = this.tip+' matching';
    this.wildcardableTip = this.tip+' wildcard matching';
    this.maskableTip     = this.tip+' bitmask matching';
    this.maskableBitsTip = 'Indicate which bits are maskable';
  }
  // Match Constructor
  this.mkType = function(value, mask) {
    return new Match(null, this.protocol, this.field, this.bitwidth, this.tip,
                     value, mask);
  };

  // Attach the necessary input test function
  this.maskableBitsTest = getTestFunction(this.protocol, this.field, 'profile');
}

MatchProfile.prototype.clone = function() {
  return new MatchProfile(this);
};

function Action(action, protocol, field, bitwidth, op, value) {
  if(_(action).isObject) {
    _.extend(this, action);
  } else {
    this.protocol = protocol;
    this.field    = field;
    this.bitwidth = bitwidth;
    this.op       = op;

    this.value = value;

    // Attach the necessary tool tips
    this.valueTip = 'Value to set the '+this.tip;
  }

  // Attach the necessary test function
  this.valueTest = getTestFunction(this.protocol, this.field);
}

Action.prototype.clone = function() {
  return new Action(this);
};

Action.prototype.step = function(dp, ctx) {
  switch(this.op) {
    case 'set':
      // copy the new field value
      break;
    case 'push':
      // push an outer tag/label
      break;
    case 'pop':
      // pop an outer tag/label
      break;
    case 'dec':
      // decrement a field
      break;
    case 'copy-in':
      // copy an outer header ttl to an inner header
      break;
    case 'copy-out':
      // copy a next to outer header ttl to the outer header
      break;
    default:
      throw 'Bad Action op: '+this.op;
  }
};

function ActionProfile(ap, protocol, field, bitwidth, tip, op, enabled) {
  if(_(ap).isObject) {
    _.extend(this, ap);
  } else {
    // Fiexed properties
    this.protocol = protocol;
    this.field    = field;
    this.bitwidth = bitwidth;
    this.tip      = tip;
    this.op       = op;
    // UI Editable properties
    this.enabled = enabled;

    this.enabledTip = this.tip+' modification';
  }
  // Action Constructor
  this.mkType = function(value) {
    return new Action(null, this.protocol, this.field, this.bitwidth, this.op, 
                      value);
  };
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
        return '0x'+_(value).map(function(octet) {
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
    null,
    // Display names for the UI
    this.protocol,
    this.name,
    this.bitwidth,
    this.tip,
    // Default enable the match
    true,   // available
    true,   // wildcardable
    true    // bit maskable
  );
};

Field.prototype.getActionProfile = function(op) {
  return new ActionProfile(
    null,
    // Display names for the UI
    this.protocol,
    this.name,
    this.bitwidth,
    this.tip,
    op,
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

Protocol.prototype.getActionProfile = function(op) {
  return new ActionProfile(
    null,
    // Display names for the UI
    this.name,
    'tag',
    0,
    '',
    op,
    // Default enable the action
    true
  );
};

Protocol.prototype.getActionProfiles = function() {
  var result = [];
  if(this.pushable) {
    result.append(this.getActionProfile('push'));
  }
  if(this.popable) {
    result.append(this.getActionProfile('pop'));
  }
  _(this.fields).each(function(field) {
    if(field.setable) {
      result.append(field.getActionProfile('set'));
    }
    if(field.decable) {
      result.append(field.getActionProfile('dec'));
    }
  });
  return result;
};

// Extraction

return {
  Protocol: Protocol
};

});

