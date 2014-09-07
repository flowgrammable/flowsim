
(function(){

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
    
  var _etherTypeByName = function(name) {
    if(name in etherTypes) {
      return etherTypes[name];
    } else {
      return 'Unknown EtherType';
    }
  };

  var _etherTypeByValue = function(value) {
    for(var prop in EtherTypes) {
      if(EtherTypes.hasOwnProperty(prop)) {
        if(value == EtherTypes[prop])
          return prop;
      }
    }
    return 'Unknown';
  };

  var _etherTypeToString = function(value) {
    return _etherTypeByValue(value) + '(' + value + ')';
  };

  var _Address = function(value) {
      var result = [];
      if(value === undefined) {
        this.addr = [0, 0, 0, 0, 0, 0];
      } else if(typeof value === 'string' && macp.test(value)) {
        this.addr = value.match(octp).slice(0,6);
      } else if(value instanceof _Address) {
        this.addr = value.addr.slice(0);
      } else {
        throw 'Invalid MAC: ' + value;
      }
  };
  
  _Address.prototype.clone = function() {
    return new _Address(this);
  };

  _Address.prototype.bytes = function() {
    return 6;
  };

  _Address.prototype.isBroadcast = function() {
    return this.addr[0] == 0xff && this.addr[1] == 0xff &&
      this.addr[2] == 0xff && this.addr[3] == 0xff &&
      this.addr[4] == 0xff && this.addr[5] == 0xff;
  };

  _Address.prototype.isMulticast = function() {
    return this.addr[0] & 0x01;
  };

  _Address.prototype.set = function(v) {
    if(typeof v === 'string' && macp.test(value)) {
      this.addr = value.match(octp).slice(0,6);
    } else {
      throw 'Invalid MAC: ' + value;
    }
  };

  _Address.prototype.toString = function() {
    var result = [];
    for(var i=0; i<this.addr.length; ++i)
      result.push(this.addr[i].toString(16));
    return result.join(':');
  };

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

  _Header.prototype.name = function() {
    return 'Ethernet';
  };

  _Header.prototype.clone = function() {
    return new _Header(this);
  };

  _Header.prototype.bytes = function() {
    return 14;
  };

  _Header.prototype.setSrc = function(src) {
    this.src.set(src);
  };
  
  _Header.prototype.setDst = function(dst) {
    this.dst.set(dst);
  };

  _Header.prototype.setEtherType = function(et) {
    var tmp;
    if(typeof et === 'string') {
      tmp = etherTypeByName(et);
      if(typeof tmp === 'number') {
        this.type = tmp;
      } else {
        throw 'Unknown EtherType: ' + et;
      }
    } else if(typeof et === 'number') {
      this.type = et;
    } else {
      throw 'Bad EtherType: ' + et;
    }
  };

  // Return the local bindings
  var Ethernet = {
    etherTypeByName : _etherTypeByName,
    etherTypeByValue : _etherTypeByValue,
    Address : _Address,
    Header : _Header
  };

  var protocol = angular.module('fgProtocol');
  protocol.value('Ethernet', Ethernet);

})();

