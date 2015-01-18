'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Action', function(Protocols, Ethernet, VLAN, MPLS, ARP, IPv4, 
        IPv6, TCP, UDP, SCTP, ICMPv4, ICMPv6, Noproto, Utils) {

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
  if(Noproto.opPriority[a.op] > Noproto.opPriority[b.op]){
    return -1;
  }
  if(Noproto.opPriority[a.op] < Noproto.opPriority[b.op]){
    return 1;
  }
  if(Noproto.opPriority[a.op] === Noproto.opPriority[b.op]){
    if(a.field === 'Group' || a.field === 'Queue' || a.field === 'Output'){
      return internalSort(a.field, b.field);
    }
    return Protocols.protoSort(a.protocol, b.protocol);
  }
}

Set.prototype.add = function(action){
  this.actions.push(action);
  this.actions.sort(actSort);
};

Set.prototype.step = function(dp, ctx) {
  if(this.actions.length){
    this.actions.shift().step(dp, ctx);
    return true;
  }
  return false;
};

Set.prototype.toView = function(){
  var view = {};
  if(this.actions.copyTTLIn){

  }
  if(this.actions.setField){
    this.actToView('setField', 'Ethernet', view);
  }
  return view;
};

Set.prototype.isEmpty = function(){
  return this.actions.length === 0;
};

return {
  Set: Set
};

});
