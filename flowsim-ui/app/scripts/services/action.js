'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Action', function(ETHERNET, VLAN, MPLS, ARP, IPV4, IPV6, ICMPV4,
                              ICMPV6, SCTP, TCP, UDP) {

function Output(output, port_id) {
  if(_.isObject(output)) {
    _.extend(this, output);
  } else {
    this.port_id = port_id;
  }
}

Output.prototype.clone = function() {
  return new Output(this);
};

Output.prototype.toString = function() {
  return 'output('+this.port_id+')';
};

Output.prototype.step = function(dp, ctx) {
  dp.output(this.port_id, null, ctx);
};

function Group(group, group_id) {
  if(_.isObject(group)) {
    _.extend(this, group);
  } else {
    this.group_id = group_id;
  }
}

Group.prototype.clone = function() {
  return new Group(this);
};

Group.prototype.toString = function() {
  return 'group('+this.group_id+')';
};

Group.prototype.step = function(dp, ctx) {
  dp.output(null, this.group_id, ctx);
};

function Queue(queue, queue_id) {
  if(_.isObject(queue)) {
    _.extend(this, queue);
  } else {
    this.queue_id = queue_id;
  }
}

Queue.prototype.clone = function() {
  return new Queue(this);
};

Queue.prototype.toString = function() {
  return 'queue('+this.queue_id+')';
};

Queue.prototype.step = function(dp, ctx) {
  ctx.queue_id = this.queue_id;
};

function Pop(pop, tag){
  if(_.isObject(pop)) {
    this.tag = pop.tag.clone();
  } else {
    this.tag = tag;
  }
}

Pop.prototype.clone = function() {
  return new Pop(this);
};

Pop.prototype.toString = function() {
  return this.pop.toString();
};

Pop.prototype.step = function(dp, ctx) {
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(this.tag.popHere(ctx.packet.protocols[i])){
      ctx.packet.protocols.splice(i, 1);
      ctx.packet.protocols[i-1].setPayload(ctx.packet.protocols[i].name);
    }
  }
};

function Push(psh, tag) {
  if(_.isObject(psh)) {
    this.tag = psh.tag.clone();
  } else {
    this.tag = tag;
  }
}

Push.prototype.clone = function() {
  return new Push(this);
};

Push.prototype.toString = function() {
  return this.tag.toString();
};

Push.prototype.step = function(dp, ctx) {
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(this.tag.insertHere(ctx.packet.protocols[i])){
      this.tag.setDefaults(ctx.packet.protocols, i);
      ctx.packet.protocols.splice(i, 0, this.tag);
      ctx.packet.protocols[i-1].setPayload(ctx.packet.protocols[i].name);
      return;
    }
  }
  throw 'Push failed';

};

function SetField(sf, proto, field, value) {
  if(_.isObject(sf)) {
    _.extend(this, sf);
    this.value = sf.value.clone();
  } else {
    this.protocol = proto;
    this.field    = field;
    this.value    = value;
  }
}

SetField.prototype.clone = function() {
  return new SetField(this);
};

SetField.prototype.toString = function() {
  return this.protocol+'('+this.field+'='+this.value.toString()+')';
};

SetField.prototype.step = function(dp, ctx) {
  var protocol = _.find(ctx.packet.protocols, function(protocol) {
    return protocol.name === this.protocol && _(protocol).has(this.field);
  }, this);
  if(protocol) {
    protocol[this.field] = this.value;
  } else {
    console.log('SetField(%s, %s, %s) Miss', this.protocol, this.field,
                this.value.toString());
  }
};

function Set(set) {
  if(_.isObject(set)) {
    //FIXME: implement
    _.each(set.actions, function(key) {
      if(key === 'setField') {
      } else if(key === 'pop_mpls') {
      } else if(key === 'pop_pbb') {
      } else if(key === 'pop_vlan') {
      } else if(key === 'pop_mpls') {
      } else if(key === 'pop_pbb') {
      } else if(key === 'pop_vlan') {
      } else {
      }
    }, this);
  } else {
    this.actions = {};
  }
}

Set.prototype.clone = function() {
  return new Set(this);
};

Set.prototype.clear = function() {
  this.actions = {};
};

Set.prototype.get = function() {
  //FIXME: needs implementation
};

Set.prototype.concat = function() {
  //FIXME: needs implementation
};

Set.prototype.copy_ttl_in = function(action) {
  if(action) {
    this.actions.copy_ttl_in = action;
  }
};

Set.prototype.pop_mpls = function(action) {
  if(action) {
    if(!_(this.actions).has('pop_mpls')) {
      this.actions.pop_mpls = [];
    }
    this.actions.pop_mpls.push(action);
  }
};

