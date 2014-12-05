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


// store of value construction functions
var consFuncs = {};

// store of test functions
var testFuncs = {};

var toStringFuncs = {};

// test function store setter
function setTestFunction(protocol, field, func) {
  var key = protocol + '-' + field;
  testFuncs[key] = func;
}

// cons function store setter
function setConsFunction(protocol, field, func) {
  var key = protocol + '-' + field;
  consFuncs[key] = func;
}

// cons function store setter
function setToStringFunction(protocol, field, func) {
  var key = protocol + '-' + field;
  toStringFuncs[key] = func;
}

// test function store getter
function getTestFunction(protocol, field) {
  var key = protocol + '-' + field;
  if(!_(testFuncs).has(key)) {
    throw 'Bad testFunc key: '+ key;
  }
  return testFuncs[key];
}

// cons function store getter
function getConsFunction(protocol, field) {
  var key = protocol + '-' + field;
  if(!_(testFuncs).has(key)) {
    throw 'Bad consFunc key: '+ key;
  }
  return consFuncs[key];
}

// cons function store getter
function getToStringFunction(protocol, field) {
  var key = protocol + '-' + field;
  if(!_(toStringFuncs).has(key)) {
    throw 'Bad toStringFunc key: '+ key;
  }
  return toStringFuncs[key];
}

function Match(match, protocol, summary, field, bitwidth, tip, value, mask) {
  var consFunc;
  if(_(match).isObject()) {
    _.extend(this, match);
    this._match = match._match.clone();
  } else {
    // Store some of the metadata
    this.protocol     = protocol;
    this.summary      = summary;
    this.field        = field;
    this.bitwidth     = bitwidth;
    this.tip          = tip;
    // Remember the mask input
    this.value = value;
    this.mask  = mask;
    // If no mask, make it an exact match
    consFunc = getConsFunction(this.protocol, this.field);
    if(!mask || mask.length === 0) {
      this._match = UInt.mkExact(
        new UInt.UInt(null, consFunc(value), Math.ceil(this.bitwidth / 8))
      );
    } else {
      // otherwise use the mask
      this._match = new UInt.Match(null, 
        new UInt.UInt(null, consFunc(value), Math.ceil(this.bitwidth / 8)),
        new UInt.UInt(null, consFunc(mask), Math.ceil(this.bitwidth / 8))
      );
    }
  }
}

Match.prototype.clone = function() {
  return new Match(this);
};

Match.prototype.match = function(value) {
  return this._match.match(value);
};

function MatchProfile(mp, protocol, summary, field, bitwidth, tip, enabled, 
                      wildcardable, maskable) {
  if(_(mp).isObject()) {
    _.extend(this, mp);
  } else {
    // Fixed properties
    this.protocol = protocol;
    this.summary  = summary;
    this.field    = field;
    this.bitwidth = bitwidth;
    this.tip      = tip;
    // UI Editable properties
    this.enabled      = enabled;
    this.wildcardable = wildcardable;
    this.maskable     = maskable;
    this.maskableBits = '';
    
    // Attach the necessary tool tips -- profile
    this.enabledTip      = 'Enable/Disable '+this.tip+' matching';
    this.wildcardableTip = 'Enable/Disable '+this.tip+' wildcard matching';
    this.maskableTip     = 'Enable/Disable '+this.tip+' bitmask matching';
    this.maskableBitsTip = 'Indicate which bits are maskable';

    // Attach the necessary tool tips -- object cons
    this.valueTip = this.tip + ' to match against';
    this.maskTip  = 'Bitmask to use in match';
  }
  // Match Constructor
  this.mkType = function(value, mask) {
    return new Match(null, this.protocol, this.summary, this.field, 
                     this.bitwidth, this.tip, value, mask);
  };

  // Attach the necessary input test function -- profile
  this.maskableBitsTest = getTestFunction(this.protocol, this.field);

  // Attach the necessary input test function -- object cons
  this.valueTest = getTestFunction(this.protocol, this.field);
  this.maskTest  = getTestFunction(this.protocol, this.field);
}

MatchProfile.prototype.clone = function() {
  return new MatchProfile(this);
};

function Action(action, protocol, field, bitwidth, op, value) {
  var consFunc;
  if(_(action).isObject()) {
    _.extend(this, action);
  } else {
    this.protocol = protocol;
    this.field    = field;
    this.bitwidth = bitwidth;
    this.op       = op;

    // UI Editable property
    this.value  = value;

    consFunc = getConsFunction(this.protocol, this.field);
    this._value = new UInt.UInt(null, consFunc(this.value), 
                                Math.ceil(this.bitwidth / 8));
  }
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
  if(_(ap).isObject()) {
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
    // Attach the tool tip -- profile
    this.enabledTip = this.tip+' modification';
    // Attach the tool tip -- object cons
    this.valueTip = 'Value to set the '+this.tip;
  }
  // Action Constructor
  this.mkType = function(value) {
    return new Action(null, this.protocol, this.field, this.bitwidth, this.op, 
                      value);
  };

  // Attach the input test function -- object cons
  this.valueTest = getTestFunction(this.protocol, this.field);
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
  this.summary = params.shortName || this.name.toLowerCase().slice(0, 4);
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
  // String constructor function
  this.consStr = params.consStr || null;
  // Display string describing the field
  this.tip = params.tip || this.protocol + ' ' + this.name;
}

Field.prototype.attachDefaultFunctions = function() {
  // Attach a generic string input test function
  if(this.testStr === null) {
    this.testStr = UInt.is(this.bitwidth);
  }
  setTestFunction(this.protocol, this.name, this.testStr);
  // Attach a generic string value constructor
  if(this.consStr === null) {
    this.consStr = UInt.consStr(this.bitwidth);
  }
  setConsFunction(this.protocol, this.name, this.consStr);
  // Attach a generic toString function
  if(this.toString === null) {
    this.toString = UInt.toString(this.bitwidth);
  }
  setToStringFunction(this.protocol, this.name, this.toString);
};

Field.prototype.getMatchProfile = function() {
  return new MatchProfile(
    null,
    // Display names for the UI
    this.protocol,
    this.summary,
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
    field.protocol   = this.name;
    field.shortName  = this.shortName;
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
    result.push(this.getActionProfile('push'));
  }
  if(this.popable) {
    result.push(this.getActionProfile('pop'));
  }
  _(this.fields).each(function(field) {
    if(field.setable) {
      result.push(field.getActionProfile('set'));
    }
    if(field.decable) {
      result.push(field.getActionProfile('dec'));
    }
  });
  return result;
};

// Extraction

return {
  MatchProfile: MatchProfile,
  ActionProfile: ActionProfile,
  Protocol: Protocol
};

});

