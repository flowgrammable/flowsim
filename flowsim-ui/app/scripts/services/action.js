'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Action', function() {

function Set(set){
  if(_.isObject(set)){

  } else {
    this.actions = {};
  }
}

Set.prototype.clone = function(){
  return new Set(this);
};

Set.prototype.clear = function(){
  this.actions = {};
};

Set.prototype.add = function(action){
  switch(action.op){
    case 'copy-in':
      this.actions.copyTTLIn = action;
      break;
    default:
      break;
  }
};

Set.prototype.get = function(){

};

Set.prototype.step = function(dp, ctx) {
  if(this.actions.copyTTLIn) {
    this.actions.copyTTLIn.step(dp, ctx);
    delete this.actions.copyTTLIn;
  }
}

Set.prototype.view = function(){
  return {
    copyTTLIn: this.copyTTLIn.value
  }
};

Set.prototype.isEmpty = function(){
  return _(this.actions).keys().length === 0;
}

return {
  Set: Set
};

});
