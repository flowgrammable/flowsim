
var _ = require('underscore');

function padZeros(input, len) {
  len -= input.length;
  return _.map(_.range(len), function(i) { return '0'; }).join() + input;
}

var HexPattern = /^(0x)?[0-9a-fA-F]+$/;

function inRange(min, max) {
  return function(value) { 
    return min <= value && value <= max;
  };
}

function parseUInt(floor, ceil) {
  return function(value) {
    var tmp;
    if(typeof value === 'number' && inRange(floor, ceil)(value)) {
      return parseInt;
    } else if(typeof value === 'string' && HexPattern.test(value)) {
      tmp = parseInt(value);
      if(inRange(floor, ceil)(tmp)) {
        return tmp;
      } 
    } 
    return null;
  };
} 

function UInt(value, min, max) {
  if(typeof value === 'number') {
    this.value = value;
  } else if(typeof value === 'string' && HexPattern.test(value)) {
    this.value = parseInt(value);
  } else if(value instanceof UInt) {
    this.value = value;
  } else {
    throw 'UInt(' + value + ')';
  }
  if(min && min > this.value) {
    throw 'UInt(' + this.value + ') | >= ' + min;
  }
  if(max && max < this.value) {
    throw 'UInt(' + this.value + ') | <= ' + max;
  }
}

UInt.Match = function(value, mask) {
  this.value = new UInt(value);
  this.mask  = new UInt(mask);
};

UInt.Match.prototype.match = function(value) {
  return (this.mask & value) == this.value;
};
  
UInt.Match.prototype.toString = function() {
  return this.value.toString() + '/' + this.mask.toString();
};

UInt.prototype.toString = function() {
  return this.value;
}

module.exports = {
  padZeros: padZeros,
  HexPattern: HexPattern,
  UInt: UInt
};
