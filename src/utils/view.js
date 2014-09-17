
(function(){

var data = require('./data');

var MSBF = 'msbf';
var LSBF = 'lsbf';

exports.MSBF = MSBF;
exports.LSBF = LSBF;

function View(param) {
  if(typeof param === 'number') {
    this.buf = new Buffer(param);
    this.begin = 0;
    this.end = param;
  } else if(param instanceof Buffer) {
    this.buf   = param;
    this.begin = 0;
    this.end   = param.length;
  } else if(param instanceof View) {
    this.buf   = param.buf;
    this.begin = param.begin;
    this.end   = param.end;
  } else {
    throw "Constructed View with: " + typeof param;
  }
}
exports.View = View;

View.prototype.bytes = function() {
  return this.end - this.begin;
};

View.prototype.constrain = function(amount) {
  return new View(this.buf, this.begin, this.end - amount);
};

View.prototype.advance = function(amount) {
  return new View(this.buf, this.begin + amount, this.end);
};

function readUInt8() {
  return function(view, offset) {
    var _offset = offset === undefined ? 0 : offset;
    return view.buf.readUInt8(view.begin + offset);
  };
}

function writeUInt8() {
  return function(view, value, offset) {
    var _offset = offset === undefined ? 0 : offset;
    view.buf.writeInt8(value, view.begin + _offset);
  };
}

function readUInt16(ordering) {
  var bo = ordering;
  return function(view, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(bo === LSBF) {
      return view.buf.readUInt16LE(view.begin + _offset);
    } else if(bo === MSBF) {
      return view.buf.readUInt16BE(view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + bo
    }
  };
}

function writeUInt16(ordering) {
  var bo = ordering;
  return function(view, value, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(bo === LSBF) {
      view.buf.writeInt16LE(value, view.begin + _offset);
    } else if(bo === MSBF) {
      view.buf.writeUInt16BE(value, view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + bo;
    }
  };
}

function readUInt32(ordering) {
  var bo = ordering;
  return function(view, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(bo === LSBF) {
    return view.buf.readUInt32LE(view.begin + _offset);
    } else if(bo === MSBF) {
      return view.buf.readUInt32BE(view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + bo;
    }
  };
}

function writeUInt32(ordering) {
  var bo = ordering;
  return function(view, value, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(bo === LSBF) {
      view.buf.writeUInt32LE(value, view.begin + _offset);
    } else if(bo === MSBF) {
      view.buf.writeUInt32BE(value, view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + bo;
    }
  };
}

function readUInt64(ordering) {
  var bo = ordering;
  return function(view, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(bo === LSBF) {
    return view.buf.readUInt64LE(view.begin + _offset);
    } else if(bo === MSBF) {
      return view.buf.readUInt64BE(view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + bo;
    }
  };
}

function writeUInt64(ordering) {
  var bo = ordering;
  return function(view, value, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(bo === LSBF) {
      view.buf.writeUInt64LE(value, view.begin + _offset);
    } else if(bo === MSBF) {
      view.buf.writeUInt64BE(value, view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + bo;
    }
  };
}

function readData(view, offset) {
  var _offset = offset === undefined ? 0 : offset;
  return new data.Data(view.buf.splice(view.begin + _offset, view.end));
}

function writeData(view, data, offset, amount) {
  var _offset = offset === undefined ? 0 : offset;
  var _amount = amount === undefined ? 0 : amount;
  data.getBuffer().copy(view.buf, view.begin + _offset, _amount);
}

exports.readUInt8   = readUInt8;
exports.readUInt16  = readUInt16;
exports.readUInt32  = readUInt32;
exports.readUInt64  = readUInt64;
exports.readData    = readData;
exports.writeUInt8  = writeUInt8;
exports.writeUInt16 = writeUInt16;
exports.writeUInt32 = writeUInt32;
exports.writeUInt64 = writeUInt64;
exports.writeData   = writeData;

function decode(view) {
  if(view.bytes() < this.bytes()) {
    throw 'Underflow: ' + this.bytes();
  }
  this._fromView(view);
  return view.advance(this.bytes());
}

function encode(view) {
  if(view.bytes() < this.bytes()) {
    throw 'Underflow: ' + this.bytes();
  }
  this._toView(view);
  return view.advance(this.bytes());
}

exports.decode = decode;
exports.encode = encode;

})();

