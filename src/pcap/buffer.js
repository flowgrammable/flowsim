
(function(){

function Buf(len) {
  if(typeof len !== 'number') {
    throw 'Buf constructed with: ' + typeof len;
  }
  this.buf   = new Buffer(len);
  this.begin = 0;
  this.end   = len;
}
exports.Buffer = Buf;

Buf.prototype.bytes = function() {
  return this.end - this.begin;
};

function View(buf) {
  if(!buf instanceof Buf || !buf instanceof View) {
    throw 'View constructed with: ' + typeof buf;
  }
  this.buf   = buf.buf;
  this.begin = buf.begin;
  this.end   = buf.end;
}
exports.View = View;

View.prototype.bytes = function() {
  return this.end - this.begin;
};

function constrain(view, amount) {
  return new View(view.buf, view.begin, view.end - amount);
}

function advance(view, amount) {
  return new View(view.buf, view.begin + amount, view.end);
}

exports.constrain = constrain;
exports.advance   = advance;

var msbf = 'msbf';
var lsbf = 'lsbf';

exports.msbf = msbf;
exports.lsbf = lsbf;

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
  var byteOrdering = ordering;
  return function(view, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(ordering === lsbf) {
      return view.buf.readUInt16LE(view.begin + _offset);
    } else if(ordering === msbf) {
      return view.buf.readUInt16BE(view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function writeUInt16(ordering) {
  var byteOrdering = ordering;
  return function(view, value, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(ordering === lsbf) {
      view.buf.writeInt16LE(value, view.begin + _offset);
    } else if(ordering === msbf) {
      view.buf.writeUInt16BE(value, view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function readUInt32(ordering) {
  var byteOrdering = ordering;
  return function(view, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(ordering === lsbf) {
    return view.buf.readUInt32LE(view.begin + _offset);
    } else if(ordering === msbf) {
      return view.buf.readUInt32BE(view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function writeUInt32(ordering) {
  var byteOrdering = ordering;
  return function(view, value, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(ordering === lsbf) {
      view.buf.writeUInt32LE(value, view.begin + _offset);
    } else if(ordering === msbf) {
      view.buf.writeUInt32BE(value, view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function readUInt64(ordering) {
  var byteOrdering = ordering;
  return function(view, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(ordering === lsbf) {
    return view.buf.readUInt64LE(view.begin + _offset);
    } else if(ordering === msbf) {
      return view.buf.readUInt64BE(view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function writeUInt64(ordering) {
  var byteOrdering = ordering;
  return function(view, value, offset) {
    var _offset = offset === undefined ? 0 : offset;
    if(ordering === lsbf) {
      view.buf.writeUInt64LE(value, view.begin + _offset);
    } else if(ordering === msbf) {
      view.buf.writeUInt64BE(value, view.begin + _offset);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function readBuffer(view, offset) {
  var _offset = offset === undefined ? 0 : offset;
  return view.buf.splice(view.begin + _offset, view.end);
}

function writeBuffer(view, buf, offset, amount) {
  var _offset = offset === undefined ? 0 : offset;
  var _amount = amount === undefined ? 0 : amount;
  buf.copy(view.buf, view.begin + _offset, _amount);
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
  this.fromView(view);
  return advance(view, this.bytes());
}

function encode(view) {
  if(view.bytes() < this.bytes()) {
    throw 'Underflow: ' + this.bytes();
  }
  this.toView(view);
  return advance(view, this.bytes());
}

exports.decode = decode;
exports.encode = encode;

function Data(param) {
  if(param instanceof Buffer) {
    this.buf = param;
  } else if(param typeof === 'number') {
    this.buf = new Buffer(param);
  } else {
    this.buf = null;
  }
}
exports.Data = Data;

Data.prototype.bytes = function() {
  if(this.buf) {
    return this.buf.length;
  } else {
    return 0;
  }
};

Data.prototype.fromView = function(view) {
  this.buf = readBuf(view);
};

Data.prototype.toView = function(view) {
  writeBuf(view, this.buf);
};

Data.prototype.decode = decode;
Data.prototype.encode = encode;

})();

