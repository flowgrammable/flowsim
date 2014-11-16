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
                              ICMPV6, SCTP, TCP, UDP, ND, fgConstraints) {

function ActionField_UI(afu, category, name, key, Type, tip, test, action) {
  if(_.isObject(afu)) {
    _.extend(this, afu);
  } else {
    this.category = category;
    this.name     = name;
    this.action   = action ? action : '-n/a-';
    this.enabled  = true;     // Availability of action ie. profile - OFP 1.X
    this.key      = key;
    this.mkType   = function() {
      // this is a fancy way of building a runtime constructor
      var args = [Type, null, null].concat(_(arguments).values());
      var T = _.bind.apply(null, args);
      return new T();
    };
    this.tip = tip;
    this.test = test;
  }
}

ActionField_UI.prototype.clone = function() {
  return new ActionField_UI(this);
};

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

function mkOutputField() {
  return new ActionField_UI(
    null,         // default construction
    'Internal',   // Category of action
    'Output',     // Name of action
    'forward',    // might be vestigal
    Output,        // Type name of action
    'Egress port id',
    fgConstraints.isUInt(0, 0xffff)
  );
}

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

function mkGroupField() {
  return new ActionField_UI(
    null,         // default construction
    'Internal',   // Category of action
    'Group',      // Name of action
    'set_group',  // might be vestigal
    Group         // Type name of action
  );
}

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

function mkQueueField() {
  return new ActionField_UI(
    null,         // default construction
    'Internal',   // Category of action
    'Queue',      // Name of action
    'set_queue',  // might be vestigal
    Queue         // Type name of action
  );
}

function Pop(pop, tag){
  if(_.isObject(pop)) {
    this.tag = pop.tag;
  } else {
    this.tag = tag;
  }
}

Pop.prototype.clone = function() {
  return new Pop(this);
};

Pop.prototype.toString = function() {
  return this.tag;
};

Pop.prototype.step = function(dp, ctx) {
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(this.tag.name === ctx.packet.protocols[i].name){
      ctx.packet.protocols.splice(i, 1);
      // might need a check on this, seems like there should be boudns check
      ctx.packet.protocols[i-1].setPayload(ctx.packet.protocols[i].name);
    }
  }
};

function PopVLAN() {
  this.tag = VLAN.name;
}

PopVLAN.prototype.clone    = Pop.prototype.clone;
PopVLAN.prototype.toString = Pop.prototype.toString;
PopVLAN.prototype.step     = Pop.prototype.step;

function mkPopVLANField() {
  return new ActionField_UI(
    null,       // default construction
    'VLAN',     // Category of action
    'Tag',      // Name of action
    'pop_vlan', // might be vestigal
    PopVLAN,    // Type name of action
    'pop'       // Action behavior
  );
}

function PopMPLS() {
  this.tag = MPLS.name;
}

PopMPLS.prototype.clone    = Pop.prototype.clone;
PopMPLS.prototype.toString = Pop.prototype.toString;
PopMPLS.prototype.step     = Pop.prototype.step;

function mkPopMPLSField() {
  return new ActionField_UI(
    null,       // default construction
    'MPLS',     // Category of action
    'Tag',      // Name of action
    'pop_vlan', // might be vestigal
    PopMPLS,    // Type name of action
    'pop'       // Action behavior
  );
}

function CopyTTLIn(){
}

CopyTTLIn.prototype.clone = function(){
  return new CopyTTLIn();
};

CopyTTLIn.prototype.step = function(dp, ctx){
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(ctx.packet.protocols[i].name === MPLS.name &&
        (ctx.packet.protocols[i+1].name === IPV4.name ||
         ctx.packet.protocols[i+1].name === IPV6.name ||
         ctx.packet.protocols[i+1].name === MPLS.name)){
         ctx.packet.protocols[i+1].ttl(ctx.packet.protocols[i].ttl());
         return;
    }
  }
  throw 'CopyTTLIn(%s, %s) Miss' + ctx.packet.protocols[i].name +
        ctx.packet.protocols[i+1].name;
};

function CopyTTLOut(){
}

CopyTTLOut.prototype.clone = function(){
  return new CopyTTLOut();
};

CopyTTLOut.prototype.step = function(dp, ctx){
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(ctx.packet.protocols[i].name === MPLS.name &&
         ctx.packet.protocols[i-1].name === MPLS.name){
         ctx.packet.protocols[i-1].ttl(ctx.packet.protocols[i].ttl());
         return;
    } else if((ctx.packet.protocols[i].name === IPV4.name ||
              ctx.packet.protocols[i].name === IPV6.name) &&
              (ctx.packet.protocols[i-1].name === MPLS.name) ){
                ctx.packet.protocols[i-1].ttl(ctx.packet.protocols[i].ttl());
                return;
              }
  }
  throw 'CopyTTLIn(%s, %s) Miss' + ctx.packet.protocols[i].name +
        ctx.packet.protocols[i+1].name;
};

