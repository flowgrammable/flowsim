
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

function View(buf) {
  if(!buf instanceof Buf) {
    throw 'View constructed with: ' + typeof buf;
  }
  this.buf   = buf.buf;
  this.begin = buf.begin;
  this.end   = buf.end;
}
exports.View = View;

function bytes(view) {
  return view.end - view.begin;
}

function constrain(view, amount) {
  return new View(view.buf, view.begin, view.end - amount);
}

function advance(view, amount) {
  return new View(view.buf, view.begin + amount, view.end);
}

exports.bytes     = bytes;
exports.constrain = constrain;
exports.advance   = advance;

function readUInt8() {
  return function(view) {
    return view.buf.readUInt8(view.begin);
  };
}

function writeUInt8() {
  return function(view, value) {
    view.buf.writeInt8(value, view.begin);
  };
}

function readUInt16(ordering) {
  var byteOrdering = ordering;
  return function(view) {
    if(ordering === 'LE') {
      return view.buf.readUInt16LE(view.begin);
    } else if(ordering === 'BE') {
      return view.buf.readUInt16BE(view.begin);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function writeUInt16(ordering) {
  var byteOrdering = ordering;
  return function(view, value) {
    if(ordering === 'LE') {
      view.buf.writeInt16LE(value, view.begin);
    } else if(ordering === 'BE') {
      view.buf.writeUInt16BE(value, view.begin);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function readUInt32(ordering) {
  var byteOrdering = ordering;
  return function(view) {
    if(ordering === 'LE') {
    return view.buf.readUInt32LE(view.begin);
    } else if(ordering === 'BE') {
      return view.buf.readUInt32BE(view.begin);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function writeUInt32(ordering) {
  var byteOrdering = ordering;
  return function(view, value) {
    if(ordering === 'LE') {
      view.buf.writeUInt32LE(value, view.begin);
    } else if(ordering === 'BE') {
      view.buf.writeUInt32BE(value, view.begin);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function readUInt64(ordering) {
  var byteOrdering = ordering;
  return function(view) {
    if(ordering === 'LE') {
    return view.buf.readUInt64LE(view.begin);
    } else if(ordering === 'BE') {
      return view.buf.readUInt64BE(view.begin);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

function writeUInt64(ordering) {
  var byteOrdering = ordering;
  return function(view, value) {
    if(ordering === 'LE') {
      view.buf.writeUInt64LE(value, view.begin);
    } else if(ordering === 'BE') {
      view.buf.writeUInt64BE(value, view.begin);
    } else {
      throw 'Bad byte ordering: ' + ordering;
    }
  };
}

exports.readUInt8   = readUInt8;
exports.readUInt16  = readUInt16;
exports.readUInt32  = readUInt32;
exports.readUInt64  = readUInt64;
exports.writeUInt8  = writeUInt8;
exports.writeUInt16 = writeUInt16;
exports.writeUInt32 = writeUInt32;
exports.writeUInt64 = writeUInt64;

})();

