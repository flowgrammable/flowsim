'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.port
 * @description
 * # port
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Port', function(UInt) {
    // AngularJS will instantiate a singleton by calling "new" on this function

var ReservedPorts = {
  'InPort'      : 0xfffffff8,
  'Table'       : 0xfffffff9,
  'Normal'      : 0xfffffffa,
  'Flood'       : 0xfffffffb,
  'All'         : 0xfffffffc,
  'Controller'  : 0xfffffffd,
  'Local'       : 0xfffffffe,
  'Any'         : 0xffffffff
};

function Port(port, id, phy){
  if(_.isObject(port)){
    this._id = new UInt.UInt(port._id);
    this._phy = new UInt.UInt(port._phy);
  } else {
    this._id = new UInt.UInt(null, id, 4);
    this._phy = new UInt.UInt(null, phy, 4);
  }
}

Port.prototype.id = function(id){
  if(id){
    if(id instanceof UInt.UInt){
      this._id = new UInt.UInt(id);
    } else {
      this._id = new UInt.UInt(null, id, 4);
    }
  } else {
    return this._id;
  }
};

Port.prototype.phy = function(phy){
  if(phy){
    if(phy instanceof UInt.UInt){
      this._phy = new UInt.UInt(phy);
    } else {
      this._phy = new UInt.UInt(phy);
    }
  } else {
    return this._phy;
  }
};

Port.prototype.clone = function(){
  return new Port(this);
};

Port.prototype.toString = function() {
  return 'id: '+ this._id.toString(16) +'\n'+
         'phy:'+ this._phy.toString(16);
};

Port.Match = function(match, id){
  if(_.isObject(match)){
    this._match = new UInt.Match(match._match);
  } else {
    this._match = new UInt.mkExact(id);
  }
};

Port.Match.prototype.match = function(id){
    return this._match.match(id._id);
};

function mkInportMatch(id){
  return new Port.Match(null, id);
}


var TIPS = {
  id: 'Logical identifier',
  phy: 'Physical identifier'
};

var TESTS = {
  id: UInt.is(32),
  phy: UInt.is(32)
};

function mkPort(id, phy){
  return new Port(null, id, phy);
}

return {
  Port: Port,
  mkPort: mkPort,
  Inport: Port,
  mkInportMatch: mkInportMatch,
  mkPhyportMatch: mkInportMatch
};

});
