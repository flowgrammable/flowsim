
function Structural(name, expected, actual) {
  this.name = name;
  this.expected = expected;
  this.actual = actual;
}

function Pbuf(length) {
  this.buf = new Buffer(length);
  this.current = 0;
}

Pbuf.prototype.reset = function() {
  this.current = 0;
}

Pbuf.prototype.remaining = function() {
  return this.buf.length - this.current;
}

Pbuf.prototype.to_file = function(fname) {
  fs.open(fname, 'w', function(err, fd) {
    if(err) throw err;
    fs.write(fd, this.buf, 0, this.buf.current, 0, 
      function(err, written, buffer) {
        fs.close(fd);
        if(err) throw err;
    })
  });
}

Pbuf.prototype.from_file = function(fname) {
  fs.open(fname, 'r', function(err, fd) {
    if(err) throw err;
    fs.write(fd, this.buf, 0, this.buf.length, 0, 
      function(err, written, buffer) {
        fs.close(fd);
        if(err) throw err;
    })
  });
}

Pbuf.prototype.write = function(v, l) {
  this.buf.write(v, this.current, l);
  this.current += l;
}

Pbuf.prototype.writeUInt8 = function(v) {
  this.buf.writeUInt8(v, this.current);
  this.current += 1;
}

Pbuf.prototype.writeUInt16 = function(v) {
  this.buf.writeUInt16BE(v, this.current);
  this.current += 2;
}

Pbuf.prototype.writeUInt32 = function(v) {
  this.buf.writeUInt32BE(v, this.current);
  this.current += 4;
}

Pbuf.prototype.read = function(v, l) {
  v = this.buf.toString(this.current, l);
}

Pbuf.prototype.readUInt8 = function() {
  var v = this.buf.readUInt8(v, this.current);
  this.current += 1;
  return v;
}

Pbuf.prototype.readUInt16 = function() {
  var v = this.buf.readUInt16BE(v, this.current);
  this.current += 2;
  return v;
}

Pbuf.prototype.readUInt32 = function() {
  var v = this.buf.readUInt32BE(v, this.current);
  this.current += 4;
  return v;
}

