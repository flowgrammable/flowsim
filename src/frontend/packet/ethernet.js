
var Ethernet = (function(){

  var macp = /(([0-9a-fA-F]{2})(-|:)){5}([0-9a-fA-F]{2})/;
  var octp = /[0-9a-fA-F]{2}/g;

  var etherTypes = {
    IPv4: 0x0800,
    ARP: 0x0806,
    RARP: 0x8035,
    VLAN: 0x8100,
    IPv6: 0x86DD,
    MPLSu: 0x8847,
    MPLSm: 0x8848,
    LLDP: 0x88cc
  };

  var AddressCons = function(value) {
      var result = [];
      if(value === undefined) {
        this.addr = [0, 0, 0, 0, 0, 0];
      } else if(typeof value == 'string' && macp.test(value)) {
        result = value.match(octp);
        this.addr = value.match(octp).slice(0,6);
      } else if(value instanceof AddressCons) {
        this.addr = value.addr.slice(0);
      } else {
        throw 'Invalid MAC: ' + value;
      }
  };

  var HeaderCons = function(src, dst, type) {
      if(src instanceof HeaderCons && dst === undefined && type === undefined) {
        this.src = src.src.clone();
        this.dst = src.dst.clone();
        this.type = src.type;
      } else {
        this.src = new AddressCons(src);
        this.dst = new AddressCons(dst);
        this.type = type || 0;
      }
  };

  return {
    Address : AddressCons,
    Header : HeaderCons,

    etherTypeByName : function(name) {
      if(name in etherTypes) {
        return etherTypes[name];
      } else {
        return 'Unknown EtherType';
      }
    },

    etherTypeByValue : function(value) {
      for(var prop in EtherTypes) {
        if(EtherTypes.hasOwnProperty(prop)) {
          if(value == EtherTypes[prop])
            return prop;
        }
      }
      return 'Unknown EtherType';
    }

  };
})();

Ethernet.Address.prototype.clone = function() {
  return new Ethernet.Address(this);
}

Ethernet.Address.prototype.bytes = function() {
  return 6;
}

Ethernet.Address.prototype.isBroadcast = function() {
  return this.addr[0] == 0xff && this.addr[1] == 0xff &&
    this.addr[2] == 0xff && this.addr[3] == 0xff &&
    this.addr[4] == 0xff && this.addr[5] == 0xff;
}

Ethernet.Address.prototype.isMulticast = function() {
  return this.addr[0] & 0x01;
}

Ethernet.Header.prototype.clone = function() {
  return new Ethernet.Header(this);
}

Ethernet.Header.prototype.bytes = function() {
  return 14;
}

var e0 = new Ethernet.Header('00:11:22:33:44:55', 'ff:ff:ff:ff:ff:ff', 0);
var e1 = e0.clone();
