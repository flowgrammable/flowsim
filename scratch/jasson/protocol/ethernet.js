
var formatter = require('./formatter');
var ethertypes = require('./ethertypes');

Address = function(v) {
  if(typeof v == 'string') {
    var addr = /(([0-9a-fA-F]{2})(-|:)){5}([0-9a-fA-F]{2})/;
    var octet = /[0-9a-fA-F]{2}/g;
    if(!addr.test(v)) throw "Invalid MAC Addr";
    var result = v.match(octet);
    this.addr = [];
    for(var i=0; i<result.length; ++i) {
      this.addr.push(parseInt(result[i], 16));
    }
  } else if(!v) {
    this.addr = [0, 0, 0, 0, 0, 0];
  } else {
    throw 'Invalid MAC Addr';
  }
}
exports.Address = Address;

Address.prototype.toString = function() {
  var result = [];
  for(var i=0; i<this.addr.length; ++i)
    result.push(this.addr[i].toString(16));
  return result.join(':');
}

Address.prototype.isBroadcast = function() {
  return this.addr[0] == 0xff && this.addr[1] == 0xff &&
    this.addr[2] == 0xff && this.addr[3] == 0xff &&
    this.addr[4] == 0xff && this.addr[5] == 0xff;
}

Address.prototype.isMulticast = function() {
  return this.addr[0] & 0x01;
}

Header = function(src, dst, ethertype) {
  this.src = new Address(src);
  this.dst = new Address(dst);
  if(ethertype) this.ethertype = ethertype;
}
exports.Header = Header;

Header.prototype.toFormatter = function(f) {
  f.begin('Ethernet');
  f.addPair('Src', this.src.toString());
  f.addPair('Dst', this.dst.toString());
  f.addTriple('Ethertype', ethertypes.Lookup(this.ethertype), 
              this.ethertype.toString(16));
  f.end();
}

Header.prototype.toString = function() {
  var f = new formatter.Formatter();
  this.toFormatter(f);
  var result = f.toString();
  delete f;
  return result;
}

Header.prototype.bytes = function() {
  return 16;
}

Header.prototype.labels = function() {
  return {
    protocol: 'Ethernet',
    bytes: this.bytes(),
    fields: [
      { name: 'src', value: this.src.toString() },
      { name: 'dst', value: this.dst.toString() },
      { name: 'ethertype', 
        value: ethertypes.Lookup(this.ethertype) + 
               '(' + this.ethertype.toString(16)+ ')' 
      }
    ]
  };
}

Header.prototype.to_buffer = function(buf) {
  if(buf.remaining() < 14)
    throw new buf.Structural(14, buf.remaining());

  buf.write(this.src, 6);
  buf.write(this.dst, 6);
  buf.writeUInt16(this.ethertype);
}

Header.prototype.from_buffer = function(buf) {
  if(buf.remaining() < 14)
    throw new buf.Structural(14, buf.remaining());

  buf.read(this.src, 6);
  buf.read(this.dst, 6);
  buf.readUInt16(this.ethertype);
}

