'use strict';

angular.module('flowsimUiApp')
  .factory('IPV4', function IPV4(fgUI, fgConstraints, UInt){

var NAME = 'IPv4';

//var ipv4Pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
var ipv4Pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

function isIPv4(ipv4) {
  return ipv4Pattern.test(ipv4) &&
    _.every(ipv4.split('.'), fgConstraints.isUInt(0, 255));
}

var Payloads = {
  'ICMPv4': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132,
  'Payload' : 0
};




function _IPV4() {
  this.name = NAME;
  this.bytes = 20;
  this.fields = {
    dscp: 0,
    ecn: 0,
    proto: 0,
    src: '0.0.0.0',
    dst: '0.0.0.0'
  };
}

function IPv4(ipv4, dscp, ecn, proto, src, dst) {
  this.bytes = 20;
  this.name = NAME;
  if(ipv4 instanceof IPv4 || _.isObject(ipv4)) {
    this._dscp    = new UInt.UInt(ipv4.scp);
    this._ecn     = new UInt.UInt(ipv4.ecn);
    this._proto   = new UInt.UInt(ipv4.proto);
    this._src     = new IPv4.IP(ipv4.src);
    this._dst     = new IPv4.IP(ipv4.dst);
  } else {
    this._dscp    = new UInt.UInt(dscp, 6);
    this._ecn     = new UInt.UInt(ecn, 2);
    this._proto   = new UInt.UInt(proto, 8);
    this._src     = new IPv4.IP(src);
    this._dst     = new IPv4.IP(dst);
  }
}

function dot2num(dot){
    var d = dot.split('.');
    return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

function IP(ipv4){
  var tmp;
  if(typeof ipv4 === 'string'){
    tmp = ipv4.match(ipv4Pattern);
    if(!tmp || !_.every(ipv4.split('.'), fgConstraints.isUInt(0, 255))){
        throw 'Bad IPv4 Address: ' + ipv4;
    }
    this.value = dot2num(ipv4);
    this.bytes = 4;
  } else if(ipv4 instanceof IP) {
    this.value = _.clone;
    this.bytes = 4;
  } else if(ipv4 === undefined){
    this.value = 0;
    this.bytes = 4;
  } else {
    _.extend(this, ipv4);
    this.value = _.clone(ipv4.value);
    this.bytes = 4;
  }
}

IP.Match = UInt.Match;
/*IPv4.IP.Match = function(addr, mask){
  if(addr instanceof IPv4.IP.Match){
    this.addr = new IPv4.IP(addr.addr);
    this.mask = new IPv4.IP(mask.mask);
  } else if(addr && mask === undefined){
    _.extend(this.addr);
    this.addr = new IPv4.IP(addr.addr);
    this.mask = new IPv4.IP(addr.mask);
  } else {
    this.addr = new IPv4.IP(addr);
    this.mask = new IPv4.IP(mask);
  }
}; */


function IPv4_UI(ipv4){
  ipv4 = ipv4 === undefined ? new _IPV4() : ipv4;
  this.name = NAME;
  this.bytes = ipv4.bytes;
  this.attrs = _.map(ipv4.fields, function(value, key){
    switch(key) {
      case 'dscp':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 0x3f),
          tip: 'Differentiated Services Code Type'
        };
      case 'ecn':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 0x03),
          tip: 'Explicit Congestion Notification'
        };
      case 'proto':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 255),
          tip: 'Protocol'
        };
      case 'src':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Source Address'
        };
      case 'dst':
        return {
          name: key,
          value: value,
          test: isIPv4,
          tip: 'Destination Address'
        };
      default:
        return {
          name: key,
          value: value,
          test: function() { return true; },
          tip: 'Unknown'
        };
    }
  });
}

IPv4_UI.prototype.toBase = function() {
  return new IPv4(this);
};

IPv4_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

IPv4_UI.prototype.clearPayload = function() {
  this.attrs[2].value = 0;
};


return {
  name:     NAME,
  IPv4:     IPv4,
  IPv4_UI:  IPv4_UI,
  create:   function(ipv4)    { return new IPv4(ipv4); },
  createUI: function(ipv4)    { return new IPv4_UI(ipv4); },
  Payloads: Object.keys(Payloads),
  IP: IP
};

});
