'use strict';

angular.module('flowsimUiApp')
  .factory('UInt', function() {

var Pattern = /^(0x)?[0-9a-fA-F]+$/;

function padZeros(input, len) {
  len -= input.length;
  if(len < 1) { return input; }
  return _(len).times(function() {
    return '0';
  }).join('') + input;
}

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

function is(bits){
  return function(val){
    var tmp;
    if(typeof val === 'number'){
      return val === parseInt(val) && (0 <= val && val <= maxFromBits(bits));
    } else if(_.isString(val) && Pattern.test(val)) {
      tmp = parseInt(val);
      return 0 <= val && val <= maxFromBits(bits);
    } else {
      return false;
    }
  }
};

function UInt(uint, value, bytes) {
  if(_.isObject(uint)) {
    if(uint.bytes > 4) {
      this.value = _.clone(uint.value);
    } else {
      this.value = uint.value;
    }
    this.bytes = uint.bytes;
    _.extend(this, uint);
  } else if(_.isString(value) && Pattern.test(value) && bytes) {
    if(bytes < 5) {
      this.value = parseInt(value);
    } else {
      // Cannot construct from string for larger than 4 bytes
      throw 'UInt('+uint+', '+value+', '+bytes+')';
    }
    this.bytes = bytes;
  } else if(_.isArray(value)) {
    this.value = value;
    this.bytes = bytes ? _.max([bytes, value.length]) : value.length;
  } else if(_.isFinite(value) && (value % 1 === 0)) {
    this.value = value;
    this.bytes = bytes ? bytes : 4;
  } else if(_.isNull(value) && bytes && bytes > 0) {
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
  // If converted value is wider than limit throw exception
  if(this.bytes < 5 && howManyBytes(this.value) > this.bytes) {
    console.log('goign to throw');
    throw 'UInt('+uint+', '+value+', '+bytes+')';
  } else if(this.bytes > 4 && this.value.length > this.bytes) {
    throw 'UInt('+uint+', '+value+', '+bytes+')';
  }
}

UInt.prototype.clone = function() {
  return new UInt(this);
};

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

UInt.prototype.toString = function(base, sep) {
  var prefix = base === 16 ? '0x' : '';
  var sep    = sep ? sep : '';
  if(this.bytes < 5) {
    return prefix + padZeros(this.value.toString(base), 2*this.bytes);
  } else {
    return prefix + _(this.value).map(function(v) {
      return padZeros(v.toString(base), 2);
    }).join(sep);
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

Match.mkWildcard = function(uint) {
  var bytes;
  if(uint instanceof UInt) {
    bytes = uint.bytes;
  } else {
    bytes = uint;
  }
  return new Match(null,
    new UInt(null, null, bytes),
    new UInt(null, null, bytes));
};

Match.mkExact = function(uint) {
  return new Match(null,
    uint,
    (new UInt(null, null, uint.bytes)).neg());
};

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
  padZeros: padZeros,
  HexPattern: Pattern,
  howManyBits: howManyBits,
  howManyBytes: howManyBytes,
  maxFromBits: maxFromBits,
  maxFromBytes: maxFromBytes,
  is: is,
  UInt: UInt,
  and: and,
  or: or,
  xor: xor,
  neg: neg,
  equal: equal,
  Match: Match
};

});
