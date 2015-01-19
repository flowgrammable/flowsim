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

// store of pretty printer functions
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
  }
  // If no mask, make it an exact match
  consFunc = getConsFunction(this.protocol, this.field);
  if(!this.mask || this.mask.length === 0) {
    this._match = UInt.mkExact(
      new UInt.UInt(null, consFunc(this.value), Math.ceil(this.bitwidth / 8))
    );
  } else {
    // otherwise use the mask
    this._match = new UInt.Match(null, 
      new UInt.UInt(null, consFunc(this.value), Math.ceil(this.bitwidth / 8)),
      new UInt.UInt(null, consFunc(this.mask), Math.ceil(this.bitwidth / 8))
    );
  }

}

Match.prototype.clone = function() {
  return new Match(this);
};

Match.prototype.equal = function(match) {
  return this.protocol === match.protocol &&
         this.field === match.field &&
         this.bitwidth === match.bitwidth &&
         this._match.equal(match._match);
};

Match.prototype.matches = function(value) {
  return this._match.match(value);
};

function Extractor(extractor, protocol, field) {
  if(_(extractor).isObject()) {
    _.extend(this, extractor);
  } else {
    this.protocol = protocol;
    this.field    = field;
  }
}

Extractor.prototype.clone = function() {
  return new Extractor(this);
};

Extractor.prototype.extract = function(key, fieldValue) {
  key[this.protocol][this.field] = fieldValue;
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
  }

  // Match Constructor
  this.mkType = function(value, mask) {
    return new Match(null, this.protocol, this.summary, this.field, 
                     this.bitwidth, this.tip, value, mask);
  };

  // Attach the necessary tool tips -- profile
  this.enabledTip      = 'Enable/Disable '+this.protocol+' '+this.tip+' matching';
  this.wildcardableTip = 'Enable/Disable '+this.protocol+' '+this.tip+' wildcard matching';
  this.maskableTip     = 'Enable/Disable '+this.protocol+' '+this.tip+' bitmask matching';
  this.maskableBitsTip = 'Indicate which bits are maskable';

  // Attach the necessary tool tips -- object cons
  this.valueTip = this.protocol+' '+this.tip + ' to match against';
  this.maskTip  = 'Bitmask to use in match';

  // Attach the necessary input test function -- profile
  this.maskableBitsTest = getTestFunction(this.protocol, this.field);

  // Attach the necessary input test function -- object cons
  this.valueTest = getTestFunction(this.protocol, this.field);
  this.maskTest  = getTestFunction(this.protocol, this.field);
}

MatchProfile.prototype.clone = function() {
  return new MatchProfile(this);
};

MatchProfile.prototype.toBase = function() {
  return {
    protocol: this.protocol,
    summary: this.summary,
    field: this.field,
    bitwidth: this.bitwidth,
    tip: this.tip,
    enabled: this.enabled,
    wildcardable: this.wildcardable,
    maskable: this.maskable,
    maskableBits: this.maskableBits
  };
};

// Array wrapper with some extra match-y operations
function MatchSet(ms) {
  if(_(ms).isObject()) {
    this.set = _(ms.set).map(function(match) {
      return new Match(match);
    });
  } else {
    this.set = [];
  }
}

MatchSet.prototype.clone = function() {
  return new MatchSet(this);
};

// Return a reference to the undrelying array
MatchSet.prototype.get = function() {
  return this.set;
};

// Push a new match into the set
MatchSet.prototype.push = function(match) {
  this.set.push(match);
};

// Pop the top of the set if non-empty
MatchSet.prototype.pop = function() {
  if(this.set.length > 0) {
    this.set.splice(-1,1);
  }
};

MatchSet.prototype.peekTop = function() {
  if(this.set.length === 0) {
    throw 'Failed to peekTop on empty MatchSet';
  }
  return this.set[this.set.length-1];
};

MatchSet.prototype.equal = function(matchSet) {
  var idx;
  var tmp;
  // Unequal lengths can't be equal
  if(this.set.length !== matchSet.set.length) { return false; }
  // Equal lengths and empty are equal
  if(this.set.length === 0) { return true; }
  // Look for strict equality
  for(idx=0; idx < this.set.length; ++idx) {
    tmp = _.findWhere(matchSet.set, {protocol: this.set[idx].protocol,
      field: this.set[idx].field});
    if(!this.set[idx].equal(tmp)){
      return false;
    }
  }
  return true;
};

MatchSet.prototype.match = function(key) {
  // The empty set matches everything

  if(this.set.length === 0) { return true; }
  return _(this.set).every(function(match) {
    return _(key).has(match.protocol) &&
           _(key[match.protocol]).has(match.field) &&
           match.matches(key[match.protocol][match.field]);
  });
};

