'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Action', function(Protocols) {

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
      this.copyTTLIn(action);
      break;
    case 'pop':
      this.popTags(action);
      break;
    case 'push':
      this.pushTags(action);
      break;
    case 'copy-out':
      this.copyTTLOut(action);
      break;
    case 'dec':
      this.decTTL(action);
      break;
    case 'set':

    default:
      break;
  }
};

Set.prototype.popTags = function(action){
  if(action){
    if(!_(this.actions).has('pop'+action.protocol)){
      this.actions['pop'+action.protocol] = [];
    }
    this.actions['pop'+action.protocol].push(action);
  }
};

Set.prototype.pushTags = function(action){
  if(action){
    if(!_(this.actions).has('push'+action.protocol)){
      this.actions['push'+action.protocol] = [];
    }
    this.actions['push'+action.protocol].push(action);
  }
};

Set.prototype.copyTTLIn = function(action){
  if(action){
    if(!_(this.actions).has('copyTTLIn')){
      this.actions.copyTTLIn = {};
    }
    this.actions.copyTTLIn[action.protocol] = action;
  }
};

Set.prototype.copyTTLOut = function(action){
  if(action){
    if(!_(this.actions).has('copyTTLOut')){
      this.actions.copyTTLOut = {};
    }
    this.actions.copyTTLOut[action.protocol] = action;
  }
};

Set.prototype.decTTL = function(action){
  if(action){
    if(!_(this.actions).has('decTTL')){
      this.actions.decTTL = {};
    }
    this.actions.decTTL[action.protocol] = action;
  }
};

Set.prototype.setField = function(action) {
  if(!_(this.actions).has('setField')) {
    this.actions.setField = {};
  }
  if(!_(this.actions.setField).has(action.protocol)) {
    this.actions.setField[action.protocol] = {};
  }
  this.actions.setField[action.protocol][action.field] = action;
};

Set.prototype.get = function(){

};

Set.prototype.stepCopyIn = function(dp, ctx, proto){
  if(_(this.actions.copyTTLIn).has(proto)){
    this.actions.copyTTLIn[proto].step(dp, ctx);
    delete this.actions.copyTTLIn[proto];
    if(_(this.actions.copyTTLIn).keys().length === 0){
      delete this.actions.copyTTLIn;
    }
    return true;
  } else {
    return false;
  }
}

Set.prototype.stepCopyOut = function(dp, ctx, proto){
  if(_(this.actions.copyTTLOut).has(proto)){
    this.actions.copyTTLOut[proto].step(dp, ctx);
    delete this.actions.copyTTLOut[proto];
    if(_(this.actions.copyTTLOut).keys().length === 0){
      delete this.actions.copyTTLOut;
    }
    return true;
  } else {
    return false;
  }
}

Set.prototype.stepDecTTL = function(dp, ctx, proto){
  if(_(this.actions.decTTL).has(proto)){
    this.actions.decTTL[proto].step(dp, ctx);
    delete this.actions.decTTL[proto];
    if(_(this.actions.decTTL).keys().length === 0){
      delete this.actions.decTTL;
    }
    return true;
  } else {
    return false;
  }
}

Set.prototype.stepArray = function(dp, ctx, arrayName){
  var state = false;
  if(_(this.actions).has(arrayName)) {

    if(this.actions[arrayName].length > 0) {
      this.actions[arrayName][0].step(dp, ctx);
      this.actions[arrayName].splice(0, 1);
      state = true;
    }

    if(this.actions[arrayName].length === 0) {
      delete this.actions[arrayName];
    }
  }
  return state;
}

Set.prototype.stepSetField = function(dp, ctx, proto) {
  var key;
  if(_(this.actions.setField).has(proto)) {
    key = _(this.actions.setField[proto]).keys()[0];
    this.actions.setField[proto][key].step(dp, ctx);
    delete this.actions.setField[proto][key];
    if(_(this.actions.setField[proto]).keys().length === 0) {
      delete this.actions.setField[proto];
    }
    if(_(this.actions.setField).keys().length === 0) {
      delete this.actions.setField;
    }
    return true;
  } else {
    return false;
  }
};



Set.prototype.step = function(dp, ctx) {
  // Copy TTLIn
  if(this.actions.copyTTLIn) {
    if(_(this.actions.copyTTLIn).keys().length > 0){
      //FIXME: this doesnt throw error
      Protocols.copyIn.every(function(proto){
        if(this.stepCopyIn(dp, ctx, proto)){
          return true;
        }
      }, this);
    }
  }

  //  pop, push
  if(this.stepArray(dp, ctx, 'popMPLS')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'popPBB')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'popVLAN')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'pushMPLS')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'pushPBB')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'pushVLAN')) {
    return true;
  }

  // copy ttlout
  if(this.actions.copyTTLOut) {
    if(_(this.actions.copyTTLOut).keys().length > 0){
      if(this.stepCopyOut(dp, ctx, 'MPLS')){
        return true;
      } else if(this.stepCopyOut(dp, ctx, 'IPv4')){
        return true;
      } else if(this.stepCopyOut(dp, ctx, 'IPv6')){
        return true;
      }
    }
  }

  // dec ttl
  if(this.actions.decTTL) {
    if(_(this.actions.decTTL).keys().length > 0){
      if(this.stepDecTTL(dp, ctx, 'MPLS')){
        return true;
      } else if(this.stepDecTTL(dp, ctx, 'IPv4')){
        return true;
      } else if(this.stepDecTTL(dp, ctx, 'IPv6')){
        return true;
      }
    }
  }

  if(this.actions.setField) {
    if(_(this.actions.setField).keys().length > 0) {
      Protocols.Protocols.every(function(proto){
        if(this.stepSetField(dp, ctx, proto.name)){
          return true;
        }
      });
      /*if(this.stepSetField(dp, ctx, Ethernet.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, VLAN.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ARP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, MPLS.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, IPV4.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, IPV6.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ICMPV4.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ICMPV6.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, TCP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, UDP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, SCTP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ETHERNET.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ND.name)){
        return true;
      } else {
        throw 'Bad setField keys: '+this.actions.setField.keys();
      } */
    }
  }

  return false;
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
