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

function Port(port, id, phy){
  if(_.isObject(port)){
    this._id = new UInt.UInt(port._id);
    this._phy = new UInt.UInt(port._phy);
  } else {
    this._id = new UInt.UInt(null, id, 4);
    this._phy = new UInt.UInt(null, id, 4);
  }
}

Port.prototype.id = function(id){
  if(id){
    this._id = new UInt.UInt(id);
  } else {
    return this._id;
  }
};

Port.prototype.phy = function(phy){
  if(phy){
    this._phy = new UInt.UInt(phy);
  } else {
    return this._phy;
  }
};

Port.prototype.clone = function(){
  return new Port(this);
};

Port.prototype.toString = function() {
  return 'id: '+ this._id.toString(16);
};

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
  mkPort: mkPort
};

});