function SetTTL(st, proto, value){
  if(_.isObject(st)) {
    _.extend(this, st);
    this.value = st.value.clone();
  } else {
    this.protocol = proto;
    this.value = value;
    this.field = '_ttl';
  }
}

SetTTL.prototype.clone = function(){
  return new SetTTL(this);
};

SetTTL.prototype.step = function(dp, ctx) {
  var protocol = _.find(ctx.packet.protocols, function(protocol){
    return protocol.name === this.protocol;
  }, this);
  if(protocol) {
    protocol[this.field] = this.value;
  } else {
    console.log('SetTTL(%s, %s) Miss', this.protocol, this.value.toString());
  }
};

function DecTTL(st, proto){
  if(_.isObject(st)) {
    _.extend(this, st);
  } else {
    this.protocol = proto;
    this.field = '_ttl';
  }
}

DecTTL.prototype.clone = function(){
  return new DecTTL(this);
};

DecTTL.prototype.step = function(dp, ctx) {
  var protocol = _.find(ctx.packet.protocols, function(protocol){
    return protocol.name === this.protocol;
  }, this);
  if(protocol) {
    protocol.decTTL();
  } else {
    console.log('DecTTL(%s) Miss', this.protocol);
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
      ctx.packet.protocols[i].setPayload(ctx.packet.protocols[i+1].name);
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

function mkSetEthSrcField() {
  return new ActionField_UI(
    null,           // default construction
    'Ethernet',     // Category of action
    'Src',          // Name of action
    'set_eth_src',  // might be vestigal
    SetField,       // Type name of action
    'set'           // Action behavior
  );
}

function mkSetEthDstField() {
  return new ActionField_UI(
    null,           // default construction
    'Ethernet',     // Category of action
    'Dst',          // Name of action
    'set_eth_dst',  // might be vestigal
    SetField,       // Type name of action
    'set'           // Action behavior
  );
}

function mkSetEthTypeField() {
  return new ActionField_UI(
    null,           // default construction
    'Ethernet',     // Category of action
    'Type',         // Name of action
    'set_eth_type', // might be vestigal
    SetField,       // Type name of action
    'set'           // Action behavior
  );
}

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

Set.prototype.toView = function() {
  return [{
    name: 'eth',
    value1: 'src=',
    value2: '00:00:00:00:00:00'
  },{
    name: 'eth',
    value1: 'dst=',
    value2: '00:00:00:00:00:00'
  },{
    name: 'queue',
    value1: 5
  },{
    name: 'Output',
    value1: 2
  }];
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

Set.prototype.copy_ttl_out = function(action){
  if(action){
    this.actions.copy_ttl_out = action;
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

    this.actions.push_mpls.push(action);
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

Set.prototype.setField = function(action) {
  if(!_(this.actions).has('setField')) {
    this.actions.setField = {};
  }
  if(!_(this.actions.setField).has(action.protocol)) {
    this.actions.setField[action.protocol] = {};
  }
  this.actions.setField[action.protocol][action.field] = action;
};

Set.prototype.setTTL = function(action) {
  if(!_(this.actions).has('setField')) {
    this.actions.setField = {};
  }
  if(!_(this.actions.setField).has(action.protocol)) {
    this.actions.setField[action.protocol] = {};
  }
  this.actions.setField[action.protocol][action.field] = action;
};

Set.prototype.decTTL = function(action) {
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

  if(_(this.actions).has('setTTL')){
    if(_(this.actions.setField).keys().length > 0) {
      if(this.stepSetField(dp, ctx, IPV4.name)) {
        return true;
      } else {
        throw 'Bad setTTL Keys: ' + this.actions.setTTL.keys();
      }
    }
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
      } else if(this.stepSetField(dp, ctx, ND.name)){
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

List.prototype.toView = function() {
  return {
  };
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

function Available() {
  return [{
    protocol: 'Internal',
    actions: [
      mkOutputField(),
      mkGroupField(),
      mkQueueField(),
  ]}, {
    protocol: 'Ethernet',
    actions: [
      mkSetEthSrcField(),
      mkSetEthDstField(),
      mkSetEthTypeField(),
  ]}, {
    protocol: 'VLAN',
    actions: [
      mkPopVLANField()
  ]}, {
    protocol: 'MPLS',
    actions: [
      mkPopMPLSField()
  ]}];
}

function cloneAvailable(a) {
  return _(a).map(function(grouping) {
    return {
      protocol: grouping.protocol,
      actions: _(grouping.actions).map(function(action) {
        return action.clone();
      })
    };
  });
}

return {
  Output: Output,
  Group: Group,
  Queue: Queue,
  SetField: SetField,
  Set: Set,
  List: List,
  Push: Push,
  Pop: Pop,
  SetTTL: SetTTL,
  DecTTL: DecTTL,
  CopyTTLIn: CopyTTLIn,
  CopyTTLOut: CopyTTLOut,
  Available: Available,
  cloneAvailable: cloneAvailable
};

});
