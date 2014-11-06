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

function Output(port_id) {
  this.port_id = port_id;
}

Output.prototype.execute = function(dp, ctx) {
  dp.output(this.port_id, null, ctx);
};

Output.prototype.clone = function() {
  return new Output(this.port_id);
};

function Group(group_id) {
  this.group_id = group_id;
}

Group.prototype.execute = function(dp, ctx) {
  dp.output(null, this.group_id, ctx);
};

Group.prototype.clone = function() {
  return new Group(this.group_id);
};

function Queue(queue_id) {
  this.queue_id = queue_id;
}

Queue.prototype.execute = function(dp, ctx) {
  ctx.queue_id = this.queue_id;
};

Queue.prototype.clone = function() {
  return new Queue(this.queue_id);
};

function SetField(protocol, field, value) {
  this.protocol = protocol;
  this.field    = field;
  this.value    = value;
}

SetField.prototype.execute = function(dp, ctx) {
  var i, protocols;
  protocols = ctx.packet.protoccols;
  for(i=0; i<protocols.length; ++i) {
    if(protocols[i].name === this.protocol && protocols[i][this.field]) {
      protocols[i][this.field](this.value);
      return;
    }
  }
};

SetField.prototype.clone = function() {
  return new SetField(this.protocol, this.field, this.value);
};

function Set() {
  this.actions = {
    pop       : {},
    setFields : {}
  };
}

Set.prototype.clear = function() {
  this.actions = {
    pop: {},
    setFields : {}
  };
};

Set.prototype.concat = function(rhs) {
  var self = this;
  _.each(rhs.actions, function(key, val) {
    if(key === 'pop') {
      _.each(val, function(_key, _val) {
        self.actions.pop[_key] = _val.clone();
      });
    } else if(key === 'setFields') {
      _.each(val, function(_key, _val) {
        self.actions.setFields[_key] = _val.clone();
      });
    } else {
      self.actions[key] = val.clone();
    }
  });
};

Set.prototype.copy_ttl_in = function(action) {
  if(action) {
    this.actions.copy_ttl_in = action;
  } else {
    return this.actions.copy_ttl_in;
  }
};

Set.prototype.pop = function(action) {
  if(action) {
    this.actions.pop.push(action);
  } else {
    return this.actions.pop;
  }
};

Set.prototype.push_mpls = function(action) {
  if(action) {
    this.actions.push_mpls = action;
  } else {
    return this.actions.push_mpls;
  }
};

Set.prototype.push_pbb = function(action) {
  if(action) {
    this.actions.push_pbb = action;
  } else {
    return this.actions.push_pbb;
  }
};

Set.prototype.push_vlan = function(action) {
  if(action) {
    this.actions.push_vlan = action;
  } else {
    return this.actions.push_vlan;
  }
};

Set.prototype.dec_ttl = function(action) {
  if(action) {
    this.actions.dec_ttl = action;
  } else {
    return this.actions.dec_ttl_in;
  }
};

Set.prototype.setFields = function(action) {
  if(action) {
    this.actions.setFields.push(action);
  } else {
    return this.actions.setFields;
  }
};

Set.prototype.queue = function(action) {
  if(action) {
    this.actions.queue = action;
  } else {
    return this.actions.queue;
  }
};

Set.prototype.group = function(action) {
  if(action) {
    this.actions.group = action;
  } else {
    return this.actions.group;
  }
};

Set.prototype.output = function(action) {
  if(action) {
    this.actions.output = action;
  } else {
    return this.actions.output;
  }
};

// Execute the action set in a precise ordering
Set.prototype.execute = function(dp, ctx) {
 
  if(this.actions.copy_ttl_in) {
    this.actions.copy_ttl_in.execute(dp, ctx);
  }

  _.each(this.actions.pop, function(action) {
    action.execute(dp, ctx);
  });

  if(this.actions.push_mpls) {
    this.actions.push_mpls.execute(dp, ctx);
  }

  if(this.actions.push_pbb) {
    this.actions.push_pbb.execute(dp, ctx);
  }

  if(this.actions.push_vlan) {
    this.actions.push_vlan.execute(dp, ctx);
  }

  if(this.actions.copy_ttl_out) {
    this.actions.copy_ttl_out.execute(dp, ctx);
  }

  if(this.actions.dec_ttl) {
    this.actions.dec_ttl.execute(dp, ctx);
  }

  _.each(this.actions.setField, function(setField) {
    setField.execute(dp, ctx);
  });

  if(this.actions.queue) {
    this.actions.queue.execute(dp, ctx);
  }
 
  // Execute group if present or output if present
  if(this.actions.group) {
    this.actions.group.execute(dp, ctx);
  } else if(this.actions.output) {
    this.actions.output.execute(dp, ctx);
  }
};

function List() {
  this.actions = [];
}

List.prototype.add = function(action) {
  this.actions.push(action);
};

List.prototype.execute = function(dp, ctx) {
  _.each(this.actions, function(action) {
    action.execute(dp, ctx);
  });
};

return {
  Output: Output,
  Group: Group,
  Queue: Queue,
  SetField: SetField,
  Set: Set,
  List: List
};
  
});