MatchSet.prototype.summarize = function() {
  // Empty set is the default match '*'
  if(this.set.length === 0) { return ['*']; }
  // Otherwise build a unique list of shortNames/summaries
  return _(_(this.set).map(function(match) {
    return match.summary;
  })).unique();
};

MatchSet.prototype.toView = function () {
  // FIXME
  return [];
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
  }

  if(this.op === 'set'){
  consFunc = getConsFunction(this.protocol, this.field);
  this._value = new UInt.UInt(null, consFunc(this.value), 
                              Math.ceil(this.bitwidth / 8));
  }
}

Action.prototype.clone = function() {
  return new Action(this);
};

function handleInternal(action, dp, ctx){
  switch(action.field){
    case 'Output':
      ctx.output = action._value;
      dp.output(ctx.packet.clone(), action._value);
      break;
    case 'Group':
      ctx.group = action._value;
      dp.group(ctx.packet.clone(), action._value);
      break;
    case 'Queue':
      ctx.queue = action._value;
      break;
    default:
      break;
  }
}

Action.prototype.step = function(dp, ctx) {
  switch(this.op) {
    case 'set':
      if(this.protocol === 'Internal'){
        handleInternal(this, dp, ctx);
      } else {
        // copy the new field value
        ctx.packet.setField(this.protocol, this.field, this._value);
      }
      break;
    case 'push':
      // push an outer tag/label
      ctx.packet.pushTag(this.protocol);
      break;
    case 'pop':
      // pop an outer tag/label
      ctx.packet.popTag(this.protocol);
      break;
    case 'dec':
      ctx.packet.decField(this.protocol, this.field);
      // decrement a field
      break;
    case 'copy-in':
      ctx.packet.copyTTLIn(this.protocol);
      // copy an outer header ttl to an inner header
      break;
    case 'copy-out':
      ctx.packet.copyTTLOut(this.protocol);
      // copy a next to outer header ttl to the outer header
      break;
    default:
      throw 'Bad Action op: '+this.op;
  }
};

Action.prototype.toView = function(){
  var targetSym = this.protocol + this.field;
  return {
    op: this.op,
    target: targetSym,
    value: this.value
  };
};

function mkAction(protocol, field, op, bitwidth, value){
  var profile = new ActionProfile(null, protocol, field, 
        bitwidth, null, op);
  return profile.mkType(value);
}

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
  }
  // Action Constructor
  this.mkType = function(value) {
    return new Action(null, this.protocol, this.field, this.bitwidth, this.op, 
                      value);
  };

  // Attach the tool tip -- profile
  this.enabledTip = this.protocol+' '+this.tip+' modification';
  // Attach the tool tip -- object cons
  this.valueTip = 'Value to set the '+this.protocol+' '+this.tip;

  // Attach the input test function -- object cons
  if(this.field === 'tag') {
    // FIXME ... this is a hack
    this.valueTest = function() { return true; };
  } else {
    this.valueTest = getTestFunction(this.protocol, this.field);
  }
}

ActionProfile.prototype.clone = function() {
  return new ActionProfile(this);
};

ActionProfile.prototype.toBase = function() {
  return {
    protocol: this.protocol,
    field: this.field,
    bitwidth: this.bitwidth,
    tip: this.tip,
    op: this.op,
    enabled: this.enabled
  };
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
  // Can this field be copied in
  this.copyIn = params.copyIn || false;
  // Can this field be copied out
  this.copyOut = params.copyOut || false;
  // String input test function 
  this.testStr = params.testStr || null;
  // Display string conversion function
  this.dispStr = params.dispStr || null;
  // String constructor function
  this.consStr = params.consStr || null;
  // Display string describing the field
  this.tip = params.tip || this.name;
  // Does this field indicate payload?
  this.payloadField = params.payloadField || false;
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
  if(this.dispStr === null) {
    this.dispStr = UInt.toString(this.bitwidth);
  }
  setToStringFunction(this.protocol, this.name, this.dispStr);
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

Field.prototype.getExtractor = function() {
  return new Extractor(
    null,
    this.protocol,
    this.name
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

Protocol.prototype.getExtractions = function() {
  return _(this.fields).filter(function(field) {
    return field.matchable;
  }).map(function(field) {
    return field.getExtractor();
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
    if(field.copyIn) {
      result.push(field.getActionProfile('copy-in'));
    }
    if(field.copyOut) {
      result.push(field.getActionProfile('copy-out'));
    }
  });
  return result;
};

Protocol.prototype.clone = function(){
  return new Protocol(this);
};

var opPriority = {
  'copy-in': 10,
  'pop': 9,
  'push': 8,
  'copy-out': 7,
  'dec': 6,
  'set': 5,
};

// Extraction

return {
  MatchProfile: MatchProfile,
  MatchSet: MatchSet,
  Action: Action,
  mkAction: mkAction,
  ActionProfile: ActionProfile,
  Protocol: Protocol,
  opPriority: opPriority
};

});

