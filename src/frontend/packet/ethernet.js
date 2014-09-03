
var Ethernet = (function(){

  var macp = /(([0-9a-fA-F]{2})(-|:)){5}([0-9a-fA-F]{2})/;
  var octp = /[0-9a-fA-F]{2}/g;

  return {

    Address : function(value) {
      var result = [];
      if(value === undefined) {
        this.addr = [0, 0, 0, 0, 0, 0];
      } else if(typeof value == 'string' && macp.test(value)) {
        result = value.match(octp);
        this.addr = value.match(octp).slice(0,6);
      } else if(value instanceof(Address)) {
        this.addr = value.addr.slice(0);
      } else {
        throw 'Invalid MAC: ' + value;
      }
    },

    Header : function(src, dst, type) {
      this.src = new Address(src);
      this.dst = new Address(dst);
      this.type = type || 0;
    }

  };
})();

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

Ethernet.Header.prototype.bytes = function() {
  return 14;
}

