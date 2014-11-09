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

UInt.prototype.and = function(rhs) {
  if(this.bytes !== rhs.bytes) {
    throw '.and('+this.bytes+', '+rhs.bytes+')';
  }
  if(this.bytes < 5) {
    this.value = (this.value & rhs.value) >>> 0;
  } else {
    this.value = _.map(_.zip([this.value, rhs.value]), function(pair) {
      return (pair[0] & pair[1]) >>> 0;
    });
  }
  return this;
};

UInt.prototype.or = function(rhs) {
  if(this.bytes !== rhs.bytes) {
    throw '.or('+this.bytes+', '+rhs.bytes+')';
  }
  if(this.bytes < 5) {
    this.value = (this.value | rhs.value) >>> 0;
  } else {
    this.value = _.map(_.zip([this.value, rhs.value]), function(pair) {
      return (pair[0] | pair[1]) >>> 0;
    });
  }
  return this;
};

UInt.prototype.xor = function(rhs) {
  if(this.bytes !== rhs.bytes) {
    throw '.xor('+this.bytes+', '+rhs.bytes+')';
  }
  if(this.bytes < 5) {
    this.value = (this.value ^ rhs.value) >>> 0;
  } else {
    this.value = _.map(_.zip([this.value, rhs.value]), function(pair) {
      return (pair[0] ^ pair[1]) >>> 0;
    });
  }
  return this;
};

UInt.prototype.neg = function() {
  if(this.bytes < 5) {
    this.value = (~this.value) >>> 0;
  } else {
    this.value = _(this.value).map(function(v) {
      return (~v) >>> 0;
    });
  }
  return this;
};

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
  if(lhs.bytes !== rhs.bytes) {
    throw 'equal('+lhs.bytes+', '+rhs.bytes+')';
  }
  return lhs.bytes === rhs.bytes && _.isEqual(lhs, rhs);
}

function neg(val) {
  var result = new UInt(val);
  return result.neg();
}

function and(lhs, rhs) {
  var result = new UInt(lhs);
  return result.and(rhs);
}

function or(lhs, rhs) {
  var result = new UInt(lhs);
  return result.or(rhs);
}

function xor(lhs, rhs) {
  var result = new UInt(lhs);
  return result.xor(rhs);
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
      function(pass, triple) {
        return !pass ? false : ((triple[0] & triple[1]) >>> 0) === triple[2]; 
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
