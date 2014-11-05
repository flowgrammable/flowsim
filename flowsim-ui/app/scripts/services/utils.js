
'use strict';

angular.module('flowsimUiApp')
  .factory('Utils', function() {

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

function howManyBits(val) {
  if(val === 0) return 1;
  return Math.floor((Math.log(val) / Math.LN2) + 1);
}

function howManyBytes(val) {
  if(val === 0) return 1;
  return Math.ceil(howManyBits(val) / 8);
}

function maxFromBits(val) {
  return Math.ceil(Math.pow(2, val) - 1);
}

function maxFromBytes(val) {
  return Math.ceil(maxFromBits(8*val));
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

function UInt(value, bits, min, max) {
  if(typeof value === 'number') {
    this.value = value;
  } else if(typeof value === 'string' && HexPattern.test(value)) {
    this.value = parseInt(value);
  } else if(value instanceof UInt) {
    this.value = value;
  } else {
    throw 'UInt(' + value + ')';
  }
  this.bits = bits ? bits : howManyBits(value);
  this.bytes = Match.ceil(this.bits / 8);
  this.min = min ? min : 0;
  this.max = max ? max : this.bytes
  if(min) {
    if(min > this.value) {
      throw 'UInt(' + this.value + ') | >= ' + min;
    }
  if(max && max < this.value) {
    throw 'UInt(' + this.value + ') | <= ' + max;
  }
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
  return this.value.toString(16) + '/' + this.mask.toString(16);
};

UInt.prototype.toString = function(val) {
  if(val === 16) {
    return '0x' + padZeros(this.value.toString(16), this.bytes) + 
           this.value.toString(16);
  }
  return this.value.toString();
}

return {
  padZeros: padZeros,
  HexPattern: HexPattern,
  howManyBits: howManyBits,
  howManyBytes: howManyBytes,
  maxFromBits: maxFromBits,
  maxFromBytes: maxFromBytes,
  UInt: UInt
};

});
