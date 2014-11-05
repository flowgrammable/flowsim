
var _     = require('underscore');
var utils = require('./utils');

var Ethernet = function(src, dst, typelen) {
  this.src     = new Ethernet.MAC(src);
  this.dst     = new Ethernet.MAC(dst);
  this.typelen = new utils.UInt(typelen, 0, 0xffff);
};

Ethernet.prototype.toString = function() {
};

Ethernet.MAC = function(mac) {
  if(typeof mac === 'string') {
    var tmp = mac.match(Ethernet.MAC.Pattern);
    if(!tmp || tmp.length < 12) {
      throw 'Bad MAC Address: ' + mac;
    }
    this.value = _.map(_.range(6), function(i) {
      return parseInt('0x'+tmp[2*i+1]);
    });
  } else if(mac instanceof Ethernet.MAC) {
    this.value = _.clone(mac);
  } else {
    throw 'Bad MAC Address: ' + mac;
  }
}

Ethernet.MAC.Pattern = /^([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})$/;

Ethernet.MAC.prototype.toString = function() {
  return _.map(this.value, function(oct) { 
    return utils.padZeros(oct.toString(16), 2);
  }).join(':');

}

Ethernet.MAC.Match = function(addr, mask) {
  this.addr = new Ethernet.MAC(addr);
  this.mask = new Ethernet.MAC(mask);
};

Ethernet.MAC.Match.prototype.match = function(addr) {
  var i;
  for(i=0; i<6; ++i) {
    if(this.addr.value[i] != (this.mask.value[i] & addr.value[i])) {
      return false;
    }
  }
  return true;
}

Ethernet.MAC.Match.prototype.toString = function() {
  return this.addr.toString() + '/' + this.mask.toString();
}

module.exports = {
  Ethernet: Ethernet,
  MAC: Ethernet.MAC,
  Match: Ethernet.MAC.Match
};
