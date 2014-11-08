'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.match
 * @description
 * # match
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Match', function(ETHERNET, Utils) {

function Match(match) {
  if(match instanceof Match || match) {
    _.extend(this, match);
    _.each(match.matches, function(m) { return m.clone(); });
  } else {
    this.matches = [];
  }
}

Match.prototype.clone = function() {
  return new Match(this);
};

Match.prototype.add = function(match) {
  this.matches.push(match);
};

Match.prototype.del = function(idx) {
  this.matches.splice(idx, 1);
};

Match.prototype.match = function(key) {
  var i;
  for(i=0; i<this.matches.length; i++) {
    if(!this.matches[i].match(key)) {
      return false;
    }
  }
  return true;
};

Match.Profile = function() {
};

Match.Ethernet = {};

Match.Ethernet.Src = function(addr, mask) {
  this.match = new ETHERNET.MAC.Match(addr, mask);
};

Match.Ethernet.Src.prototype.match = function(key) {
  return key.eth_src ? this.match.match(key.eth_src) : false;
};

Match.Ethernet.Dst = function(addr, mask) {
  this.match = new ETHERNET.MAC.Match(addr, mask);
};

Match.Ethernet.Dst.prototype.match = function(key) {
  return key.eth_dst ? this.match.match(key.eth_dst) : false;
};

Match.Ethernet.Type = function(value, mask) {
  this.match = new Utils.UInt.Match(value, mask);
};

Match.Ethernet.Type.prototype.match = function(key) {
  return key.eth_type ? this.match.match(key.eth_type) : false;
};

return {
  Match: Match
};

});
