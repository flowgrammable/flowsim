
function Address(addr) {
  var MAC = /([0-9a-fA-F]{2}):([0-9a-fA-F]{2}):([0-9a-fA-F]{2}):([0-9a-fA-F]{2}):([0-9a-fA-F]{2}):([0-9a-fA-F]{2})/;
  var matches;
  var i;

  if(addr instanceof Address) {
    this.mac = addr.mac.slice(0);
  } else if (typeof(addr) == "string") {

    matches = MAC.exec(addr);
    if(matches == null)
      throw "Bad MAC Address: " + addr;

    this.mac = [];
    for(i=0; i<6; ++i)
      this.mac.push(parseInt(matches[1+i], 16));
  } else {
    throw "Bad type for MAC construction: " + typeof(addr);
  }
}

Address.prototype.toString = function() {
  var result = [];
  var i;
  for(i=0; i<6; ++i)
    result.push(this.mac[i].toString(16));
  return result.join(':');
}

exports.Address = Address;

function Header(src, dst, type) {
  this.src = new Address(src);
  this.dst = new Address(dst);
  this.type = type;
}

Header.prototype.toString = function() {
  var result = "Ethernet(";
  result += "src=" + this.src.toString() + ", ";
  result += "dst=" + this.dst.toString() + ", ";
  result += "type=" + this.type.toString(16) + ")";
  return result;
}

exports.Header = Header;

exports.IPv4 = parseInt('800', 16);
