'use strict';

angular.module('flowsimUiApp')
  .factory('UInt', function() {

var Pattern = /^(0x)?[0-9a-fA-F]+$/;

function howManyBits(val) {
  if(val === 0) { return 1; }
  return Math.floor((Math.log(val) / Math.LN2) + 1);
}

function howManyBytes(val) {
  if(val === 0) { return 1; }
  return Math.ceil(howManyBits(val) / 8);
}
      
function maxFromBits(val) {
  return Math.ceil(Math.pow(2, val) - 1);
}

function maxFromBytes(val) {
  return Math.ceil(maxFromBits(8*val));
}

function UInt(uint, value, bytes) {
  if(_.isObject(uint)) {
    _.extend(this, uint);
  } else if(_.isString(value) && Pattern.test(value)) {
    this.value = parseInt(value);
    this.bytes = 4;
  } else if(_.isArray(value)) {
    this.value = value;
    this.bytes = bytes ? _.max([bytes, value.length]) : value.length;
  } else if(_.isFinite(value) && (value % 1 === 0)) {
    this.value = value;
    this.bytes = bytes ? bytes : 4;
  } else if(bytes && bytes > 0) {
    if(bytes < 5) {
      this.value = 0;
      this.bytes = bytes;
    } else {
      this.value = _(bytes).times(function() { return 0; });
      this.bytes = bytes;
    }
  } else {
    throw 'UInt('+uint+', '+value+', '+bytes+')';
  }
}

UInt.prototype.toString = function(base) {
  if(this.bytes < 5) {
    return this.value.toString(base);
  } else {
    return _(this.value).map(function(v) { 
      return v.toString(base); 
    });
  }
};

function equal(lhs, rhs) {
  return lhs.bytes === rhs.bytes && _.isEqual(lhs, rhs);
}

function neg(val) {
  if(val.bytes < 5) {
    return new UInt(null, ~val.value, 4);
  } else {
    return new UInt(null, _(val.bytes).times(function(i) {
      return ~val.value[i];
    }), val.bytes);
  }
}

function and(lhs, rhs) {
  if(lhs.bytes !== rhs.bytes) {
    throw 'mask('+lhs.bytes+', '+rhs.bytes+')';
  }
  if(lhs.bytes < 5) {
    return new UInt(null, lhs.value & rhs.value, 4);
  } else {
    return new UInt(null, _(lhs.bytes).times(function(i) {
      return lhs.value[i] & rhs.value[i];
    }), lhs.bytes);
  }
}

function or(lhs, rhs) {
  if(lhs.bytes !== rhs.bytes) {
    throw 'mask('+lhs.bytes+', '+rhs.bytes+')';
  }
  if(lhs.bytes < 5) {
    return new UInt(null, lhs.value | rhs.value, 4);
  } else {
    return new UInt(null, _(lhs.bytes).times(function(i) {
      return lhs.value[i] | rhs.value[i];
    }), lhs.bytes);
  }
}

function xor(lhs, rhs) {
  if(lhs.bytes !== rhs.bytes) {
    throw 'mask('+lhs.bytes+', '+rhs.bytes+')';
  }
  if(lhs.bytes < 5) {
    return new UInt(null, lhs.value ^ rhs.value, 4);
  } else {
    return new UInt(null, _(lhs.bytes).times(function(i) {
      return lhs.value[i] ^ rhs.value[i];
    }), lhs.bytes);
  }
}

function Match(match, value, mask) {
  if(_.isObject(match)) {
    this.value = new UInt(match.value);
    this.mask  = new UInt(match.mask);
  } else if(value.bytes === mask.bytes) {
    this.value = new UInt(value);
    this.mask  = new UInt(mask);
  } else {
    throw 'Match('+match+', '+value+', '+mask+')';
  }
}

Match.prototype.match = function(val) {
  if(this.value.bytes !== val.bytes) {
    throw 'Match.match';
  } else if(this.value.bytes < 5) {
    return (val.value & this.mask.value) === this.value.value;
  } else {
    return _.reduce(_.zip(val.value, this.mask.value, this.value.value),
      function(triple) {
        return (triple[0] & triple[1]) === triple[2]; 
      }, true);
  }
};

return {
  UInt: UInt,
  and: and,
  or: or,
  xor: xor,
  neg: neg,
  equal: equal,
  Match: Match
};

});
