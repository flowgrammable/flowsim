'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.context
 * @description
 * # context
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Context', function(Action, Instruction, UInt, Packet, Noproto) {

function Key(key, in_port, in_phy_port, tunnel_id) {
  if(_.isObject(key)) {
    if(key.in_port) {
      this.in_port = new UInt.UInt(key.in_port);
    }
    if(key.in_phy_port) {
      this.in_phy_port = new UInt.UInt(key.in_phy_port);
    }
    if(key.tunnel_id) {
      this.tunnel_id = new UInt.UInt(key.tunnel_id);
    }
    this.metadata = new UInt.UInt(key.metadata);
    this.VLAN     = _.map(key.VLAN, function(tag) { return tag.clone(); });
    this.MPLS     = _.map(key.MPLS, function(tag) { return tag.clone(); });
  } else if(_.isFinite(in_port)) {
    // Initialize input information
    this.in_port     = new UInt.UInt(null, in_port, 4);
    if(in_phy_port !== undefined && in_phy_port !== null) {
      this.in_phy_port = new UInt.UInt(null, in_phy_port, 4);
    }
    if(tunnel_id !== undefined && tunnel_id !== null) {
      this.tunnel_id   = new UInt.UInt(null, tunnel_id, 4);
    }
    this.metadata    = new UInt.UInt(null, null, 8);

    // Initialize array for stacks
    this.VLAN = [];
    this.MPLS = [];
  } else {
    throw 'Bad Key('+in_port+')';
  }
}

Key.prototype.clone = function() {
  return new Key(this);
};

Key.prototype.toView = function() {
  var result = [{
    name: 'Internal',
    attrs: [{
      name: 'in_port',
      value: this.in_port.toString()
    }]
  }];
  
  if(this.in_phy_port !== undefined && this.in_phy_port !== null) {
    result[0].attrs.push({
      name: 'in_phy_port',
      value: this.in_phy_port.toString()
    });
  }

  if(this.tunnel_id !== undefined && this.tunnel_id !== null) {
    result[0].attrs.push({
      name: 'tunnel_id',
      value: this.tunnel_id.toString()
    });
  }
  if(this.metadata !== undefined && this.metadata !== null) {
    result[0].attrs.push({
      name: 'metadata',
      value: this.metadata.toString(16)
    });
  }
  return result;
};

function Context(ctx, packet, buffer_id, in_port, in_phy_port, tunnel_id) {
  if(_.isObject(ctx)) {
    _.extend(this, ctx);
    this.packet = new Packet.Packet(ctx.packet);

    this._nxtTable = ctx._nxtTable;
    this._lstTable = ctx._lstTable;

    this.key = new Key(ctx.key);

    this.actionSet      = new Action.Set(ctx.actionSet);
    this.instructionSet = new Instruction.Set(ctx.instructionSet);
  } else if(packet && _.isNumber(buffer_id) && _.isNumber(in_port)) {
    // store a reference to the packet and buffer id
    this.packet = packet;
    this.buffer = buffer_id;
    this.meter  = -1;
    this.group  = -1;
    this.output = -1;
    this.queue  = -1;

    // initialize the first table target
    this._nxtTable = 0;
    this._lstTable = 0;

    // initialize the packet key
    this.key = new Key(null, in_port, in_phy_port, tunnel_id);

    // initialize an empty packet set
    this.actionSet      = new Action.Set();
    this.instructionSet = new Instruction.Set();
  } else {
    throw 'Bad Context('+packet+', '+buffer_id+', '+in_port+')';
  }
}

Context.prototype.clone = function() {
  return new Context(this);
};

Context.prototype.toView = function() {
  var result = {
    ctx: [{
      name: 'buffer',
      value: this.buffer
    }, {
      name: 'table',
      value: this.table()
    }],
    actionSet: this.instructionSet.toView(),
    instructionSet: this.actionSet.toView(),
    key: this.key.toView(),
    packet: this.packet.toView()
  };

  return result;
};

Context.prototype.table = function(table) {
  if(table) {
    this._lstTable = table;
    this._nxtTable = table;
  } else {
    return this._nxtTable;
  }
};

Context.prototype.setInstructions = function(ins) {
  this.instructionSet = ins;
};

Context.prototype.meter = function(meter) {
  if(meter) {
    this._meter = meter;
  } else {
    return this._meter;
  }
};

Context.prototype.metadata = function(metadata) {
  if(metadata) {
    // need actual code here
    this.key.metadata = this.key.metadata;
  }
};

Context.prototype.applyActions = function(actions, dp) {
  actions.execute(dp, this);
};

Context.prototype.clearActions = function() {
  this.actionSet.clear();
};

Context.prototype.writeActions = function(actions) {
  this.actionSet.concat(actions);
};

Context.prototype.hasGoto = function() {
  return this._nxtTable !== this._lstTable;
};

return {
  Key: Key,
  Context: Context
};

});
