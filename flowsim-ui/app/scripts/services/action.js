'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Action', function(Utils, UInt, Protocols) {

function Set(set){
  if(_.isObject(set)){
    this.actions = _(set.actions).map(function(act){
      return Utils.mkAction(act.protocol, act.field, act.op, act.value);
    });
  } else {
    this.actions = [];
  }
}

Set.prototype.clone = function(){
  return new Set(this);
};

Set.prototype.toBase = function(){
  return {
    actions: this.actions
  };
};

Set.prototype.clear = function(){
  this.actions = [];
};

var opPriority = {
  'copy-in': 10,
  'pop': 9,
  'push': 8,
  'copy-out': 7,
  'dec': 6,
  'set': 5,
};

function internalSort(a, b){
  var intPriority = {'Queue': 3, 'Group': 2, 'Output': 1};
  if(intPriority[a] > intPriority[b]){
    return -1;
  }
  if(intPriority[a] < intPriority[b]){
    return 1;
  }
  return 0;
}

function actSort(a, b){
  if(opPriority[a.op] > opPriority[b.op]){
    return -1;
  }
  if(opPriority[a.op] < opPriority[b.op]){
    return 1;
  }
  if(opPriority[a.op] === opPriority[b.op]){
    if(a.field === 'Group' || a.field === 'Queue' || a.field === 'Output'){
      return internalSort(a.field, b.field);
    }
    return protoSort(a.protocol, b.protocol);
  }
}

function protoSort(a, b){
  if(Protocols.protoPriority[a] > Protocols.protoPriority[b]){
    return -1;
  }
  if(Protocols.protoPriority[a] < Protocols.protoPriority[b]){
    return 1;
  }
  return 0;
}

Set.prototype.add = function(action){
  var idx = _(this.actions).indexOf(
              _(this.actions).findWhere({
                protocol: action.protocol,
                field: action.field,
                op: action.op
              }));
  if(idx < 0 || action.op === 'push' || action.op === 'pop'){
    this.actions.push(action);
  } else {
    this.actions[idx] = action;
  }
  this.actions.sort(actSort);
};

Set.prototype.remove = function(idx){
  this.actions.splice(idx, 1);
};

Set.prototype.step = function(dp, ctx) {
  if(this.actions.length){
    this.actions.shift().step(dp, ctx);
    return true;
  }
  return false;
};

Set.prototype.toView = function(){
  var view = _(this.actions).map(function(act){
    return act.toView();
  });
  return view;
};

Set.prototype.isEmpty = function(){
  return this.actions.length === 0;
};


return {
  Set: Set
};

});
