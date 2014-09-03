
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

  var _Address = function(value) {
      var result = [];
      if(value === undefined) {
        this.addr = [0, 0, 0, 0, 0, 0];
      } else if(typeof value == 'string' && macp.test(value)) {
        result = value.match(octp);
        this.addr = value.match(octp).slice(0,6);
      } else if(value instanceof _Address) {
        this.addr = value.addr.slice(0);
      } else {
        throw 'Invalid MAC: ' + value;
      }
  };
  
  _Address.prototype.clone = function() {
    return new _Address(this);
  }

  _Address.prototype.bytes = function() {
    return 6;
  }

  _Address.prototype.isBroadcast = function() {
    return this.addr[0] == 0xff && this.addr[1] == 0xff &&
      this.addr[2] == 0xff && this.addr[3] == 0xff &&
      this.addr[4] == 0xff && this.addr[5] == 0xff;
  }

  _Address.prototype.isMulticast = function() {
    return this.addr[0] & 0x01;
  }

  var _Header = function(src, dst, type) {
      if(src instanceof _Header && dst === undefined && type === undefined) {
        this.src = src.src.clone();
        this.dst = src.dst.clone();
        this.type = src.type;
      } else {
        this.src = new _Address(src);
        this.dst = new _Address(dst);
        this.type = type || 0;
      }
  };

  _Header.prototype.clone = function() {
    return new _Header(this);
  }

  _Header.prototype.bytes = function() {
    return 14;
  }

  return {
    Address : _Address,
    Header : _Header,

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

var e0 = new Ethernet.Header('00:11:22:33:44:55', 'ff:ff:ff:ff:ff:ff', 0);
var e1 = e0.clone();
