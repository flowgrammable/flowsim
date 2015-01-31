'use strict';

angular.module('flowsimUiApp')
  .factory('UInt', function() {

var Pattern = /^(0x)?[0-9a-fA-F]+$/;

function isHexStr(input){
  return /^\\x/.test(input);
}

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

function is(bits) {
  return function(val) {
    // Test the numeric range if a number
    if(_.isFinite(val) && (val % 1 === 0)) {
      return 0 <= val && val <= maxFromBits(bits);
    // Othrwise validate is an actual string
    } else if(_(val).isString() && Pattern.test(val)) {
      // Check is simple range check if under 32 bits
      if(bits <= 32) {
        val = parseInt(val);
        return val <= maxFromBits(bits);
      // If over 32 bits its a little more complex
      } else {
        // Allow zero without '0x' prefix
        if(val === '0') { return true; }
        // Otherwise require the '0x' prefix for > 32 bit values
        if(!/^0x/.test(val)) { return false; }
        // Remove the '0x' prefix
        val.splice(0, 2);
        // Technically this will not be accurate for bit counts with
        // modulo 1, 2, and 3 .... FIXME
        return val.length <= Math.ceil(bits/4);
      }
    }
    return false;
  };
}

// Construct a function that converts a string to a value with a specific
// underlying bit precision. If the bit precision is 32 or less, the result
// is a natural number. If the bit precision is greater than 32, the result
// is an array of natural numbers where each cell is [0..255].
//
// consStr :: String -> Nat | [Nat] if bits > 32
//
function consStr(bits) {
  var bytes = Math.ceil(bits / 8);
  var hbytes = Math.ceil(bits / 4);
  return function(val) {
    var i, tmp;
    var array = [];
    // We should not have bad input at this point
    if(!Pattern.test(val)) {
      throw 'Bad consStr('+bits+')('+val+')';
    }
    // Return the value if the precision is 32 or under
    tmp = parseInt(val);
    if(tmp <= maxFromBits(32) && bits <= 32) {
      return tmp;
    } 
    // Throw an execption if the value is too large for the precision
    if(bits <= 32) {
      throw 'Bad consStr('+bits+')('+val+')';
    }
    // Return the easy case of 0
    if(tmp === '0') {
      return _(bytes).range(function() {
        return 0;
      });
    } 
    // Otherwise must be hex 
    // OR val is less than maxFromBits(32)
    if(Pattern.test(val)) {
      if(!/^0x/.test(val)){
        val = parseInt(val).toString(16);
      }
      tmp = val.split('');

      if(/^0x/.test(val)){
      // Chop the '0x' prefix for easier handling
      tmp.splice(0, 2);
      }
      // Input is larger than allowable
      if(tmp.length > hbytes) {
        throw 'Bad consStr('+bits+')('+tmp+')';
      }
      // Work from the back of the input
      tmp.reverse();

      for(i=0; i<bytes; ++i) {
        // We are out of input just return a 0
        if(tmp.length === 0) {
          array.push(0);
        // We only have a half-octect of input
        } else if(tmp.length === 1) {
          // parse just a half-octect and remove
          array.push(parseInt(tmp.splice(0, 1), 16));
        // Otherwise we have a full octet of input
        } else {
          // parse a full octect and remove
          array.push(parseInt(tmp.splice(0, 2).reverse().join(''), 16));
        }
      }
      // Fix the array orientation and return
      array.reverse();
      return array;
    } else {
      // We don't know what it is ... hard fail
      throw 'Bad consStr('+bits+')('+val+')';
    }
  };
}

// Construct a funtion that converts either a natural number or array of natural
// numbers to a user display string.
//
// toString :: Nat | [Nat] -> String
//
function toString(bits) {
  return function(value, isHex) {
    if(_(value).isArray()) {
      return '0x'+_(value).map(function(octet) {
        return padZeros(octet.toString(16), 2);
      }).join('');
    } else if(_(value).isFinite()) {
      if(isHex) {
        return '0x'+padZeros(value.toString(16), 2*(bits/8));
      } else {
        return value.toString(10);
      }
    } else {
      throw 'toString on bad value: '+value;
    }
  };
}

function UInt(uint, value, bytes) {
  if(_.isObject(uint)) {
    if(uint.bytes > 4) {
      this.value = _.clone(uint.value);
    } else {
      this.value = uint.value;
    }
    this.bytes = uint.bytes;
    this.isHex = uint.isHex;
  } else if(_.isString(value) && Pattern.test(value) && bytes) {
    if(isHexStr(value)){
      this.isHex = true;
    }
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
    this.isHex = true;
  } else if(_.isFinite(value) && (value % 1 === 0) && (bytes < 5)) {
    this.value = value;
    this.bytes = bytes ? bytes : 4;
    this.isHex = false;
  } else if((_.isUndefined(value) || _.isNull(value) || value === 0) && bytes >= 0) {
    if(bytes < 5) {
      this.value = 0;
      this.bytes = bytes;
      this.isHex = false;
    } else {
      this.value = _(bytes).times(function() { return 0; });
      this.bytes = bytes;
      this.isHex = true;
    }
  } else {
    throw 'UInt('+uint+', '+value+', '+bytes+')';
  }
  // If converted value is wider than limit throw exception
  if(this.bytes < 5 && howManyBytes(this.value) > this.bytes) {
    throw 'UInt('+uint+', '+value+', '+bytes+')';
  } else if(this.bytes > 4 && this.value.length > this.bytes) {
    throw 'UInt('+uint+', '+value+', '+bytes+')';
  }
  // If converted value is negative, throw exception
  // warning: can only check 1, 2, 3 byte uints for negativity...
  if (this.bytes < 4 && this.value < 0) {
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
    this.value = _.map(_.zip(this.value, rhs.value), function(pair) {
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
    this.value = _.map(_.zip(this.value, rhs.value), function(pair) {
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
    this.value = _.map(_.zip(this.value, rhs.value), function(pair) {
      return (pair[0] ^ pair[1]) >>> 0;
    });
  }
  return this;
};

UInt.prototype.neg = function() {
  var mask;
  if(this.bytes < 5) {
    mask = 0xffffffff >>> (32 - (8*this.bytes));
    this.value = mask & (~this.value) >>> 0;
  } else {
    this.value = _(this.value).map(function(v) {
      return 0xff & (~v) >>> 0;
    });
  }
  return this;
};

UInt.prototype.mask = function(src, mask) {
  if(this.bytes !== src.bytes || this.bytes !== mask.bytes) {
    throw '.mask('+this.bytes+', '+src.bytes+', '+mask.bytes+')';
  }
  if(this.bytes < 5) {
    this.value = ((this.value & ~mask.value) | (src.value & mask.value)) >>> 0;
  } else {
    this.value = _.map(_.zip(this.value, src.value, mask.value),
                       function(triple) {
      return ((triple[0] & ~triple[2]) | (triple[1] & triple[2])) >>> 0;
    });
  }
  return this;
};

UInt.prototype.toString = function(base, sep) {
  var prefix = base === 16 ? '0x' : '';
  sep = sep ? sep : '';
  if(this.bytes < 5) {
    if(base === 16) {
      return prefix + padZeros(this.value.toString(base), 2*this.bytes);
    } else {
      return prefix + this.value.toString(base);
    }
  } else {
    return prefix + _(this.value).map(function(v) {
      return padZeros(v.toString(base), 2);
    }).join(sep);
  }
};

UInt.prototype.equal = function(uint){
  return this.bytes === uint.bytes && _.isEqual(this, uint);
};

UInt.prototype.subt = function(sub){
  if(!this.greaterThan(sub)){
    throw 'UInt must be greater than sub';
  }
  if(this.bytes < 5){
    this.value -= sub.value;
  } else {
    var b = [0,0,0,0,0,0];
   _(this.value).each(function(di, idx){
      var idxn = this.value.length - 1 - idx;
      this.value[idxn] -= b[idxn];
      this.value[idxn] -= sub.value[idxn];
      if(this.value[idxn] < 0){
        b[idxn - 1] = this.value[idxn] * -1;
        this.value[idxn] = 255 | -(this.value[idxn]);
      }
    }, this);
  }
  return this;
};

UInt.prototype.greaterThan = function(rhs){
  if(this.bytes < 5){
    return this.value - rhs.value;
  } else {
    return !!_(this.value).find(function(val, idx){
        return val > rhs.value[idx];
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

function mask(tgt, src, msk) {
  var result = new UInt(tgt);
  return result.mask(src, msk);
}

function Match(match, value, mask) {
  if(_.isObject(match)) {
    this.value = new UInt(match.value);
    this.mask  = new UInt(match.mask);
  } else if(value.bytes === mask.bytes) {
    this.value = new UInt(value);
    this.mask  = new UInt(mask);
    this.value = this.value.and(this.mask);
  } else {
    throw 'Match('+match+', '+value+', '+mask+')';
  }
}

Match.prototype.clone = function() {
  return new Match(this);
};

Match.prototype.toString = function(base) {
  return this.value.toString(base) + '/' + this.mask.toString(base);
};

Match.prototype.equal = function(match) {
  return equal(this.value, match.value) && equal(this.mask, match.mask);
};

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
    throw 'Match.match('+this.value.bytes+', '+val.bytes+')';
  } else if(this.value.bytes < 5) {
    return ((val.value & this.mask.value) >>> 0) === this.value.value;
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
  consStr: consStr,
  toString: toString,
  UInt: UInt,
  and: and,
  or: or,
  xor: xor,
  neg: neg,
  mask: mask,
  equal: equal,
  Match: Match,
  mkExact: Match.mkExact
};

});