Set.prototype.pop_pbb = function(action) {
  if(action) {
    if(!_(this.actions).has('pop_pbb')) {
      this.actions.pop_pbb = [];
    }
    this.actions.pop_pbb.push(action);
  }
};

Set.prototype.pop_vlan = function(action) {
  if(action) {
    if(!_(this.actions).has('pop_vlan')) {
      this.actions.pop_vlan = [];
    }
    this.actions.pop_vlan.push(action);
  }
};

Set.prototype.push_mpls = function(action) {
  if(action) {
    if(!_(this.actions).has('push_mpls')) {
      this.actions.push_mpls = [];
    }

    this.actions.push_mpls = action;
  }
};

Set.prototype.push_pbb = function(action) {
  if(action) {
    if(!_(this.actions).has('push_pbb')) {
      this.actions.push_pbb = [];
    }
    this.actions.push_pbb = action;
  }
};

Set.prototype.push_vlan = function(action) {
  if(action) {
    if(!_(this.actions).has('push_vlan')) {
      this.actions.push_vlan = [];
    }
    this.actions.push_vlan.push(action);
  }
};

Set.prototype.dec_ttl = function(action) {
  if(action) {
    this.actions.dec_ttl = action;
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

Set.prototype.queue = function(action) {
  if(action) {
    this.actions.queue = action;
  }
};

Set.prototype.group = function(action) {
  if(action) {
    this.actions.group = action;
    if(_(this.actions).has('output')) {
      delete this.actions.output;
    }
  }
};

Set.prototype.output = function(action) {
  if(action && !_(this.actions).has('group')) {
    this.actions.output = action;
  }
};

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

Set.prototype.stepArray = function(dp, ctx, name) {
  var state = false;
  if(_(this.actions).has(name)) {

    if(this.actions[name].length > 0) {
      this.actions[name][0].step(dp, ctx);
      this.actions[name].splice(0, 1);
      state = true;
    }

    if(this.actions[name].length === 0) {
      delete this.actions[name];
    }
  }
  return state;
};

Set.prototype.empty = function() {
  return _(this.actions).keys().length === 0;
};

// Execute the action set in a precise ordering
Set.prototype.step = function(dp, ctx) {

  if(this.actions.copy_ttl_in) {
    this.actions.copy_ttl_in.step(dp, ctx);
    delete this.actions.copy_ttl_in;
    return true;
  }

  if(this.stepArray(dp, ctx, 'pop_mpls')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'pop_pbb')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'pop_vlan')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'push_mpls')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'push_pbb')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'push_vlan')) {
    return true;
  }

  if(this.actions.copy_ttl_out) {
    this.actions.copy_ttl_out.step(dp, ctx);
    delete this.actions.copy_ttl_out;
    return true;
  }

  if(this.actions.dec_ttl) {
    this.actions.dec_ttl.step(dp, ctx);
    delete this.actions.dec_ttl;
    return true;
  }

  if(_(this.actions).has('setField')) {
    if(_(this.actions.setField).keys().length > 0) {
      if(this.stepSetField(dp, ctx, ETHERNET.name)) {
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
      } else {
        throw 'Bad setField keys: '+this.actions.setField.keys();
      }
    }
  }

  if(this.actions.queue) {
    this.actions.queue.step(dp, ctx);
    delete this.actions.queue;
    return true;
  }

  // Execute group if present or output if present
  if(this.actions.group) {
    this.actions.group.step(dp, ctx);
    delete this.actions.group;
    return true;
  }
  if(this.actions.output) {
    this.actions.output.step(dp, ctx);
    delete this.actions.output;
    return true;
  }
  return false;
};

Set.prototype.execute = function(dp, ctx) {
  while(!this.empty()) {
    this.step(dp, ctx);
  }
};

function List(list) {
  if(_.isObject(list)) {
    this.actions = _.map(list.actions, function(action) {
      return action.clone();
    });
  } else {
    this.actions = [];
  }
}

List.prototype.clone = function() {
  return new List(this);
};

List.prototype.push = function(action) {
  this.actions.push(action);
};

List.prototype.empty = function() {
  return this.actions.length === 0;
};

List.prototype.step = function(dp, ctx) {
  if(this.actions.length === 0) {
    return;
  }
  this.actions[0].step(dp, ctx);
  this.actions.splice(0, 1);
};

List.prototype.execute = function(dp, ctx) {
  while(!this.empty()) {
    this.step(dp, ctx);
  }
};

return {
  Output: Output,
  Group: Group,
  Queue: Queue,
  SetField: SetField,
  Set: Set,
  List: List,
  Push: Push,
  Pop: Pop
};

});
