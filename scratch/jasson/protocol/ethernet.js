
var formatter = require('./formatter');

var EtherTypes = {
  IPv4: 0x0800,
  ARP: 0x0806,
  RARP: 0x8035,
  VLAN: 0x8100,
  IPv6: 0x86DD,
  MPLSu: 0x8847,
  MPLSm: 0x8848,
  LLDP: 0x88cc
};

function lookup(value) {
  for(var prop in EtherTypes) {
    if(EtherTypes[prop] == value)
      return prop;
  }
  return 'UNDEFINED';
}

MAC = function(v) {
  var addr = /(([0-9a-fA-F]{2})(-|:)){5}([0-9a-fA-F]{2})/;
  var octet = /[0-9a-fA-F]{2}/g;
  if(!addr.test(v)) throw "Invalid MAC Addr";
  var result = v.match(octet);
  this.addr = [];
  for(var i=0; i<result.length; ++i) {
    this.addr.push(parseInt(result[i], 16));
  }
}
exports.MAC = MAC;

MAC.prototype.toString = function() {
  var result = [];
  for(var i=0; i<this.addr.length; ++i)
    result.push(this.addr[i].toString(16));
  return result.join(':');
}

Ethernet = function(src, dst, ethertype) {
  this.src = new exports.MAC(src);
  this.dst = new exports.MAC(dst);
  if(ethertype) this.ethertype = ethertype;
}
exports.Ethernet = Ethernet;

Ethernet.prototype.toFormatter = function(f) {
  f.begin('Ethernet');
  f.addPair('Src', this.src.toString());
  f.addPair('Dst', this.dst.toString());
  f.addTriple('Ethertype', lookup(this.ethertype), this.ethertype.toString(16));
  f.end();
}

Ethernet.prototype.toString = function() {
  var f = new formatter.Formatter();
  this.toFormatter(f);
  var result = f.toString();
  delete f;
  return result;
}

var eth = new Ethernet('00:11:22:33:44:55', 'ff:ff:ff:ff:ff:ff', 0x8100);
console.log(eth.toString());

Ethernet.prototype.to_buffer = function(buf) {
  if(buf.remaining() < 14)
    throw new buf.Structural(14, buf.remaining());

  buf.write(this.src, 6);
  buf.write(this.dst, 6);
  buf.writeUInt16(this.ethertype);
}

Ethernet.prototype.from_buffer = function(buf) {
  if(buf.remaining() < 14)
    throw new buf.Structural(14, buf.remaining());

  buf.read(this.src, 6);
  buf.read(this.dst, 6);
  buf.readUInt16(this.ethertype);
}

